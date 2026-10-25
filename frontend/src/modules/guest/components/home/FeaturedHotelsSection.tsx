import React, { useState } from "react";
import { Link } from "react-router-dom";
import HotelCard from "./HotelCard";
import { FEATURED_HOTELS_DATA } from "../../data/homeData";

export const FeaturedHotelsSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Tất cả");

  const cities = ["Tất cả", "Đà Nẵng", "Nha Trang", "Phú Quốc", "Đà Lạt", "Vũng Tàu"];

  const filteredHotels =
    selectedCity === "Tất cả"
      ? FEATURED_HOTELS_DATA
      : FEATURED_HOTELS_DATA.filter((h) => h.city === selectedCity);

  return (
    <section
      aria-label="Khách sạn và ưu đãi nổi bật"
      className="py-12 sm:py-16 transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1677FF] text-xs font-bold uppercase tracking-wider mb-2">
              Ưu đãi chớp nhoáng
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Khách sạn & Resort ưu đãi nổi bật
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tuyển chọn các kỳ nghỉ được yêu thích nhất với mức giá độc quyền trên MeGo.
            </p>
          </div>

          {/* View All CTA */}
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors group shrink-0"
          >
            <span>Xem toàn bộ khách sạn đang giảm giá</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {cities.map((city) => {
            const isActive = selectedCity === city;
            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1677FF] text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotelsSection;
