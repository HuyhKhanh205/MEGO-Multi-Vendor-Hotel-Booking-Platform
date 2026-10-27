import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import partnerInventoryApi from "../../services/partnerInventoryApi";
import { PartnerApiError } from "../../services/partnerHttp";
import type { RoomInventoryDto, RoomTypeDto } from "../../types/backend.types";
import { formatDate, formatVnd, formatWeekday } from "../../utils/formatters";
import { priceError } from "../../utils/inventoryRules";
import Overlay from "../shared/Overlay";

interface DayRateDialogProps {
  cell: RoomInventoryDto;
  roomType: RoomTypeDto;
  onClose: () => void;
  onSaved: (cell: RoomInventoryDto) => void;
  /** Dữ liệu đã cũ (409) → trang cha tải lại */
  onConflict: () => void;
}

/** Sửa giá và đóng/mở bán cho đúng một ngày của một hạng phòng. Mount lại cho mỗi ô (dùng key). */
export const DayRateDialog = ({ cell, roomType, onClose, onSaved, onConflict }: DayRateDialogProps) => {
  const [useBase, setUseBase] = useState(cell.price === null);
  const [price, setPrice] = useState(String(cell.price ?? roomType.basePrice));
  const [closed, setClosed] = useState(cell.closed);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextPrice = useBase ? null : Number(price);
    const problem = priceError(nextPrice);
    if (problem) return setError(problem);
    setSaving(true);
    try {
      const saved = await partnerInventoryApi.updateInventory(cell.id, { price: nextPrice, closed, version: cell.version });
      toast.success(`Đã lưu ngày ${formatDate(cell.date)}.`);
      onSaved(saved);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không lưu được.";
      toast.error(message);
      if (err instanceof PartnerApiError && err.status === 409) onConflict();
      else setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay
      open
      onClose={onClose}
      widthClass="max-w-md"
      title={`${formatWeekday(cell.date)}, ${formatDate(cell.date)}`}
      subtitle={`${roomType.name} · còn ${cell.availableRooms}/${cell.totalRooms} phòng`}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Hủy</button>
          <button type="submit" form="day-rate-form" disabled={saving} className="rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003db3] disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu ngày này"}
          </button>
        </div>
      }
    >
      <form id="day-rate-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-semibold text-slate-700">Giá bán ngày này</legend>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="day-price-mode" checked={useBase} onChange={() => { setUseBase(true); setError(null); }} className="accent-[#1677FF]" />
            Dùng giá cơ bản ({formatVnd(roomType.basePrice)})
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="day-price-mode" checked={!useBase} onChange={() => setUseBase(false)} className="accent-[#1677FF]" />
            Đặt giá riêng
          </label>
          {!useBase && (
            <div className="relative">
              <input
                aria-label="Giá riêng (VND)"
                type="number"
                inputMode="numeric"
                step={10_000}
                min={0}
                value={price}
                autoFocus
                onChange={(event) => { setPrice(event.target.value); setError(null); }}
                className={`w-full rounded-xl border py-2.5 pl-3 pr-10 text-sm outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-200" : "border-slate-200 bg-slate-50/60 focus:border-[#1677FF] focus:bg-white focus:ring-blue-100"}`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₫</span>
            </div>
          )}
          {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
        </fieldset>

        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
          <span>
            <span className="block text-sm font-semibold text-slate-800">Khóa bán ngày này</span>
            <span className="mt-0.5 block text-xs text-slate-500">Khách không đặt được hạng phòng này cho đêm {formatDate(cell.date)}.</span>
          </span>
          <input type="checkbox" checked={closed} onChange={(event) => setClosed(event.target.checked)} className="mt-1 h-5 w-5 accent-red-500" />
        </label>
      </form>
    </Overlay>
  );
};

export default DayRateDialog;
