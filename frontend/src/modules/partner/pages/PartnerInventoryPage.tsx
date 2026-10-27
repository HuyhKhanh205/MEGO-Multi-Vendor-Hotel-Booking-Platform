import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import BulkInventoryPanel from "../components/inventory/BulkInventoryPanel";
import InventoryGrid, { InventoryLegend } from "../components/inventory/InventoryGrid";
import HotelRequired from "../components/layout/HotelRequired";
import LoadError from "../components/shared/LoadError";
import partnerInventoryApi from "../services/partnerInventoryApi";
import { PartnerApiError } from "../services/partnerHttp";
import partnerRoomApi from "../services/partnerRoomApi";
import type { HotelSummaryDto, InventoryUpdateRequest, RoomInventoryDto, RoomTypeDto } from "../types/backend.types";
import { addDays, dateRange, formatDayMonth, todayIso } from "../utils/formatters";
import { LOW_STOCK_THRESHOLD } from "../utils/inventoryRules";

interface LoadState<T> {
  key: string;
  data: T | null;
  error: string | null;
}

const KpiTile = ({ label, value, hint, tone = "text-slate-900" }: { label: string; value: string | number; hint?: string; tone?: string }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <p className={`mt-1 text-2xl font-extrabold ${tone}`}>{value}</p>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

const InventoryContent = ({ hotel }: { hotel: HotelSummaryDto }) => {
  const today = todayIso();
  const [roomTypesState, setRoomTypesState] = useState<LoadState<RoomTypeDto[]>>({ key: "", data: null, error: null });
  const [roomTypesRequest, setRoomTypesRequest] = useState(1);
  const [start, setStart] = useState(today);
  const [period, setPeriod] = useState<7 | 14>(14);
  const [filterId, setFilterId] = useState<number | "ALL">("ALL");
  const [inventoryRequest, setInventoryRequest] = useState(1);
  const [inventoryState, setInventoryState] = useState<LoadState<RoomInventoryDto[]>>({ key: "", data: null, error: null });
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = String(roomTypesRequest);
    partnerRoomApi
      .listRoomTypes(hotel.id)
      .then((data) => { if (!cancelled) setRoomTypesState({ key, data, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setRoomTypesState({ key, data: null, error: error instanceof Error ? error.message : "Không tải được hạng phòng." }); });
    return () => { cancelled = true; };
  }, [hotel.id, roomTypesRequest]);

  const end = addDays(start, period - 1);
  const inventoryKey = `${start}#${end}#${inventoryRequest}`;

  useEffect(() => {
    let cancelled = false;
    partnerInventoryApi
      .getInventory(hotel.id, start, end)
      .then((data) => { if (!cancelled) setInventoryState({ key: inventoryKey, data, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setInventoryState({ key: inventoryKey, data: null, error: error instanceof Error ? error.message : "Không tải được tồn kho." }); });
    return () => { cancelled = true; };
  }, [hotel.id, start, end, inventoryKey]);

  const allRoomTypes = useMemo(() => roomTypesState.data ?? [], [roomTypesState.data]);
  const roomTypes = filterId === "ALL" ? allRoomTypes : allRoomTypes.filter((item) => item.id === filterId);
  const days = useMemo(() => dateRange(start, end), [start, end]);

  const cells = useMemo(() => {
    const map: Record<string, RoomInventoryDto> = {};
    (inventoryState.data ?? []).forEach((cell) => { map[`${cell.roomTypeId}:${cell.date}`] = cell; });
    return map;
  }, [inventoryState.data]);

  if (roomTypesState.error) return <LoadError message={roomTypesState.error} onRetry={() => setRoomTypesRequest((id) => id + 1)} />;
  if (!roomTypesState.data) return <div className="h-[560px] animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải tồn kho" />;

  if (!allRoomTypes.length) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
        <h1 className="text-xl font-extrabold text-slate-900">Chưa có hạng phòng để quản lý tồn kho</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo hạng phòng ở mục "Loại phòng & Phòng" trước.</p>
      </div>
    );
  }

  const loaded = inventoryState.key === inventoryKey && !!inventoryState.data;
  const reload = () => setInventoryRequest((id) => id + 1);

  const replaceCell = (saved: RoomInventoryDto) =>
    setInventoryState((current) => ({ ...current, data: current.data?.map((cell) => (cell.id === saved.id ? saved : cell)) ?? null }));

  const saveCell = async (cell: RoomInventoryDto, patch: Omit<InventoryUpdateRequest, "version">, success: string): Promise<boolean> => {
    setBusyId(cell.id);
    try {
      replaceCell(await partnerInventoryApi.updateInventory(cell.id, { ...patch, version: cell.version }));
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được tồn kho.");
      if (error instanceof PartnerApiError && error.status === 409) reload();
      return false;
    } finally {
      setBusyId(null);
    }
  };

  // KPI tính từ đúng dữ liệu đang hiển thị trên lưới (cùng bộ lọc hạng phòng và kỳ xem)
  const visibleCells = loaded ? roomTypes.flatMap((roomType) => days.map((date) => cells[`${roomType.id}:${date}`]).filter((cell): cell is RoomInventoryDto => !!cell)) : [];
  const focusDay = today >= start && today <= end ? today : start;
  const focusCells = visibleCells.filter((cell) => cell.date === focusDay);
  const focusTotal = focusCells.reduce((sum, cell) => sum + cell.totalRooms, 0);
  const focusAvailable = focusCells.filter((cell) => !cell.closed).reduce((sum, cell) => sum + cell.availableRooms, 0);
  const focusBooked = focusCells.reduce((sum, cell) => sum + cell.totalRooms - cell.availableRooms, 0);
  const closedCount = visibleCells.filter((cell) => cell.closed).length;
  const lowCount = visibleCells.filter((cell) => !cell.closed && cell.date >= today && cell.availableRooms <= LOW_STOCK_THRESHOLD).length;
  const focusLabel = focusDay === today ? "hôm nay" : formatDayMonth(focusDay);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Tồn kho & Đóng/Mở bán</h1>
        <p className="mt-1 text-sm text-slate-500">{hotel.name} · số phòng mở bán theo từng đêm</p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Thống kê tồn kho">
        <KpiTile label={`Phòng trống ${focusLabel}`} value={loaded ? `${focusAvailable}/${focusTotal}` : "–"} hint="Không tính hạng đang khóa bán" />
        <KpiTile label={`Công suất ${focusLabel}`} value={loaded && focusTotal ? `${Math.round((focusBooked / focusTotal) * 100)}%` : "–"} hint="Đã đặt / tổng phòng" />
        <KpiTile label="Ô đang khóa bán" value={loaded ? closedCount : "–"} hint={`Trong ${period} ngày đang xem`} tone={closedCount ? "text-red-600" : "text-slate-900"} />
        <KpiTile label="Sắp hết phòng" value={loaded ? lowCount : "–"} hint={`Còn ≤ ${LOW_STOCK_THRESHOLD} phòng, chưa khóa`} tone={lowCount ? "text-amber-600" : "text-slate-900"} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 space-y-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-xs font-semibold text-slate-500">
              Từ ngày
              <input type="date" value={start} onChange={(event) => { if (event.target.value) setStart(event.target.value); }} className="mt-1 block rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1677FF]" />
            </label>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setStart(addDays(start, -7))} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Lùi 7 ngày">
                <ChevronLeftOutlined fontSize="small" />
              </button>
              <button type="button" onClick={() => setStart(addDays(start, 7))} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Tiến 7 ngày">
                <ChevronRightOutlined fontSize="small" />
              </button>
              <button type="button" disabled={start === today} onClick={() => setStart(today)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1677FF] hover:bg-blue-50 disabled:text-slate-400 disabled:hover:bg-transparent">
                Hôm nay
              </button>
            </div>
            <div role="radiogroup" aria-label="Số ngày hiển thị" className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/10">
              {([7, 14] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={period === value}
                  onClick={() => setPeriod(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${period === value ? "bg-white text-[#1677FF] shadow-sm" : "text-slate-600"}`}
                >
                  {value} ngày
                </button>
              ))}
            </div>
            <label className="min-w-0 text-xs font-semibold text-slate-500 sm:ml-auto">
              Hạng phòng
              <select
                value={filterId}
                onChange={(event) => setFilterId(event.target.value === "ALL" ? "ALL" : Number(event.target.value))}
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1677FF] sm:w-60"
              >
                <option value="ALL">Tất cả hạng phòng</option>
                {allRoomTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          {inventoryState.error && inventoryState.key === inventoryKey ? (
            <LoadError message={inventoryState.error} onRetry={reload} />
          ) : !loaded ? (
            <div className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" aria-busy="true" aria-label="Đang tải tồn kho" />
          ) : (
            <InventoryGrid
              roomTypes={roomTypes}
              days={days}
              cells={cells}
              today={today}
              busyId={busyId}
              onChangeAvailable={(cell, availableRooms) => saveCell(cell, { availableRooms }, `Đã cập nhật ${availableRooms} phòng trống ngày ${formatDayMonth(cell.date)}.`)}
              onToggleClosed={(cell) => { void saveCell(cell, { closed: !cell.closed }, `${cell.closed ? "Đã mở bán" : "Đã khóa bán"} ngày ${formatDayMonth(cell.date)}.`); }}
            />
          )}

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <InventoryLegend />
            <p className="text-xs text-slate-500">Bấm số phòng trống để sửa · Enter lưu, Esc hủy</p>
          </div>
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <BulkInventoryPanel key={hotel.id} hotelId={hotel.id} roomTypes={allRoomTypes} defaultFrom={today} today={today} onApplied={reload} />
        </aside>
      </div>
    </div>
  );
};

export const PartnerInventoryPage = () => {
  useEffect(() => {
    document.title = "Tồn kho & Đóng/Mở bán | MeGo Partner";
  }, []);

  return <HotelRequired>{(hotel) => <InventoryContent key={hotel.id} hotel={hotel} />}</HotelRequired>;
};

export default PartnerInventoryPage;
