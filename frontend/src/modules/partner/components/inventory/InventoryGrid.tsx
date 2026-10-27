import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { RoomInventoryDto, RoomTypeDto } from "../../types/backend.types";
import { formatDayMonth, isoWeekday, WEEKDAY_LABELS } from "../../utils/formatters";
import { LOW_STOCK_THRESHOLD } from "../../utils/inventoryRules";

interface InventoryGridProps {
  roomTypes: RoomTypeDto[];
  days: string[];
  /** khóa "roomTypeId:date" */
  cells: Record<string, RoomInventoryDto>;
  today: string;
  busyId: number | null;
  onChangeAvailable: (cell: RoomInventoryDto, availableRooms: number) => Promise<boolean>;
  onToggleClosed: (cell: RoomInventoryDto) => void;
}

const availabilityTone = (cell: RoomInventoryDto) => {
  if (cell.closed) return "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300";
  if (cell.availableRooms === 0) return "bg-slate-200 text-slate-600 dark:bg-white/10";
  if (cell.availableRooms <= LOW_STOCK_THRESHOLD) return "bg-amber-100 text-amber-800 dark:bg-amber-400/15";
  return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
};

const LABEL_CELL = "sticky left-0 z-10 w-[84px] min-w-[84px] md:left-[170px] md:w-[104px] md:min-w-[104px] border-r border-slate-200 bg-white px-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400";

/** Ô "Phòng trống": bấm để sửa trực tiếp, Enter lưu, Esc hủy. */
const AvailableCell = ({ cell, past, busy, onSave }: { cell: RoomInventoryDto; past: boolean; busy: boolean; onSave: (value: number) => Promise<boolean> }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commit = async () => {
    if (draft === null) return;
    const value = Number(draft);
    if (draft.trim() === "" || !Number.isInteger(value) || value < 0 || value > cell.totalRooms) {
      setError(`Từ 0 đến ${cell.totalRooms}`);
      return;
    }
    if (value === cell.availableRooms) {
      setDraft(null);
      return;
    }
    if (await onSave(value)) {
      setDraft(null);
      setError(null);
    }
  };

  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") void commit();
    if (event.key === "Escape") { setDraft(null); setError(null); }
  };

  if (draft !== null) {
    return (
      <div className="relative">
        <input
          autoFocus
          type="number"
          min={0}
          max={cell.totalRooms}
          value={draft}
          disabled={busy}
          aria-label={`Phòng trống ngày ${formatDayMonth(cell.date)}`}
          aria-invalid={!!error}
          onChange={(event) => { setDraft(event.target.value); setError(null); }}
          onKeyDown={handleKey}
          onBlur={() => { void commit(); }}
          className={`h-9 w-full rounded-lg border bg-white text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none text-sm font-bold outline-none focus:ring-2 ${error ? "border-red-400 ring-red-200" : "border-[#1677FF] ring-blue-100"}`}
        />
        {error && <p role="alert" className="absolute left-0 right-0 top-full z-10 mt-0.5 rounded bg-red-500 px-1 py-0.5 text-center text-[10px] font-semibold text-white">{error}</p>}
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={past || busy}
      onClick={() => setDraft(String(cell.availableRooms))}
      title={past ? "Ngày đã qua" : "Bấm để sửa số phòng trống"}
      className={`h-9 w-full rounded-lg text-sm font-bold ${availabilityTone(cell)} ${past ? "cursor-default" : "hover:ring-2 hover:ring-blue-200"}`}
    >
      {cell.availableRooms}
    </button>
  );
};

