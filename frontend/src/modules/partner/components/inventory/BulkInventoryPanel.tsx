import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import DynamicFeedOutlined from "@mui/icons-material/DynamicFeedOutlined";
import partnerInventoryApi from "../../services/partnerInventoryApi";
import type { InventoryBulkRequest, RoomTypeDto } from "../../types/backend.types";
import { addDays, dateRange, formatDate, isoWeekday } from "../../utils/formatters";
import { validateBulkScope } from "../../utils/inventoryRules";
import { DateRangeInputs, RoomTypeChecklist, WeekdayPicker } from "../shared/BulkPickers";

type BulkAction = "SET" | "REDUCE" | "STOP_SELL" | "REOPEN";

const ACTIONS: Array<{ value: BulkAction; label: string; hint: string }> = [
  { value: "SET", label: "Đặt số phòng mở bán", hint: "Số phòng trống = N (không vượt tổng phòng)." },
  { value: "REDUCE", label: "Giữ lại phòng dự phòng", hint: "Bớt N phòng khỏi số phòng đang mở bán." },
  { value: "STOP_SELL", label: "Khóa bán", hint: "Khách không đặt được các ngày đã chọn." },
  { value: "REOPEN", label: "Mở bán lại", hint: "Bỏ khóa bán cho các ngày đã chọn." },
];

interface BulkInventoryPanelProps {
  hotelId: number;
  roomTypes: RoomTypeDto[];
  defaultFrom: string;
  today: string;
  onApplied: () => void;
}

/** Panel cập nhật tồn kho / đóng-mở bán hàng loạt. */
export const BulkInventoryPanel = ({ hotelId, roomTypes, defaultFrom, today, onApplied }: BulkInventoryPanelProps) => {
  const [range, setRange] = useState({ from: defaultFrom, to: addDays(defaultFrom, 6) });
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [roomTypeIds, setRoomTypeIds] = useState<number[]>(roomTypes.map((item) => item.id));
  const [action, setAction] = useState<BulkAction>("STOP_SELL");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const scopeErrors = validateBulkScope({ ...range, weekdays, roomTypeIds }, today);
  const needsAmount = action === "SET" || action === "REDUCE";
  const amountValue = Number(amount);
  const amountError = !needsAmount
    ? null
    : amount.trim() === "" || !Number.isInteger(amountValue) || amountValue < 0
      ? "Nhập số phòng (số nguyên ≥ 0)."
      : action === "REDUCE" && amountValue === 0
        ? "Số phòng giữ lại phải lớn hơn 0."
        : null;

  const start = range.from < today ? today : range.from;
  const dayCount = !scopeErrors.range && start <= range.to ? dateRange(start, range.to).filter((date) => weekdays.includes(isoWeekday(date))).length : 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(scopeErrors).length || amountError || !dayCount) return;

    if (action === "STOP_SELL") {
      const names = roomTypes.filter((item) => roomTypeIds.includes(item.id)).map((item) => item.name).join(", ");
      const confirmed = window.confirm(
        `Khóa bán ${dayCount} ngày (${formatDate(start)} – ${formatDate(range.to)}) cho: ${names}?\nKhách sẽ không đặt được các ngày này cho tới khi bạn mở bán lại.`,
      );
      if (!confirmed) return;
    }

    const request: InventoryBulkRequest = { roomTypeIds, from: range.from, to: range.to, weekdays };
    if (needsAmount) request.allotment = { mode: action as "SET" | "REDUCE", value: amountValue };
    else request.closed = action === "STOP_SELL";

    setSaving(true);
    try {
      const { updatedCount } = await partnerInventoryApi.bulkUpdate(hotelId, request);
      toast.success(`Đã cập nhật ${updatedCount} ngày × hạng phòng.`);
      setSubmitted(false);
      onApplied();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không cập nhật được tồn kho.");
    } finally {
      setSaving(false);
    }
  };

  const show = (message?: string | null) => (submitted && message ? message : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5">
      <div>
        <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900"><DynamicFeedOutlined className="text-[#1677FF]" sx={{ fontSize: 20 }} /> Cập nhật hàng loạt</h2>
        <p className="mt-0.5 text-xs text-slate-500">Áp dụng cho nhiều ngày và hạng phòng cùng lúc. Ngày đã qua được bỏ qua.</p>
      </div>

      <DateRangeInputs from={range.from} to={range.to} min={today} onChange={(from, to) => setRange({ from, to })} error={show(scopeErrors.range)} />
      <WeekdayPicker value={weekdays} onChange={setWeekdays} error={show(scopeErrors.weekdays)} />
      <RoomTypeChecklist roomTypes={roomTypes} value={roomTypeIds} onChange={setRoomTypeIds} error={show(scopeErrors.roomTypeIds)} />

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-slate-700">Thao tác</legend>
        <div className="space-y-1.5">
          {ACTIONS.map((item) => (
            <label key={item.value} className={`flex cursor-pointer gap-2.5 rounded-xl border px-3 py-2 ${action === item.value ? "border-[#1677FF] bg-blue-50/60 dark:bg-blue-500/15" : "border-slate-200 hover:border-blue-300"}`}>
              <input type="radio" name="bulk-action" value={item.value} checked={action === item.value} onChange={() => setAction(item.value)} className="mt-0.5 accent-[#1677FF]" />
              <span>
                <span className={`block text-sm font-semibold ${item.value === "STOP_SELL" ? "text-red-600" : "text-slate-800"}`}>{item.label}</span>
                <span className="block text-xs text-slate-500">{item.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {needsAmount && (
          <input
            aria-label={action === "SET" ? "Số phòng mở bán" : "Số phòng giữ lại"}
            type="number"
            min={0}
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={action === "SET" ? "Số phòng mở bán, VD: 5" : "Số phòng giữ lại, VD: 2"}
            className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 ${show(amountError) ? "border-red-400 focus:ring-red-200" : "border-slate-200 bg-slate-50/60 focus:border-[#1677FF] focus:bg-white focus:ring-blue-100"}`}
          />
        )}
        {show(amountError) && <p className="mt-1 text-xs font-semibold text-red-500">{amountError}</p>}
      </fieldset>

      <p className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/5" aria-live="polite">
        Ảnh hưởng <strong>{dayCount}</strong> ngày × <strong>{roomTypeIds.length}</strong> hạng phòng.
      </p>

      <button
        type="submit"
        disabled={saving}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 ${action === "STOP_SELL" ? "bg-red-500 hover:bg-red-600" : "bg-[#004CCD] hover:bg-[#003db3]"}`}
      >
        {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
        {saving ? "Đang cập nhật..." : action === "STOP_SELL" ? "Khóa bán các ngày đã chọn" : "Áp dụng"}
      </button>
    </form>
  );
};

export default BulkInventoryPanel;
