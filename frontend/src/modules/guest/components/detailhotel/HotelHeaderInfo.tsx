import {
  MapPin,
  Star,
  Sparkles,
} from "../../../../components/common/Icons";
import type { HotelItem } from "../../../../types/hotel";

interface HotelHeaderInfoProps {
  hotel: HotelItem;
  onScrollToLocation?: () => void;
  onScrollToReviews?: () => void;
}

const PROPERTY_TYPE_NAMES: Record<string, string> = {
  hotel: "Khách sạn tiêu chuẩn quốc tế",
  resort: "Khu nghỉ dưỡng & Spa cao cấp",
  villa: "Biệt thự nghỉ dưỡng riêng tư",
  apartment: "Căn hộ dịch vụ cao cấp",
  homestay: "Homestay tiện nghi",
};

export const HotelHeaderInfo = ({
  hotel,
  onScrollToLocation,
  onScrollToReviews,
}: HotelHeaderInfoProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5">
      {/* Left Info */}
      <div className="space-y-2">
        {/* Badges & Stars Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
            {PROPERTY_TYPE_NAMES[hotel.propertyType] || "Khách sạn"}
          </span>
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs text-slate-500 font-medium ml-1">
              {hotel.stars} sao
            </span>
          </div>

          {hotel.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              ⚡ Được đặt nhiều nhất
            </span>
          )}
        </div>

        {/* Hotel Name */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {hotel.name}
        </h1>

        {/* Address & Nearby Beach / Landmark */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500">
          <MapPin className="w-4 h-4 text-[#1677FF] shrink-0" />
          <span className="font-medium text-slate-700">{hotel.address}</span>
          {hotel.distanceToBeach && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">
                {hotel.distanceToBeach}
              </span>
            </>
          )}
          {hotel.distanceToCenter && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-semibold">
                {hotel.distanceToCenter}
              </span>
            </>
          )}
          <button
            type="button"
            onClick={onScrollToLocation}
            className="text-[#1677FF] font-bold hover:underline cursor-pointer ml-1"
          >
            Xem bản đồ
          </button>
        </div>
      </div>

      {/* Right: Review Summary Box */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs shrink-0 self-start">
        <div className="text-right">
          <button
            type="button"
            onClick={onScrollToReviews}
            className="text-sm font-bold text-slate-900 hover:text-[#1677FF] transition-colors block text-right"
          >
            {hotel.ratingText || "Xuất sắc"}
          </button>
          <button
            type="button"
            onClick={onScrollToReviews}
            className="text-xs text-slate-400 hover:underline block text-right"
          >
            {hotel.reviewCount.toLocaleString("vi-VN")} đánh giá
          </button>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
            <Sparkles className="w-3 h-3" />
            98% khách hài lòng
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#1677FF] text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          {hotel.rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
};
