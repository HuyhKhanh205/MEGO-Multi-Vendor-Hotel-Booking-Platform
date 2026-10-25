import React from "react";
import { Link } from "react-router-dom";
import type { FeaturedHotel } from "../../types/homeTypes";

interface HotelCardProps {
  hotel: FeaturedHotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  return (
    <div
      className="rounded-3xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Hotel Image with Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Link to={`/hotels/${hotel.id}`} className="block w-full h-full cursor-pointer">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {hotel.badge && (
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#1677FF] text-white shadow-xs">
              {hotel.badge}
            </span>
          )}
          {hotel.discountPercent && (
            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500 text-white shadow-xs">
              -{hotel.discountPercent}%
            </span>
          )}
        </div>

        {/* Distance Badge */}
        {hotel.distanceToBeach && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-950/70 backdrop-blur-md text-white flex items-center gap-1 pointer-events-none">
            <span>📍</span>
            <span>{hotel.distanceToBeach}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location & Rating Header */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="flex items-center gap-1 text-gray-600 font-medium truncate">
              <span>📍</span>
              <span>{hotel.area}, {hotel.city}</span>
            </span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-xs shrink-0">
              <span className="text-amber-500">★</span>
              <span>{hotel.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Hotel Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#1677FF] transition-colors line-clamp-1">
            <Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link>
          </h3>

          {/* Rating Summary */}
          <p className="text-[11px] text-gray-400 mt-0.5">
            {hotel.ratingText} • {hotel.reviewCount.toLocaleString()} đánh giá xác thực
          </p>

          {/* Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-[11px] text-gray-400 px-1 py-0.5">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
          <div>
            {hotel.originalPrice && (
              <span className="text-xs text-gray-400 line-through block">
                {formatPrice(hotel.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-[#1677FF]">
                {formatPrice(hotel.salePrice)}
              </span>
              <span className="text-xs text-gray-400 font-normal">/đêm</span>
            </div>
            <span className="text-[10px] text-gray-400 block">Đã bao gồm thuế & phí</span>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1677FF] hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
