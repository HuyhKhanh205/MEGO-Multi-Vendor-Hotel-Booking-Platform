import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AddOutlined from "@mui/icons-material/AddOutlined";
import BedOutlined from "@mui/icons-material/BedOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import MeetingRoomOutlined from "@mui/icons-material/MeetingRoomOutlined";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import HotelRequired from "../components/layout/HotelRequired";
import RoomTypeFormModal from "../components/roomTypes/RoomTypeFormModal";
import RoomsDrawer from "../components/roomTypes/RoomsDrawer";
import LoadError from "../components/shared/LoadError";
import partnerHotelApi from "../services/partnerHotelApi";
import partnerRoomApi from "../services/partnerRoomApi";
import type { AmenityDto, HotelSummaryDto, RoomTypeDto, RoomTypeRequest } from "../types/backend.types";
import { formatVnd } from "../utils/formatters";

type Filter = "ALL" | "ACTIVE" | "INACTIVE";

interface PageData {
  roomTypes: RoomTypeDto[];
  amenities: AmenityDto[];
  /** Số phòng vật lý theo hạng phòng */
  roomCounts: Record<number, number>;
}

interface LoadState {
  requestId: number;
  data: PageData | null;
  error: string | null;
}

const KpiTile = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

const RoomTypesContent = ({ hotel }: { hotel: HotelSummaryDto }) => {
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ requestId: 0, data: null, error: null });
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<RoomTypeDto | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [roomsOf, setRoomsOf] = useState<RoomTypeDto | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([partnerRoomApi.listRoomTypes(hotel.id), partnerHotelApi.listAmenities("ROOM"), partnerRoomApi.listHotelRooms(hotel.id)])
      .then(([roomTypes, amenities, rooms]) => {
        const roomCounts: Record<number, number> = {};
        rooms.forEach((room) => { roomCounts[room.roomTypeId] = (roomCounts[room.roomTypeId] ?? 0) + 1; });
        if (!cancelled) setState({ requestId, data: { roomTypes, amenities, roomCounts }, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ requestId, data: null, error: error instanceof Error ? error.message : "Không tải được danh sách hạng phòng." });
      });
    return () => { cancelled = true; };
  }, [hotel.id, requestId]);

  const roomTypes = useMemo(() => state.data?.roomTypes ?? [], [state.data]);
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return roomTypes.filter((item) =>
      (filter === "ALL" || (filter === "ACTIVE" ? item.active : !item.active)) &&
      (!keyword || `${item.name} ${item.bedType ?? ""}`.toLowerCase().includes(keyword)));
  }, [roomTypes, filter, query]);

  const patchData = (patch: (data: PageData) => PageData) =>
    setState((current) => (current.data ? { ...current, data: patch(current.data) } : current));

  const upsertRoomType = (roomType: RoomTypeDto) =>
    patchData((data) => ({
      ...data,
      roomTypes: data.roomTypes.some((item) => item.id === roomType.id)
        ? data.roomTypes.map((item) => (item.id === roomType.id ? roomType : item))
        : [...data.roomTypes, roomType],
    }));

  const handleSubmit = async (request: RoomTypeRequest) => {
    try {
      const saved = editing ? await partnerRoomApi.updateRoomType(editing.id, request) : await partnerRoomApi.createRoomType(hotel.id, request);
      upsertRoomType(saved);
      toast.success(editing ? `Đã lưu hạng phòng "${saved.name}".` : `Đã tạo hạng phòng "${saved.name}".`);
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được hạng phòng.");
    }
  };

  const toggleActive = async (roomType: RoomTypeDto) => {
    setBusyId(roomType.id);
    try {
      const saved = await partnerRoomApi.setRoomTypeActive(roomType.id, !roomType.active);
      upsertRoomType(saved);
      toast.success(saved.active ? `Đã mở bán "${saved.name}".` : `Đã tạm ngừng bán "${saved.name}".`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không cập nhật được trạng thái bán.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (roomType: RoomTypeDto) => {
    const roomCount = state.data?.roomCounts[roomType.id] ?? 0;
    const warning = roomCount ? ` và ${roomCount} phòng thuộc hạng này` : "";
    if (!window.confirm(`Xóa hạng phòng "${roomType.name}"${warning}? Thao tác này không hoàn tác được.`)) return;
    setBusyId(roomType.id);
    try {
      await partnerRoomApi.deleteRoomType(roomType.id);
      patchData((data) => ({ ...data, roomTypes: data.roomTypes.filter((item) => item.id !== roomType.id) }));
      toast.success(`Đã xóa hạng phòng "${roomType.name}".`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không xóa được hạng phòng.");
    } finally {
      setBusyId(null);
    }
  };

  if (state.error) return <LoadError message={state.error} onRetry={() => setRequestId((id) => id + 1)} />;
  if (!state.data) return <div className="h-96 animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải hạng phòng" />;

  const { amenities, roomCounts } = state.data;
  const activeCount = roomTypes.filter((item) => item.active).length;
  const physicalRooms = Object.values(roomCounts).reduce((sum, count) => sum + count, 0);
  const declaredRooms = roomTypes.reduce((sum, item) => sum + item.totalRooms, 0);
  const amenityName = (id: number) => amenities.find((item) => item.id === id)?.name;

  const FILTERS: Array<{ value: Filter; label: string; count: number }> = [
    { value: "ALL", label: "Tất cả", count: roomTypes.length },
    { value: "ACTIVE", label: "Đang bán", count: activeCount },
    { value: "INACTIVE", label: "Tạm ngừng", count: roomTypes.length - activeCount },
  ];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Loại phòng & Phòng</h1>
          <p className="mt-1 text-sm text-slate-500">{hotel.name}</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-600"
        >
          <AddOutlined sx={{ fontSize: 19 }} /> Thêm hạng phòng
        </button>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Thống kê hạng phòng">
        <KpiTile label="Hạng phòng" value={roomTypes.length} />
        <KpiTile label="Phòng mở bán (khai báo)" value={declaredRooms} hint={`${physicalRooms} phòng vật lý đã nhập`} />
        <KpiTile label="Đang bán" value={activeCount} />
        <KpiTile label="Tạm ngừng" value={roomTypes.length - activeCount} />
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div role="tablist" aria-label="Lọc theo trạng thái bán" className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/10">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-semibold ${filter === item.value ? "bg-white text-[#1677FF] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                {item.label} <span className="text-xs opacity-70">({item.count})</span>
              </button>
            ))}
          </div>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Tìm theo tên hạng phòng hoặc loại giường</span>
            <SearchOutlined sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tên hạng phòng, loại giường..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 border-t border-slate-100 px-6 py-12 text-center">
            <SearchOffOutlined className="text-slate-300" sx={{ fontSize: 40 }} />
            <p className="font-semibold text-slate-700">{roomTypes.length === 0 ? "Khách sạn chưa có hạng phòng nào" : "Không có hạng phòng phù hợp"}</p>
            {roomTypes.length === 0 && <p className="text-sm text-slate-500">Bấm "Thêm hạng phòng" để bắt đầu mở bán.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/5">
                <tr>
                  <th scope="col" className="px-5 py-3">Hạng phòng</th>
                  <th scope="col" className="px-4 py-3">Sức chứa & diện tích</th>
                  <th scope="col" className="px-4 py-3">Giá cơ bản</th>
                  <th scope="col" className="px-4 py-3">Số phòng</th>
                  <th scope="col" className="px-4 py-3">Trạng thái</th>
                  <th scope="col" className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => {
                  const cover = [...item.images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url;
                  const amenitiesText = item.amenityIds.map(amenityName).filter(Boolean).join(" · ");
                  const physical = roomCounts[item.id] ?? 0;
                  return (
                    <tr key={item.id} className={item.active ? "hover:bg-slate-50/60" : "bg-slate-50/50 dark:bg-white/5"}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {cover ? (
                            <img src={cover} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-white/10"><BedOutlined /></span>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="line-clamp-2 text-xs text-slate-500" title={amenitiesText}>{item.bedType ?? "Chưa ghi loại giường"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        <p className="inline-flex items-center gap-1 whitespace-nowrap"><PeopleOutlined sx={{ fontSize: 16 }} className="text-slate-400" /> {item.maxAdults} NL{item.maxChildren ? ` + ${item.maxChildren} TE` : ""}</p>
                        <p className="text-xs text-slate-500">{item.areaM2 ? `${item.areaM2} m²` : "—"}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900">{formatVnd(item.basePrice)}<span className="block text-xs font-normal text-slate-500">/ đêm</span></td>
                      <td className="px-4 py-4">
                        <p className="whitespace-nowrap font-semibold text-slate-800">{item.totalRooms} mở bán</p>
                        <p className={`whitespace-nowrap text-xs ${physical === item.totalRooms ? "text-slate-500" : "font-semibold text-amber-600"}`}>{physical} phòng vật lý</p>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.active}
                          disabled={busyId === item.id}
                          onClick={() => { void toggleActive(item); }}
                          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                          title={item.active ? "Bấm để tạm ngừng bán" : "Bấm để mở bán"}
                        >
                          <span className={`h-2 w-2 rounded-full ${item.active ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {item.active ? "Đang bán" : "Tạm ngừng"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => setRoomsOf(item)} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#1677FF] hover:bg-blue-100">
                            <MeetingRoomOutlined sx={{ fontSize: 16 }} /> Phòng
                          </button>
                          <button type="button" onClick={() => { setEditing(item); setFormOpen(true); }} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Sửa ${item.name}`}>
                            <EditOutlined sx={{ fontSize: 18 }} />
                          </button>
                          <button type="button" disabled={busyId === item.id} onClick={() => { void remove(item); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label={`Xóa ${item.name}`}>
                            <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <RoomTypeFormModal
        open={formOpen}
        roomType={editing}
        amenities={amenities}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
      <RoomsDrawer
        key={roomsOf?.id ?? "closed"}
        roomType={roomsOf}
        onClose={() => setRoomsOf(null)}
        onCountChange={(roomTypeId, count) => patchData((data) => ({ ...data, roomCounts: { ...data.roomCounts, [roomTypeId]: count } }))}
      />
    </div>
  );
};

export const PartnerRoomTypesPage = () => {
  useEffect(() => {
    document.title = "Loại phòng & Phòng | MeGo Partner";
  }, []);

  return <HotelRequired>{(hotel) => <RoomTypesContent key={hotel.id} hotel={hotel} />}</HotelRequired>;
};

export default PartnerRoomTypesPage;