/** Lưới tồn kho: cột tên hạng phòng dính bên trái, cuộn ngang theo ngày, có bóng mờ báo còn cột. */
export const InventoryGrid = ({ roomTypes, days, cells, today, busyId, onChangeAvailable, onToggleClosed }: InventoryGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const left = element.scrollLeft > 4;
    const right = element.scrollLeft + element.clientWidth < element.scrollWidth - 4;
    setEdges((current) => (current.left === left && current.right === right ? current : { left, right }));
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure, days.length]);

  return (
    <div className="relative">
      <div ref={scrollRef} onScroll={measure} className="overflow-x-auto pb-1">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="z-20 w-[120px] min-w-[120px] md:sticky md:left-0 md:w-[170px] md:min-w-[170px] border-b border-slate-200 bg-white px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Hạng phòng
              </th>
              <th scope="col" className="sticky left-0 z-20 w-[84px] min-w-[84px] md:left-[170px] md:w-[104px] md:min-w-[104px] border-b border-r border-slate-200 bg-white px-2 py-3"><span className="sr-only">Chỉ số</span></th>
              {days.map((date) => {
                const weekend = isoWeekday(date) >= 6;
                return (
                  <th key={date} scope="col" className={`min-w-[76px] border-b border-slate-200 px-1.5 py-2 text-center ${date === today ? "bg-blue-50 dark:bg-blue-500/15" : weekend ? "bg-amber-50/60 dark:bg-amber-400/10" : ""}`}>
                    <span className={`block text-[11px] font-bold uppercase ${weekend ? "text-amber-700" : "text-slate-500"}`}>{date === today ? "Hôm nay" : WEEKDAY_LABELS[isoWeekday(date) - 1]}</span>
                    <span className="block text-sm font-bold text-slate-800">{formatDayMonth(date)}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((roomType) => (
              [
                <tr key={`${roomType.id}-available`}>
                  <th scope="rowgroup" rowSpan={3} className="z-10 w-[120px] min-w-[120px] md:sticky md:left-0 md:w-[170px] md:min-w-[170px] border-b border-slate-200 bg-white px-3 py-3 text-left align-top md:px-4">
                    <span className="line-clamp-3 font-semibold text-slate-900" title={roomType.name}>{roomType.name}</span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-500">{roomType.totalRooms} phòng{roomType.active ? "" : " · tạm ngừng bán"}</span>
                  </th>
                  <th scope="row" className={`${LABEL_CELL} pt-3`}>Phòng trống</th>
                  {days.map((date) => {
                    const cell = cells[`${roomType.id}:${date}`];
                    return (
                      <td key={date} className="px-1.5 pt-3">
                        {cell && <AvailableCell cell={cell} past={date < today} busy={busyId === cell.id} onSave={(value) => onChangeAvailable(cell, value)} />}
                      </td>
                    );
                  })}
                </tr>,
                <tr key={`${roomType.id}-booked`}>
                  <th scope="row" className={`${LABEL_CELL} py-1.5`}>Đã đặt / giữ</th>
                  {days.map((date) => {
                    const cell = cells[`${roomType.id}:${date}`];
                    if (!cell) return <td key={date} />;
                    const booked = cell.totalRooms - cell.availableRooms;
                    return (
                      <td key={date} className="px-1.5 py-1.5 text-center text-xs text-slate-600" title={`Đã đặt hoặc không mở bán = ${cell.totalRooms} − ${cell.availableRooms}`}>
                        <span className="font-semibold text-slate-800">{booked}</span>
                        {cell.heldRooms > 0 && <span className="text-[11px] text-slate-400"> ({cell.heldRooms} giữ)</span>}
                      </td>
                    );
                  })}
                </tr>,
                <tr key={`${roomType.id}-sale`}>
                  <th scope="row" className={`${LABEL_CELL} border-b pb-3 pt-1`}>Mở bán</th>
                  {days.map((date) => {
                    const cell = cells[`${roomType.id}:${date}`];
                    if (!cell) return <td key={date} className="border-b border-slate-200" />;
                    const past = date < today;
                    return (
                      <td key={date} className="border-b border-slate-200 px-1.5 pb-3 pt-1 text-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={!cell.closed}
                          aria-label={`${cell.closed ? "Mở bán" : "Khóa bán"} ${roomType.name} ngày ${formatDayMonth(date)}`}
                          disabled={past || busyId === cell.id}
                          onClick={() => onToggleClosed(cell)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${cell.closed ? "bg-red-400" : "bg-emerald-500"}`}
                        >
                          <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${cell.closed ? "translate-x-0.5" : "translate-x-[18px]"}`} />
                        </button>
                      </td>
                    );
                  })}
                </tr>,
              ]
            ))}
          </tbody>
        </table>
      </div>
      {edges.left && <div aria-hidden="true" className="pointer-events-none absolute bottom-1 left-[84px] md:left-[274px] top-0 w-8 bg-gradient-to-r from-slate-900/10 to-transparent" />}
      {edges.right && <div aria-hidden="true" className="pointer-events-none absolute bottom-1 right-0 top-0 w-10 bg-gradient-to-l from-slate-900/15 to-transparent" />}
    </div>
  );
};

export const InventoryLegend = () => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600" aria-label="Chú thích tồn kho">
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100" /> Còn nhiều phòng</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-200" /> Sắp hết (≤ {LOW_STOCK_THRESHOLD})</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-300" /> Hết phòng</li>
    <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-200" /> Khóa bán</li>
  </ul>
);

export default InventoryGrid;
