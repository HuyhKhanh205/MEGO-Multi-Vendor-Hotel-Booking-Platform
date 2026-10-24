import React from "react";
import { Link } from "react-router-dom";
import { POPULAR_DESTINATIONS, TOP_DESTINATIONS_CONFIG } from "../../data/homeData";
import type { DestinationItem } from "../../types/homeTypes";

// ─── Config ──────────────────────────────────────────────────────────────────

const SECTION_CONFIG = {
  badge: "KHÁM PHÁ THIÊN ĐƯỜNG NGHỈ DƯỠNG",
  title: "Điểm đến hàng đầu Việt Nam",
  description: "Những thành phố biển và cao nguyên được yêu thích nhất tháng này",
} as const;

// ─── DestinationCard ─────────────────────────────────────────────────────────

interface DestinationCardProps {
  dest: DestinationItem;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ dest }) => (
  <Link
    to={`/hotels?destination=${encodeURIComponent(dest.cityKey)}`}
    aria-label={`Khám phá khách sạn tại ${dest.name}`}
    className="group relative rounded-xl overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] focus-visible:ring-offset-2"
    style={{ height: "228px" }}
  >
    {/* ── Background image ── */}
    <img
      src={dest.imageUrl}
      alt={`Cảnh đẹp ${dest.name}, Việt Nam`}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />

    {/* ── Gradient overlay ── */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* ── Top-left badge: số chỗ lưu trú (dữ liệu tham khảo) ── */}
    <div className="absolute top-3 left-3">
      <span className="inline-block px-2 py-1 rounded-md bg-black/35 backdrop-blur-sm text-white text-[10px] font-bold leading-none border border-white/15">
        {dest.accommodationBadge}
      </span>
    </div>

    {/* ── Bottom content ── */}
    <div className="absolute bottom-0 left-0 right-0 p-3.5">
      {/* Label viết hoa */}
      <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-0.5 leading-none">
        {dest.badgeLabel}
      </p>

      {/* Tên điểm đến */}
      <h3 className="text-base font-extrabold text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
        {dest.name}
      </h3>

      {/* Giá tham khảo */}
      {dest.startingPrice && (
        <p className="text-[11px] text-white/80 font-medium mt-0.5">
          <span className="text-white/55">từ </span>
          <span className="text-white font-bold">{dest.startingPrice}</span>
          <span className="text-white/55 ml-0.5 text-[10px]"> (tham khảo)</span>
        </p>
      )}
    </div>
  </Link>
);

// ─── Section ─────────────────────────────────────────────────────────────────

export const PopularDestinationsSection: React.FC = () => {
  const { displayCount, totalProvinces } = TOP_DESTINATIONS_CONFIG;
  const topDestinations = POPULAR_DESTINATIONS.slice(0, displayCount);

  return (
    <section
      aria-label="Điểm đến du lịch hàng đầu Việt Nam"
      className="py-10 sm:py-14 bg-[#F9F9FF]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div className="space-y-1.5">
            {/* Label nhỏ */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1677FF] text-[10px] font-black uppercase tracking-widest">
              {SECTION_CONFIG.badge}
            </div>

            {/* Tiêu đề chính */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {SECTION_CONFIG.title}
            </h2>

            {/* Mô tả */}
            <p className="text-sm text-gray-500 font-normal">
              {SECTION_CONFIG.description}
            </p>
          </div>

          {/* Link "Khám phá tất cả" */}
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors group shrink-0 whitespace-nowrap"
          >
            <span>Khám phá tất cả {totalProvinces} tỉnh thành</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* ── 4-card grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {topDestinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinationsSection;
