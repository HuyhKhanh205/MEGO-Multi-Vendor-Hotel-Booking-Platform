import React from "react";
import DiscountedHotelCard from "./DiscountedHotelCard";
import type { HotelItem } from "../../../../types/hotel";

interface DiscountedHotelsSectionProps {
  hotels: HotelItem[];
}

export const DiscountedHotelsSection: React.FC<DiscountedHotelsSectionProps> = ({
  hotels,
}) => {
  if (hotels.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" aria-labelledby="discounted-hotels-heading">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" />
            <h2
              id="discounted-hotels-heading"
              className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight"
            >
              Khách sạn đang có ưu đãi
            </h2>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Khám phá các khách sạn và khu nghỉ dưỡng có mức giá ưu đãi tốt nhất hiện nay.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Hiển thị {hotels.length} khách sạn
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {hotels.map((hotel) => (
          <DiscountedHotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </section>
  );
};

export default DiscountedHotelsSection;
