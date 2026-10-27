import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import AddOutlined from "@mui/icons-material/AddOutlined";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import partnerRoomApi from "../../services/partnerRoomApi";
import type { RoomDto, RoomRequest, RoomStatus, RoomTypeDto } from "../../types/backend.types";
import { inputClassName } from "../onboarding/formStyles";
import LoadError from "../shared/LoadError";
import Overlay from "../shared/Overlay";
import { ROOM_STATUS_OPTIONS, roomStatusMeta } from "./roomStatus";

interface RoomDraft {
  roomNumber: string;
  floor: string;
  status: RoomStatus;
}

const EMPTY_DRAFT: RoomDraft = { roomNumber: "", floor: "", status: "AVAILABLE" };

/** Kiểm tra phía client trước khi gửi; trùng số phòng do backend/mock trả lỗi (ràng buộc unique). */
const validateDraft = (draft: RoomDraft): string | null => {
  if (!draft.roomNumber.trim()) return "Vui lòng nhập số phòng.";
  if (draft.roomNumber.trim().length > 20) return "Số phòng tối đa 20 ký tự.";
  if (draft.floor && (!/^-?\d+$/.test(draft.floor) || Math.abs(Number(draft.floor)) > 200)) return "Tầng phải là số nguyên.";
  return null;
};

const toRequest = (draft: RoomDraft): RoomRequest => ({
  roomNumber: draft.roomNumber.trim(),
  floor: draft.floor === "" ? null : Number(draft.floor),
  status: draft.status,
});

interface RoomsDrawerProps {
  roomType: RoomTypeDto | null;
  onClose: () => void;
  /** Báo số phòng vật lý hiện có để trang cha cập nhật cột "Số phòng" */
  onCountChange: (roomTypeId: number, count: number) => void;
}

interface LoadState {
  requestId: number;
  rooms: RoomDto[];
  error: string | null;
}

