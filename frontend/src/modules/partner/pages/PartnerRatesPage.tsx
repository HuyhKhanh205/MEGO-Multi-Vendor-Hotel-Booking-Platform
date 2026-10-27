import { useEffect, useMemo, useState } from "react";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import HotelRequired from "../components/layout/HotelRequired";
import DayRateDialog from "../components/rates/DayRateDialog";
import QuickRatePanel from "../components/rates/QuickRatePanel";
import RateCalendar, { RateLegend, type DateSelection } from "../components/rates/RateCalendar";
import LoadError from "../components/shared/LoadError";
import partnerInventoryApi from "../services/partnerInventoryApi";
import partnerRoomApi from "../services/partnerRoomApi";
import type { HotelSummaryDto, RoomInventoryDto, RoomTypeDto } from "../types/backend.types";
import { addDays, dateRange, formatDayMonth, formatVnd, todayIso } from "../utils/formatters";

interface LoadState<T> {
  key: string;
  data: T | null;
  error: string | null;
}

const monthBounds = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const lastDay = new Date(year, monthIndex, 0).getDate();
  return { from: `${month}-01`, to: `${month}-${String(lastDay).padStart(2, "0")}` };
};

const shiftMonth = (month: string, delta: number) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(year, monthIndex - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const RatesContent = ({ hotel }: { hotel: HotelSummaryDto }) => {
  const today = todayIso();
  const [roomTypesState, setRoomTypesState] = useState<LoadState<RoomTypeDto[]>>({ key: "", data: null, error: null });
  const [roomTypesRequest, setRoomTypesRequest] = useState(1);
  const [roomTypeId, setRoomTypeId] = useState<number | null>(null);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [inventoryRequest, setInventoryRequest] = useState(1);
  const [inventoryState, setInventoryState] = useState<LoadState<RoomInventoryDto[]>>({ key: "", data: null, error: null });
  const [selection, setSelection] = useState<DateSelection>({ from: today, to: addDays(today, 6) });
  const [anchor, setAnchor] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = String(roomTypesRequest);
    partnerRoomApi
      .listRoomTypes(hotel.id)
      .then((data) => { if (!cancelled) setRoomTypesState({ key, data, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setRoomTypesState({ key, data: null, error: error instanceof Error ? error.message : "Không tải được hạng phòng." }); });
    return () => { cancelled = true; };
  }, [hotel.id, roomTypesRequest]);

  const { from, to } = monthBounds(month);
  const inventoryKey = `${month}#${inventoryRequest}`;

  useEffect(() => {
    let cancelled = false;
    partnerInventoryApi
      .getInventory(hotel.id, from, to)
      .then((data) => { if (!cancelled) setInventoryState({ key: inventoryKey, data, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setInventoryState({ key: inventoryKey, data: null, error: error instanceof Error ? error.message : "Không tải được lịch giá." }); });
    return () => { cancelled = true; };
  }, [hotel.id, from, to, inventoryKey]);

  const roomTypes = useMemo(() => roomTypesState.data ?? [], [roomTypesState.data]);
  const roomType = roomTypes.find((item) => item.id === roomTypeId) ?? roomTypes[0];

  const cells = useMemo(() => {
    const map: Record<string, RoomInventoryDto> = {};
    (inventoryState.data ?? []).forEach((cell) => { if (cell.roomTypeId === roomType?.id) map[cell.date] = cell; });
    return map;
  }, [inventoryState.data, roomType?.id]);

  if (roomTypesState.error) return <LoadError message={roomTypesState.error} onRetry={() => setRoomTypesRequest((id) => id + 1)} />;
  if (!roomTypesState.data) return <div className="h-[560px] animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải lịch giá" />;

  if (!roomType) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
        <h1 className="text-xl font-extrabold text-slate-900">Chưa có hạng phòng để thiết lập giá</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo hạng phòng ở mục "Loại phòng & Phòng" trước, sau đó quay lại để cấu hình giá theo ngày.</p>
      </div>
    );
  }

  const inventoryLoaded = inventoryState.key === inventoryKey && !!inventoryState.data;
  const reloadInventory = () => setInventoryRequest((id) => id + 1);

  const handleSelect = (date: string, extend: boolean) => {
    if (extend && anchor) {
      setSelection(anchor <= date ? { from: anchor, to: date } : { from: date, to: anchor });
      return;
    }
    setAnchor(date);
    setSelection({ from: date, to: date });
  };

  const singleDay = selection.from === selection.to && selection.from >= today ? selection.from : null;
  const editingCell = editingDate ? cells[editingDate] : undefined;
  const monthLabel = `Tháng ${month.slice(5)}/${month.slice(0, 4)}`;
  const overrideDays = Object.values(cells).filter((cell) => cell.price !== null && cell.price !== roomType.basePrice).length;
  const closedDays = Object.values(cells).filter((cell) => cell.closed).length;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Cấu hình giá phòng</h1>
        <p className="mt-1 text-sm text-slate-500">{hotel.name} · giá áp dụng cho mỗi đêm lưu trú</p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4 rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:gap-2">
              Hạng phòng
              <select
                value={roomType.id}
                onChange={(event) => setRoomTypeId(Number(event.target.value))}
                className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-[#1677FF] sm:max-w-xs"
              >
                {roomTypes.map((item) => <option key={item.id} value={item.id}>{item.name}{item.active ? "" : " (tạm ngừng)"}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Tháng trước">
                <ChevronLeftOutlined fontSize="small" />
              </button>
              <span className="min-w-32 text-center text-sm font-bold text-slate-900" aria-live="polite">{monthLabel}</span>
              <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50" aria-label="Tháng sau">
                <ChevronRightOutlined fontSize="small" />
              </button>
              <button type="button" disabled={month === today.slice(0, 7)} onClick={() => setMonth(today.slice(0, 7))} className="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1677FF] hover:bg-blue-50 disabled:text-slate-400 disabled:hover:bg-transparent">
                Tháng này
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 dark:bg-white/5">
            <span>Giá cơ bản: <strong className="text-slate-900">{formatVnd(roomType.basePrice)}</strong></span>
            <span>{overrideDays} ngày có giá riêng · {closedDays} ngày khóa bán</span>
          </div>

          {inventoryState.error && inventoryState.key === inventoryKey ? (
            <LoadError message={inventoryState.error} onRetry={reloadInventory} />
          ) : !inventoryLoaded ? (
            <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" aria-busy="true" aria-label="Đang tải lịch giá" />
          ) : (
            <RateCalendar
              days={dateRange(from, to)}
              cells={cells}
              basePrice={roomType.basePrice}
              today={today}
              selection={selection}
              onSelect={handleSelect}
              onEdit={(date) => { if (date >= today) setEditingDate(date); }}
            />
          )}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <RateLegend />
            {singleDay && cells[singleDay] && (
              <button type="button" onClick={() => setEditingDate(singleDay)} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1677FF] hover:bg-blue-100 dark:bg-blue-500/15">
                <EditCalendarOutlined sx={{ fontSize: 17 }} /> Sửa riêng ngày {formatDayMonth(singleDay)}
              </button>
            )}
          </div>
        </section>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <QuickRatePanel
            key={hotel.id}
            hotelId={hotel.id}
            roomTypes={roomTypes}
            currentRoomType={roomType}
            range={selection}
            onRangeChange={(range) => { setSelection(range); setAnchor(range.from); }}
            getCell={(date) => cells[date]}
            today={today}
            onApplied={reloadInventory}
          />
        </aside>
      </div>

      {editingCell && (
        <DayRateDialog
          key={editingCell.id}
          cell={editingCell}
          roomType={roomType}
          onClose={() => setEditingDate(null)}
          onConflict={() => { setEditingDate(null); reloadInventory(); }}
          onSaved={(saved) => {
            setInventoryState((current) => ({ ...current, data: current.data?.map((cell) => (cell.id === saved.id ? saved : cell)) ?? null }));
            setEditingDate(null);
          }}
        />
      )}
    </div>
  );
};

export const PartnerRatesPage = () => {
  useEffect(() => {
    document.title = "Cấu hình giá phòng | MeGo Partner";
  }, []);

  return <HotelRequired>{(hotel) => <RatesContent key={hotel.id} hotel={hotel} />}</HotelRequired>;
};

export default PartnerRatesPage;
