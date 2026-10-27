import type { RoomStatus } from "../../types/backend.types";

export const ROOM_STATUS_OPTIONS: Array<{ value: RoomStatus; label: string; className: string }> = [
  { value: "AVAILABLE", label: "Sẵn sàng", className: "bg-emerald-50 text-emerald-700" },
  { value: "OCCUPIED", label: "Có khách", className: "bg-blue-50 text-[#004CCD]" },
  { value: "CLEANING", label: "Đang dọn", className: "bg-amber-50 text-amber-700" },
  { value: "MAINTENANCE", label: "Bảo trì", className: "bg-slate-100 text-slate-600" },
];

export const roomStatusMeta = (status: RoomStatus) => ROOM_STATUS_OPTIONS.find((option) => option.value === status) ?? ROOM_STATUS_OPTIONS[0];
