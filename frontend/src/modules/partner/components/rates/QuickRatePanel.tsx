import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import partnerInventoryApi from "../../services/partnerInventoryApi";
import type { PriceAdjustMode, RoomInventoryDto, RoomTypeDto } from "../../types/backend.types";
import { dateRange, formatDayMonth, formatVnd, isoWeekday } from "../../utils/formatters";
import { applyPriceAdjust, PERCENT_MAX, PERCENT_MIN, priceError, validateBulkScope } from "../../utils/inventoryRules";
import { DateRangeInputs, RoomTypeChecklist, WeekdayPicker } from "../shared/BulkPickers";
import type { DateSelection } from "./RateCalendar";

const MODES: Array<{ value: PriceAdjustMode; label: string }> = [
  { value: "SET", label: "Đặt giá cố định" },
  { value: "PERCENT", label: "Tăng/giảm theo %" },
  { value: "AMOUNT", label: "Tăng/giảm theo số tiền" },
  { value: "RESET", label: "Về giá cơ bản" },
];

const valueError = (mode: PriceAdjustMode, raw: string): string | null => {
  if (mode === "RESET") return null;
  const value = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(value)) return "Nhập giá trị điều chỉnh.";
  if (mode === "SET") return priceError(value);
  if (mode === "PERCENT") return value === 0 || value < PERCENT_MIN || value > PERCENT_MAX ? `Phần trăm từ ${PERCENT_MIN}% đến +${PERCENT_MAX}% và khác 0.` : null;
  return value === 0 || Math.abs(value) > 100_000_000 ? "Số tiền điều chỉnh khác 0 và tối đa 100 triệu." : null;
};

interface QuickRatePanelProps {
  hotelId: number;
  roomTypes: RoomTypeDto[];
  /** Hạng phòng đang xem trên lịch: dùng làm mặc định và để xem trước giá */
  currentRoomType: RoomTypeDto;
  range: DateSelection;
  onRangeChange: (range: DateSelection) => void;
  /** Ô tồn kho đã tải của hạng phòng đang xem (undefined nếu ngoài tháng đang xem) */
  getCell: (date: string) => RoomInventoryDto | undefined;
  today: string;
  onApplied: () => void;
}

