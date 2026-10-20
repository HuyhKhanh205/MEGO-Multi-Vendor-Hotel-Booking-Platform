import React from "react";
import { Link } from "react-router-dom";
import { POPULAR_DESTINATIONS } from "../data/homeData";

export const PopularDestinationsSection: React.FC = () => {
  return (
    <section aria-label="Điểm đến du lịch phổ biến" className="py-12 sm:py-16 bg-[#F9F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1677FF] text-xs font-bold uppercase tracking-wider mb-2">
              Khám phá Việt Nam
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Điểm đến nghỉ dưỡng được yêu thích
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Các thành phố biển và khu nghỉ dưỡng hàng đầu cho chuyến đi tiếp theo của bạn.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors group"
          >
            <span>Khám phá thêm điểm đến</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Destinations Grid (6 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              to={`/hotels?destination=${encodeURIComponent(dest.cityKey)}`}
              className="relative rounded-3xl overflow-hidden aspect-[16/10] group shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" />

              {/* Top Hotel Count Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {dest.hotelCount}+ khách sạn
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-extrabold tracking-tight group-hover:text-blue-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-gray-200 mt-1 line-clamp-1 font-normal">
                  {dest.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinationsSection;
