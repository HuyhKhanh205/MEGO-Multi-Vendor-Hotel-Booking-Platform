import type { RoomTypeDto } from "../../types/backend.types";
import { WEEKDAY_LABELS } from "../../utils/formatters";

const chipClass = (active: boolean) =>
  `rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
    active ? "border-[#1677FF] bg-[#1677FF] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
  }`;

const toggle = <T,>(list: T[], value: T): T[] => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

/** Chọn các thứ áp dụng (1 = Thứ Hai … 7 = Chủ nhật) cho thao tác hàng loạt. */
export const WeekdayPicker = ({ value, onChange, error }: { value: number[]; onChange: (value: number[]) => void; error?: string }) => (
  <fieldset>
    <legend className="mb-1.5 flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm font-semibold text-slate-700">
      Áp dụng cho các thứ
      <span className="flex gap-2 whitespace-nowrap text-xs font-semibold">
        <button type="button" onClick={() => onChange([1, 2, 3, 4, 5, 6, 7])} className="text-[#1677FF] hover:underline">Cả tuần</button>
        <button type="button" onClick={() => onChange([1, 2, 3, 4, 5])} className="text-[#1677FF] hover:underline">T2–T6</button>
        <button type="button" onClick={() => onChange([6, 7])} className="text-[#1677FF] hover:underline">Cuối tuần</button>
      </span>
    </legend>
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAY_LABELS.map((label, index) => {
        const day = index + 1;
        return (
          <button key={label} type="button" aria-pressed={value.includes(day)} onClick={() => onChange(toggle(value, day).sort())} className={chipClass(value.includes(day))}>
            {label}
          </button>
        );
      })}
    </div>
    {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
  </fieldset>
);

/** Chọn nhiều hạng phòng áp dụng. */
export const RoomTypeChecklist = ({ roomTypes, value, onChange, error }: { roomTypes: RoomTypeDto[]; value: number[]; onChange: (value: number[]) => void; error?: string }) => (
  <fieldset>
    <legend className="mb-1.5 flex w-full items-center justify-between text-sm font-semibold text-slate-700">
      Hạng phòng áp dụng
      <button type="button" onClick={() => onChange(value.length === roomTypes.length ? [] : roomTypes.map((item) => item.id))} className="text-xs font-semibold text-[#1677FF] hover:underline">
        {value.length === roomTypes.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
      </button>
    </legend>
    <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
      {roomTypes.map((roomType) => (
        <label key={roomType.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
          <input type="checkbox" checked={value.includes(roomType.id)} onChange={() => onChange(toggle(value, roomType.id))} className="h-4 w-4 rounded border-slate-300 accent-[#1677FF]" />
          <span className="min-w-0 flex-1 truncate" title={roomType.name}>{roomType.name}</span>
          {!roomType.active && <span className="text-[11px] text-slate-400">Tạm ngừng</span>}
        </label>
      ))}
    </div>
    {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
  </fieldset>
);

/** Ô chọn khoảng ngày từ – đến. */
export const DateRangeInputs = ({ from, to, min, onChange, error }: { from: string; to: string; min: string; onChange: (from: string, to: string) => void; error?: string }) => (
  <div>
    <div className="grid grid-cols-2 gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Từ ngày
        <input type="date" value={from} min={min} onChange={(event) => onChange(event.target.value, to < event.target.value ? event.target.value : to)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-normal outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100" />
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Đến ngày
        <input type="date" value={to} min={from || min} onChange={(event) => onChange(from, event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-normal outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100" />
      </label>
    </div>
    {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
  </div>
);
