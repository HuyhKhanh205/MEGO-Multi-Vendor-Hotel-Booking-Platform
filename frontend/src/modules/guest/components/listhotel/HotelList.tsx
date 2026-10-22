import { useState } from "react";
import { Link } from "react-router-dom";
import {
  SearchX,
  RotateCcw,
  MapPin,
  Star,
  ExternalLink,
  Compass,
  Navigation,
} from "../../../../components/common/Icons";
import { HotelCard } from "./HotelCard";
import { HotelCardSkeleton } from "./HotelCardSkeleton";
import type { HotelItem } from "../../../../types/hotel";

interface HotelListProps {
  hotels: HotelItem[];
  isLoading?: boolean;
  onResetFilters: () => void;
  viewMode: "list" | "map";
}

export const HotelList = ({
  hotels,
  isLoading,
  onResetFilters,
  viewMode,
}: HotelListProps) => {
  const [selectedMapHotel, setSelectedMapHotel] = useState<HotelItem | null>(
    hotels[0] || null
  );

  // 1. Loading Skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. Empty State
  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
          Không tìm thấy chỗ nghỉ phù hợp
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed">
          Rất tiếc, không có khách sạn nào khớp với tất cả các tiêu chí bạn đã
          chọn. Hãy thử bỏ bớt một vài bộ lọc hoặc nới rộng mức giá.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Xóa tất cả bộ lọc</span>
        </button>
      </div>
    );
  }

  // 3. Map View (MeGo Radar Interactive Simulation)
  if (viewMode === "map") {
    const activeHotel = selectedMapHotel || hotels[0];

    return (
      <div className="space-y-4">
        {/* Map Header & Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-semibold">
            <Compass className="w-4 h-4 text-[#1677FF]" />
            <span>Chế độ MeGo Radar Map</span>
            <span className="text-xs text-slate-400 font-normal hidden sm:inline">
              — Bấm vào các điểm giá trên bản đồ để xem trước thông tin
            </span>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            {hotels.length} vị trí
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Simulated Map Canvas */}
          <div className="lg:col-span-8 bg-slate-900 rounded-3xl relative overflow-hidden min-h-[420px] sm:min-h-[500px] border border-slate-700 shadow-inner flex flex-col justify-between p-4 sm:p-6">
            {/* Visual Map Grid & Radial Decor */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#60A5FA 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)",
                backgroundSize: "20px 20px, 40px 40px, 40px 40px",
              }}
            />

            {/* Radar Wave Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-500/20 animate-ping pointer-events-none" />

            {/* Top Info Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white text-xs">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Khu vực: {activeHotel.city} & vùng phụ cận</span>
              </div>
            </div>

            {/* Pins Scatter Overlay */}
            <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-6">
              {hotels.map((hotel, index) => {
                const isSelected = activeHotel.id === hotel.id;
                const priceShort = (hotel.pricePerNight / 1000000).toFixed(2);

                return (
                  <button
                    key={hotel.id}
                    type="button"
                    onClick={() => setSelectedMapHotel(hotel)}
                    className={`group relative text-left p-2 rounded-2xl transition-all duration-300 transform active:scale-95 ${
                      isSelected
                        ? "scale-105 z-20"
                        : "hover:scale-102 opacity-90 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                        isSelected
                          ? "bg-[#1677FF] text-white ring-4 ring-blue-500/30 scale-105"
                          : "bg-white text-slate-900 group-hover:bg-blue-50 group-hover:text-blue-600"
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-white" : "text-[#1677FF]"
                        }`}
                      />
                      <span>{priceShort} tr</span>
                    </div>

                    <div className="mt-1 text-[11px] text-white/90 drop-shadow truncate max-w-[140px] font-medium">
                      #{index + 1} {hotel.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hệ thống định vị MeGo Maps API v2</span>
              <span>Kinh độ / Vĩ độ: 16.0544° N, 108.2022° E</span>
            </div>
          </div>

          {/* Selected Hotel Quick Preview Card */}
          <div className="lg:col-span-4 flex flex-col">
            {activeHotel && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-3">
                    <img
                      src={activeHotel.coverImage}
                      alt={activeHotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#1677FF] text-white text-[11px] font-bold">
                      {activeHotel.rating.toFixed(1)} ★
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {Array.from({ length: activeHotel.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                    <span className="text-[11px] text-slate-400 ml-1">
                      {activeHotel.stars} sao
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">
                    {activeHotel.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-1">
                    {activeHotel.address}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {activeHotel.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      Giá mỗi đêm
                    </span>
                    <span className="text-lg font-bold text-[#1677FF]">
                      {activeHotel.pricePerNight.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <Link
                    to={`/hotels/${activeHotel.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Chi tiết</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Default: Standard List View
  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};
