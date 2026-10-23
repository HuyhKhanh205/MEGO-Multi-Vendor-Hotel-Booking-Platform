import React from "react";
import { Link } from "react-router-dom";
import { DESTINATION_DEALS } from "./offersData";

export const DestinationDealsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12 w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">travel_explore</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Khuyến Mãi Theo Điểm Đến Hàng Đầu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Khám phá các thiên đường nghỉ dưỡng đang có mức trợ giá mùa hè tốt nhất trong năm.
          </p>
        </div>

        <Link
          to="/hotels"
          className="text-primary text-xs sm:text-sm font-bold hover:underline flex items-center gap-1 self-start md:self-auto"
        >
          <span>Xem tất cả 28 điểm đến</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      </div>

      {/* Destination Mosaic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DESTINATION_DEALS.map((dest) => (
          <Link
            key={dest.id}
            to={`/hotels?destination=${encodeURIComponent(dest.destination)}`}
            className="group relative rounded-3xl overflow-hidden h-72 sm:h-80 shadow-md hover:shadow-xl transition-all cursor-pointer block"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${dest.imageUrl}')` }}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/90 via-on-background/30 to-transparent" />

            {/* Top discount badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-error text-on-error text-xs font-bold shadow-xs">
                {dest.discountText}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <p className="text-xs text-tertiary-fixed uppercase font-bold tracking-wider">
                {dest.tagline}
              </p>
              <h3 className="text-lg sm:text-xl font-bold">{dest.name}</h3>
              <p className="text-xs text-inverse-on-surface/80 flex items-center justify-between pt-1">
                <span>{dest.hotelCountText}</span>
                <span className="font-bold text-tertiary-fixed flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Xem deal</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DestinationDealsSection;
