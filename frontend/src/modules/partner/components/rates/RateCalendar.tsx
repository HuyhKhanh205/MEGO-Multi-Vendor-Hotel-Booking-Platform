import type { MouseEvent } from "react";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import type { RoomInventoryDto } from "../../types/backend.types";
import { formatDayMonth, formatShortPrice, formatVnd, isoWeekday, WEEKDAY_LABELS } from "../../utils/formatters";

export interface DateSelection {
  from: string;
  to: string;
}

interface RateCalendarProps {
  /** yyyy-MM-dd của mọi ngày trong tháng đang xem */
  days: string[];
  cells: Record<string, RoomInventoryDto | undefined>;
  basePrice: number;
  today: string;
  selection: DateSelection | null;
  onSelect: (date: string, extend: boolean) => void;
  onEdit: (date: string) => void;
}

/** Lịch giá theo tháng (T2 → CN) của một hạng phòng. */
export const RateCalendar = ({ days, cells, basePrice, today, selection, onSelect, onEdit }: RateCalendarProps) => {
  const leading = days.length ? isoWeekday(days[0]) - 1 : 0;
  const inSelection = (date: string) => !!selection && date >= selection.from && date <= selection.to;

  const handleClick = (event: MouseEvent, date: string) => onSelect(date, event.shiftKey);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:gap-2">
        {WEEKDAY_LABELS.map((label) => <div key={label}>{label}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: leading }, (_, index) => <div key={`empty-${index}`} aria-hidden="true" />)}
        {days.map((date) => {
          const cell = cells[date];
          const past = date < today;
          const weekend = isoWeekday(date) >= 6;
          const selected = inSelection(date);
          const override = cell?.price != null && cell.price !== basePrice;
          const price = cell?.effectivePrice ?? basePrice;
          const tone = cell?.closed
            ? "border-red-200 bg-[repeating-linear-gradient(135deg,rgba(254,226,226,0.9)_0_6px,rgba(255,255,255,0.9)_6px_12px)] dark:bg-none dark:bg-red-500/15"
            : weekend
              ? "border-amber-200/70 bg-amber-50/60 dark:bg-amber-400/10"
              : "border-slate-200 bg-white";
          const label = [
            formatDayMonth(date),
            cell?.closed ? "đang khóa bán" : `còn ${cell?.availableRooms ?? "?"}/${cell?.totalRooms ?? "?"} phòng`,
            `giá ${formatVnd(price)}${override ? " (giá riêng)" : ""}`,
            past ? "ngày đã qua, chỉ xem" : "",
          ].filter(Boolean).join(", ");

          return (
            <button
              key={date}
              type="button"
              disabled={past}
              aria-pressed={selected}
              aria-label={label}
              title={`${formatVnd(price)}${override ? " · giá riêng ngày này" : " · giá cơ bản"}`}
              onClick={(event) => handleClick(event, date)}
              onDoubleClick={() => onEdit(date)}
              className={`relative flex min-h-[68px] min-w-0 flex-col rounded-lg border p-1 text-left transition-shadow sm:min-h-[92px] sm:rounded-xl sm:p-2 ${tone} ${
                past ? "cursor-default opacity-45" : "hover:border-[#1677FF] hover:shadow-sm"
              } ${selected ? "!border-[#1677FF] ring-2 ring-blue-200 dark:ring-blue-500/40" : ""}`}
            >
              <span className="flex items-center justify-between gap-1">
                <span className={`text-xs font-bold sm:text-sm ${date === today ? "flex h-6 w-6 items-center justify-center rounded-full bg-[#1677FF] text-white" : "text-slate-700"}`}>
                  {Number(date.slice(8))}
                </span>
                {override && !cell?.closed && <span className="h-2 w-2 rounded-full bg-violet-500" aria-hidden="true" />}
              </span>
              {cell?.closed ? (
                <span className="mt-auto inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 sm:text-xs">
                  <BlockOutlined sx={{ fontSize: 13 }} /> <span className="hidden sm:inline">Khóa bán</span>
                </span>
              ) : (
                <>
                  <span className={`mt-auto truncate text-[10px] font-extrabold tracking-tight sm:text-sm sm:tracking-normal ${override ? "text-violet-700 dark:text-violet-300" : "text-slate-900"}`}>{formatShortPrice(price)}</span>
                  <span className={`truncate text-[10px] sm:text-[11px] ${cell && cell.availableRooms <= 2 ? "font-semibold text-red-500" : "text-slate-500"}`}>
                    <span className="hidden sm:inline">Còn </span>{cell?.availableRooms ?? "–"}/{cell?.totalRooms ?? "–"}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const RateLegend = () => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600" aria-label="Chú thích lịch giá">
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-slate-300 bg-white" /> Giá cơ bản</li>
    <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Giá riêng theo ngày</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-amber-200 bg-amber-50" /> Cuối tuần</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-red-200 bg-[repeating-linear-gradient(135deg,#fee2e2_0_3px,#fff_3px_6px)]" /> Khóa bán</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#1677FF]" /> Hôm nay</li>
  </ul>
);

export default RateCalendar;
