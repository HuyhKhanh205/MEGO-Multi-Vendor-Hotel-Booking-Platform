import {
  Calendar,
  Users,
  Sparkles,
  ShieldCheck,
  Phone,
  ChevronRight,
} from "../../../../components/common/Icons";

interface BookingSummaryCardProps {
  startingPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  nightsCount: number;
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
  onGuestsChange: (val: number) => void;
  onRoomsChange: (val: number) => void;
  onScrollToRooms: () => void;
}

export const BookingSummaryCard = ({
  startingPrice,
  originalPrice,
  discountPercent,
  checkIn,
  checkOut,
  guests,
  rooms,
  nightsCount,
  onCheckInChange,
  onCheckOutChange,
  onScrollToRooms,
}: BookingSummaryCardProps) => {
  const estimatedTotal = startingPrice * nightsCount;

  return (
    <aside className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      {/* ── 1. Top Price Block ── */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400 font-medium">Giá mỗi đêm từ</span>
          {discountPercent && discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[11px] font-bold border border-red-200">
              Giảm {discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              {originalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
          <span className="text-2xl sm:text-3xl font-extrabold text-[#1677FF]">
            {startingPrice.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-xs text-slate-500">/ đêm</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Đã bao gồm thuế GTGT và phí dịch vụ
        </p>
      </div>

      {/* ── 2. Dates Selection Box ── */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#1677FF]" />
              Nhận phòng
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#1677FF]" />
              Trả phòng
            </label>
            <input
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20"
            />
          </div>
        </div>

        {/* Guests & Rooms Preview */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Khách & Phòng:
          </span>
          <span className="font-bold text-slate-800">
            {guests} người lớn • {rooms} phòng
          </span>
        </div>
      </div>

      {/* ── 3. Total Calculation Preview ── */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Thời gian lưu trú:</span>
          <span className="font-semibold text-slate-900">{nightsCount} đêm</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Tạm tính ước lượng:</span>
          <span className="font-bold text-[#1677FF] text-sm">
            {estimatedTotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* ── 4. Primary CTA Button ── */}
      <button
        type="button"
        onClick={onScrollToRooms}
        className="w-full py-3.5 px-4 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Chọn phòng trống & Đặt ngay</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* ── 5. MeGo Price Guarantee & Trust ── */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2">
        <p className="font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#1677FF]" />
          Cam kết đảm bảo giá MeGo
        </p>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Giá minh bạch, không phí ẩn. Nếu bạn tìm thấy giá thấp hơn ở nơi khác,
          MeGo sẽ hoàn trả phần chênh lệch.
        </p>
      </div>

      {/* ── 6. Hotline Support ── */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Hỗ trợ đặt phòng 24/7
        </span>
        <a
          href="tel:19001234"
          className="font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          <Phone className="w-3.5 h-3.5" />
          1900 1234
        </a>
      </div>
    </aside>
  );
};
