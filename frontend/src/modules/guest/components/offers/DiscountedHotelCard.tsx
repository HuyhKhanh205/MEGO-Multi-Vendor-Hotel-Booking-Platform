import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ChevronRight } from "../../../../components/common/Icons";
import type { HotelItem } from "../../../../types/hotel";

interface DiscountedHotelCardProps {
  hotel: HotelItem;
}

export const DiscountedHotelCard: React.FC<DiscountedHotelCardProps> = ({
  hotel,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const hasDiscount = Boolean(
    hotel.originalPrice &&
    hotel.originalPrice > hotel.pricePerNight &&
    hotel.discountPercent &&
    hotel.discountPercent > 0
  );

  const detailUrl = `/hotels/${hotel.id}`;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* 1. Hotel Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Link to={detailUrl} className="block w-full h-full">
          <img
            src={hotel.coverImage}
            alt={hotel.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {hasDiscount && (
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#1677FF] text-white shadow-xs">
              Tiết kiệm {hotel.discountPercent}%
            </span>
          )}
          {hotel.badge && !hasDiscount && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
              {hotel.badge}
            </span>
          )}
          {hotel.isPopular && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
              🔥 Bán chạy
            </span>
          )}
        </div>

        {/* Distance or Location Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-400" />
          <span className="truncate max-w-[200px]">
            {hotel.distanceToBeach || `${hotel.district}, ${hotel.city}`}
          </span>
        </div>
      </div>

      {/* 2. Hotel Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Star/Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="truncate text-slate-600 font-medium">
              {hotel.district}, {hotel.city}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-xs shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{hotel.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({hotel.reviewCount})</span>
            </div>
          </div>

          {/* Hotel Name */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors line-clamp-1">
            <Link to={detailUrl}>{hotel.name}</Link>
          </h3>

          {/* Amenities highlights */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[11px] text-slate-400 px-1 py-0.5">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* 3. Pricing & Booking CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
          <div>
            {hasDiscount && hotel.originalPrice && (
              <span className="text-xs text-slate-400 line-through block">
                {formatPrice(hotel.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-[#1677FF]">
                {formatPrice(hotel.pricePerNight)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">/đêm</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Đã bao gồm thuế & phí
            </span>
          </div>

          <Link
            to={detailUrl}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1677FF] hover:bg-[#0039B3] active:scale-95 transition-all shadow-xs"
          >
            <span>Xem phòng</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DiscountedHotelCard;