/** Panel "Cấu hình giá nhanh": điều chỉnh giá hàng loạt theo khoảng ngày, thứ và hạng phòng. */
export const QuickRatePanel = ({ hotelId, roomTypes, currentRoomType, range, onRangeChange, getCell, today, onApplied }: QuickRatePanelProps) => {
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [roomTypeIds, setRoomTypeIds] = useState<number[]>([currentRoomType.id]);
  const [mode, setMode] = useState<PriceAdjustMode>("PERCENT");
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const scopeErrors = validateBulkScope({ ...range, weekdays, roomTypeIds }, today);
  const modeError = valueError(mode, value);

  const start = range.from < today ? today : range.from;
  const matchingDays = !scopeErrors.range && start <= range.to ? dateRange(start, range.to).filter((date) => weekdays.includes(isoWeekday(date))) : [];
  const previewDate = matchingDays[0];
  const previewCell = previewDate ? getCell(previewDate) : undefined;
  const oldPrice = previewCell?.effectivePrice ?? currentRoomType.basePrice;
  const newPrice = modeError ? null : applyPriceAdjust(oldPrice, mode, Number(value)) ?? currentRoomType.basePrice;
  const newPriceError = newPrice === null ? null : priceError(newPrice);
  const affected = matchingDays.length * roomTypeIds.length;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(scopeErrors).length || modeError || newPriceError || !affected) return;
    setSaving(true);
    try {
      const { updatedCount } = await partnerInventoryApi.bulkUpdate(hotelId, {
        roomTypeIds,
        from: range.from,
        to: range.to,
        weekdays,
        price: { mode, value: mode === "RESET" ? 0 : Number(value) },
      });
      toast.success(`Đã cập nhật giá cho ${updatedCount} ngày × hạng phòng.`);
      setSubmitted(false);
      onApplied();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không cập nhật được giá.");
    } finally {
      setSaving(false);
    }
  };

  const show = (message?: string | null) => (submitted && message ? message : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5">
      <div>
        <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900"><BoltOutlined className="text-[#1677FF]" sx={{ fontSize: 20 }} /> Cấu hình giá nhanh</h2>
        <p className="mt-0.5 text-xs text-slate-500">Chọn ngày trên lịch (giữ Shift để chọn khoảng) hoặc nhập bên dưới.</p>
      </div>

      <DateRangeInputs from={range.from} to={range.to} min={today} onChange={(from, to) => onRangeChange({ from, to })} error={show(scopeErrors.range)} />
      <WeekdayPicker value={weekdays} onChange={setWeekdays} error={show(scopeErrors.weekdays)} />
      <RoomTypeChecklist roomTypes={roomTypes} value={roomTypeIds} onChange={setRoomTypeIds} error={show(scopeErrors.roomTypeIds)} />

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-slate-700">Cách điều chỉnh</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {MODES.map((item) => (
            <label key={item.value} className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold ${mode === item.value ? "border-[#1677FF] bg-blue-50 text-[#1677FF] dark:bg-blue-500/15" : "border-slate-200 text-slate-600 hover:border-blue-300"}`}>
              <input type="radio" name="rate-mode" value={item.value} checked={mode === item.value} onChange={() => setMode(item.value)} className="sr-only" />
              {item.label}
            </label>
          ))}
        </div>
        {mode !== "RESET" && (
          <div className="relative mt-2">
            <input
              aria-label="Giá trị điều chỉnh"
              type="number"
              inputMode="decimal"
              step={mode === "PERCENT" ? 1 : 10_000}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={mode === "PERCENT" ? "VD: 15 hoặc -10" : mode === "SET" ? "VD: 1500000" : "VD: 200000 hoặc -100000"}
              className={`w-full rounded-xl border py-2.5 pl-3 pr-10 text-sm outline-none focus:ring-2 ${show(modeError) ? "border-red-400 focus:ring-red-200" : "border-slate-200 bg-slate-50/60 focus:border-[#1677FF] focus:bg-white focus:ring-blue-100"}`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">{mode === "PERCENT" ? "%" : "₫"}</span>
          </div>
        )}
        {show(modeError) && <p className="mt-1 text-xs font-semibold text-red-500">{modeError}</p>}
      </fieldset>

      <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Xem trước</p>
        {previewDate ? (
          <>
            <p className="mt-1 text-xs text-slate-500">{currentRoomType.name} · {formatDayMonth(previewDate)}</p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm">
              <span className="text-slate-500 line-through decoration-slate-400">{formatVnd(oldPrice)}</span>
              <ArrowForwardOutlined sx={{ fontSize: 15 }} className="text-slate-400" />
              <span className={`font-extrabold ${newPriceError ? "text-red-500" : "text-slate-900"}`}>{newPrice === null ? "—" : formatVnd(newPrice)}</span>
            </p>
            {newPriceError && <p className="mt-1 text-xs font-semibold text-red-500">{newPriceError}</p>}
            <p className="mt-1.5 text-xs text-slate-600">Ảnh hưởng <strong>{matchingDays.length}</strong> ngày × <strong>{roomTypeIds.length}</strong> hạng phòng = <strong>{affected}</strong> ô giá.</p>
          </>
        ) : (
          <p className="mt-1 text-xs text-slate-500">Không có ngày nào phù hợp trong khoảng đã chọn.</p>
        )}
      </div>

      <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004CCD] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#003db3] disabled:opacity-60">
        {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {saving ? "Đang áp dụng..." : "Áp dụng giá"}
      </button>
    </form>
  );
};

export default QuickRatePanel;