export const RoomsDrawer = ({ roomType, onClose, onCountChange }: RoomsDrawerProps) => {
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ requestId: 0, rooms: [], error: null });
  const [draft, setDraft] = useState<RoomDraft>(EMPTY_DRAFT);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: number; draft: RoomDraft } | null>(null);
  const [busy, setBusy] = useState(false);
  const roomTypeId = roomType?.id;

  useEffect(() => {
    if (!roomTypeId) return;
    let cancelled = false;
    partnerRoomApi
      .listRooms(roomTypeId)
      .then((rooms) => { if (!cancelled) setState({ requestId, rooms, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setState({ requestId, rooms: [], error: error instanceof Error ? error.message : "Không tải được danh sách phòng." }); });
    return () => { cancelled = true; };
  }, [roomTypeId, requestId]);

  const setRooms = (rooms: RoomDto[]) => {
    setState((current) => ({ ...current, rooms }));
    if (roomTypeId) onCountChange(roomTypeId, rooms.length);
  };

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!roomTypeId) return;
    const problem = validateDraft(draft);
    if (problem) return setDraftError(problem);
    setBusy(true);
    try {
      const room = await partnerRoomApi.createRoom(roomTypeId, toRequest(draft));
      setRooms([...state.rooms, room]);
      setDraft({ ...EMPTY_DRAFT, floor: draft.floor });
      setDraftError(null);
      toast.success(`Đã thêm phòng ${room.roomNumber}.`);
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : "Không thêm được phòng.");
    } finally {
      setBusy(false);
    }
  };

  const saveRoom = async (roomId: number, nextDraft: RoomDraft) => {
    const problem = validateDraft(nextDraft);
    if (problem) {
      toast.error(problem);
      return false;
    }
    setBusy(true);
    try {
      const updated = await partnerRoomApi.updateRoom(roomId, toRequest(nextDraft));
      setRooms(state.rooms.map((room) => (room.id === roomId ? updated : room)));
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được phòng.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = (room: RoomDto, status: RoomStatus) => {
    void saveRoom(room.id, { roomNumber: room.roomNumber, floor: room.floor?.toString() ?? "", status });
  };

  const handleDelete = async (room: RoomDto) => {
    if (!window.confirm(`Xóa phòng ${room.roomNumber}? Thao tác này không hoàn tác được.`)) return;
    setBusy(true);
    try {
      await partnerRoomApi.deleteRoom(room.id);
      setRooms(state.rooms.filter((item) => item.id !== room.id));
      toast.success(`Đã xóa phòng ${room.roomNumber}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không xóa được phòng.");
    } finally {
      setBusy(false);
    }
  };

  const loaded = state.requestId === requestId;
  const rooms = [...state.rooms].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, "vi", { numeric: true }));

  return (
    <Overlay
      open={roomType !== null}
      onClose={onClose}
      variant="drawer"
      widthClass="max-w-xl"
      title={`Danh sách phòng · ${roomType?.name ?? ""}`}
      subtitle={roomType ? `Khai báo ${roomType.totalRooms} phòng mở bán · đang có ${state.rooms.length} phòng vật lý` : undefined}
    >
      <form onSubmit={handleAdd} className="mb-5 rounded-2xl border border-slate-200 p-4">
        <p className="mb-3 text-sm font-bold text-slate-800">Thêm phòng</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_0.7fr_1fr_auto]">
          <input aria-label="Số phòng" placeholder="Số phòng *" value={draft.roomNumber} onChange={(event) => setDraft({ ...draft, roomNumber: event.target.value })} className={inputClassName(!!draftError, false)} />
          <input aria-label="Tầng" placeholder="Tầng" inputMode="numeric" value={draft.floor} onChange={(event) => setDraft({ ...draft, floor: event.target.value })} className={inputClassName(false, false)} />
          <select aria-label="Trạng thái" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as RoomStatus })} className={inputClassName(false, false)}>
            {ROOM_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#1677FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60">
            <AddOutlined sx={{ fontSize: 18 }} /> Thêm
          </button>
        </div>
        {draftError && <p className="mt-2 text-xs font-semibold text-red-500">{draftError}</p>}
      </form>

      {roomType && state.rooms.length !== roomType.totalRooms && loaded && !state.error && (
        <p className="mb-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <InfoOutlined sx={{ fontSize: 16 }} className="mt-px shrink-0" />
          Số phòng vật lý ({state.rooms.length}) khác số phòng mở bán đã khai báo ({roomType.totalRooms}). Kiểm tra lại để tồn kho không bị sai lệch.
        </p>
      )}

      {state.error ? (
        <LoadError message={state.error} onRetry={() => setRequestId((id) => id + 1)} />
      ) : !loaded ? (
        <div className="h-40 animate-pulse rounded-2xl bg-slate-100" aria-busy="true" aria-label="Đang tải danh sách phòng" />
      ) : rooms.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Chưa có phòng nào. Thêm phòng đầu tiên ở trên.</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {rooms.map((room) => {
            const isEditing = editing?.id === room.id;
            return (
              <li key={room.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                {isEditing && editing ? (
                  <>
                    <input aria-label="Số phòng" value={editing.draft.roomNumber} onChange={(event) => setEditing({ ...editing, draft: { ...editing.draft, roomNumber: event.target.value } })} className={`${inputClassName(false, false)} w-28`} />
                    <input aria-label="Tầng" inputMode="numeric" value={editing.draft.floor} onChange={(event) => setEditing({ ...editing, draft: { ...editing.draft, floor: event.target.value } })} className={`${inputClassName(false, false)} w-20`} />
                    <div className="ml-auto flex gap-1">
                      <button type="button" disabled={busy} onClick={() => { void saveRoom(room.id, editing.draft).then((ok) => { if (ok) setEditing(null); }); }} className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50" aria-label="Lưu phòng">
                        <CheckOutlined sx={{ fontSize: 19 }} />
                      </button>
                      <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Hủy sửa">
                        <CloseOutlined sx={{ fontSize: 19 }} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">Phòng {room.roomNumber}</p>
                      <p className="text-xs text-slate-500">{room.floor !== null ? `Tầng ${room.floor}` : "Chưa ghi tầng"}</p>
                    </div>
                    <select
                      aria-label={`Trạng thái phòng ${room.roomNumber}`}
                      value={room.status}
                      disabled={busy}
                      onChange={(event) => changeStatus(room, event.target.value as RoomStatus)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${roomStatusMeta(room.status).className}`}
                    >
                      {ROOM_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <button type="button" onClick={() => setEditing({ id: room.id, draft: { roomNumber: room.roomNumber, floor: room.floor?.toString() ?? "", status: room.status } })} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Sửa phòng ${room.roomNumber}`}>
                      <EditOutlined sx={{ fontSize: 18 }} />
                    </button>
                    <button type="button" disabled={busy} onClick={() => { void handleDelete(room); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label={`Xóa phòng ${room.roomNumber}`}>
                      <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Overlay>
  );
};

export default RoomsDrawer;
