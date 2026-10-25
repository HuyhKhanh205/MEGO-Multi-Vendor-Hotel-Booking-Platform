import TuneOutlined from "@mui/icons-material/TuneOutlined";
import type { RoomStatusSummary } from "../../types/partner.types";

const SEGMENTS: Array<{ key: keyof RoomStatusSummary; label: string; color: string }> = [
  { key: "occupied", label: "Đã có khách", color: "#004CCD" },
  { key: "vacantReady", label: "Phòng trống", color: "#38BDF8" },
  { key: "cleaning", label: "Đang dọn", color: "#94A3B8" },
  { key: "maintenance", label: "Bảo trì", color: "#CBD5E1" },
];

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface RoomStatusCardProps {
  roomStatus: RoomStatusSummary;
  onUpdate: () => void;
}

export const RoomStatusCard = ({ roomStatus, onUpdate }: RoomStatusCardProps) => {
  const total = SEGMENTS.reduce((sum, segment) => sum + roomStatus[segment.key], 0);
  const arcs = SEGMENTS.map((segment, index) => {
    const lengthOf = (key: keyof RoomStatusSummary) => (total ? (roomStatus[key] / total) * CIRCUMFERENCE : 0);
    const offset = SEGMENTS.slice(0, index).reduce((sum, previous) => sum + lengthOf(previous.key), 0);
    return { ...segment, length: lengthOf(segment.key), offset };
  });

  return (
    <section className="flex min-w-0 flex-col rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Tình trạng phòng hôm nay</h2>
        <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1677FF]">Tổng {total} phòng</span>
      </div>

      <div className="relative mx-auto my-5 w-44">
        <svg viewBox="0 0 180 180" className="h-auto w-full -rotate-90" role="img" aria-label={`${roomStatus.occupied} trên ${total} phòng đang có khách`}>
          <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="#F1F5F9" strokeWidth="22" />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke={arc.color}
              strokeWidth="22"
              strokeDasharray={`${Math.max(0, arc.length - 2)} ${CIRCUMFERENCE}`}
              strokeDashoffset={-arc.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">{roomStatus.occupied}</span>
          <span className="text-xs text-slate-500">Đang ở</span>
        </div>
      </div>

      <ul className="space-y-2">
        {SEGMENTS.map((segment) => (
          <li key={segment.key} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
            <span className="inline-flex min-w-0 items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="truncate">{segment.label}</span>
            </span>
            <span className="font-bold text-slate-900">{roomStatus[segment.key]}</span>
          </li>
        ))}
      </ul>

      <button type="button" onClick={onUpdate} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-[#1677FF] hover:bg-blue-100">
        <TuneOutlined sx={{ fontSize: 18 }} /> Cập nhật tình trạng phòng
      </button>
    </section>
  );
};

export default RoomStatusCard;
