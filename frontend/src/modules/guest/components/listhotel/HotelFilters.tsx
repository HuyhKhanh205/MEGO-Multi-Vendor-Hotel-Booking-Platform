import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, MapPin } from "../../../../components/common/Icons";
import type { HotelFilterState, PropertyType } from "../../../../types/hotel";

interface HotelFiltersProps {
  filters: HotelFilterState;
  onChange: (filters: HotelFilterState) => void;
  onReset: () => void;
  className?: string;
  totalActiveCount?: number;
}

const STAR_ITEMS = [
  { stars: 5, label: "5 sao", count: 64 },
  { stars: 4, label: "4 sao", count: 112 },
  { stars: 3, label: "3 sao", count: 86 },
  { stars: 2, label: "2 sao", count: 42 },
  { stars: 1, label: "1 sao", count: 24 },
];

const RATING_ITEMS = [
  { threshold: 4.5, label: "9+ Xuất sắc", count: 78 },
  { threshold: 4.0, label: "8+ Rất tốt", count: 145 },
  { threshold: 3.5, label: "7+ Tốt", count: 210 },
];

const AMENITY_ITEMS = [
  { label: "Hồ bơi", icon: "🏊" },
  { label: "Bữa sáng miễn phí", icon: "🍽️" },
  { label: "Giáp biển", icon: "🏖️" },
  { label: "Đưa đón sân bay", icon: "🚗" },
  { label: "Cho phép hủy miễn phí", icon: "🛡️" },
  { label: "Wifi 500Mbps", icon: "📶" },
  { label: "Spa & Massage", icon: "💆" },
];

const PROPERTY_TYPES_ITEMS: { label: string; value: PropertyType; count: number }[] = [
  { label: "Khách sạn", value: "hotel", count: 180 },
  { label: "Resort & Villa", value: "resort", count: 45 },
  { label: "Homestay", value: "homestay", count: 38 },
  { label: "Căn hộ dịch vụ", value: "apartment", count: 35 },
  { label: "Boutique Hotel", value: "villa", count: 30 },
];

const LOCATION_AREAS = [
  { label: "Bãi biển Mỹ Khê", count: 142 },
  { label: "Trung tâm thành phố", count: 96 },
  { label: "Bán đảo Sơn Trà", count: 48 },
  { label: "Ngũ Hành Sơn", count: 42 },
];

export const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  onChange,
  onReset,
  className = "",
  totalActiveCount = 0,
}) => {
  const [minPriceInput, setMinPriceInput] = useState<number>(
    filters.minPrice || 1000000
  );
  const [maxPriceInput, setMaxPriceInput] = useState<number>(
    filters.maxPrice || 6500000
  );

  const handleStarToggle = (star: number) => {
    const exists = filters.stars.includes(star);
    const updated = exists
      ? filters.stars.filter((s) => s !== star)
      : [...filters.stars, star];
    onChange({ ...filters, stars: updated });
  };

  const handleRatingSelect = (threshold: number) => {
    const nextVal = filters.ratingThreshold === threshold ? undefined : threshold;
    onChange({ ...filters, ratingThreshold: nextVal });
  };

  const handlePropertyTypeToggle = (type: PropertyType) => {
    const exists = filters.propertyTypes.includes(type);
    const updated = exists
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    onChange({ ...filters, propertyTypes: updated });
  };

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: updated });
  };

  const handlePolicyToggle = (policy: string) => {
    const exists = filters.policies.includes(policy);
    const updated = exists
      ? filters.policies.filter((p) => p !== policy)
      : [...filters.policies, policy];
    onChange({ ...filters, policies: updated });
  };

  const handlePriceApply = (min: number, max: number) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
      priceRange: `${min}-${max}`,
    });
  };

  return (
    <div className={`space-y-5 text-slate-800 ${className}`}>
      {/* ── 1. Header: Title & Reset ───────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1677FF]" />
          <h3 className="text-sm font-bold text-slate-900">Bộ lọc tìm kiếm</h3>
          {totalActiveCount > 0 && (
            <span className="w-4.5 h-4.5 px-1 rounded-full bg-[#1677FF] text-white text-[10px] font-bold flex items-center justify-center">
              {totalActiveCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#1677FF] hover:text-blue-700 font-semibold hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      {/* ── 2. Interactive Map Mini Card (Exact match with reference image) ── */}
      <Link
        to="/hotels?view=map"
        className="block relative rounded-2xl overflow-hidden group border border-blue-200/80 shadow-xs hover:shadow-md transition-all"
      >
        <div className="h-24 bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
          {/* Map Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(#1677FF 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }}
          />
          <div className="relative z-10 flex flex-col items-center text-center p-2">
            <div className="w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center shadow-md mb-1 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900">
              Xem trên bản đồ
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              328 vị trí khách sạn
            </span>
          </div>
        </div>
      </Link>

      {/* ── 3. Khoảng giá / đêm ────────────────────────────────────────── */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900">
            Khoảng giá / đêm
          </h4>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            VND
          </span>
        </div>

        {/* Dual slider bar visual mockup */}
        <div className="relative h-2 bg-slate-200 rounded-full mb-2">
          <div className="absolute left-[10%] right-[35%] h-full bg-[#1677FF] rounded-full" />
          <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#1677FF] rounded-full shadow-xs cursor-pointer" />
          <div className="absolute right-[35%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-[#1677FF] rounded-full shadow-xs cursor-pointer" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mb-3">
          <span>0 đ</span>
          <span>10.000.000 đ</span>
        </div>

        {/* Min / Max Input Boxes */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
              Tối thiểu
            </span>
            <input
              type="text"
              value={minPriceInput.toLocaleString("vi-VN") + "đ"}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
                handlePriceApply(val, maxPriceInput);
              }}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>
          <div className="p-2 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">
              Tối đa
            </span>
            <input
              type="text"
              value={maxPriceInput.toLocaleString("vi-VN") + "đ"}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/\D/g, ""), 10) || 10000000;
                handlePriceApply(minPriceInput, val);
              }}
              className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── 4. Hạng sao ────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Hạng sao
        </h4>
        <div className="space-y-2">
          {STAR_ITEMS.map((item) => {
            const isChecked = filters.stars.includes(item.stars);
            return (
              <label
                key={item.stars}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleStarToggle(item.stars)}
                    className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
                  />
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-800 font-medium">{item.label}</span>
                </div>
                <span className="text-[11px] text-slate-400">({item.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── 5. Điểm đánh giá ────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Điểm đánh giá
        </h4>
        <div className="space-y-2">
          {RATING_ITEMS.map((item) => {
            const isChecked = filters.ratingThreshold === item.threshold;
            return (
              <label
                key={item.threshold}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="rating-radio"
                    checked={isChecked}
                    onChange={() => handleRatingSelect(item.threshold)}
                    className="w-4 h-4 text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
                  />
                  <span className={`text-xs ${isChecked ? "font-bold text-[#1677FF]" : "text-slate-800"}`}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  {item.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── 6. Tiện nghi phổ biến ───────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Tiện nghi phổ biến
        </h4>
        <div className="space-y-2">
          {AMENITY_ITEMS.map((item) => {
            const isChecked = filters.amenities.includes(item.label);
            return (
              <label
                key={item.label}
                className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(item.label)}
                  className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
                />
                <span className="text-sm shrink-0">{item.icon}</span>
                <span className={isChecked ? "font-semibold text-slate-900" : "text-slate-700"}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── 7. Loại hình lưu trú ────────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Loại hình lưu trú
        </h4>
        <div className="space-y-2">
          {PROPERTY_TYPES_ITEMS.map((item) => {
            const isChecked = filters.propertyTypes.includes(item.value);
            return (
              <label
                key={item.value}
                className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handlePropertyTypeToggle(item.value)}
                    className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
                  />
                  <span className={isChecked ? "font-semibold text-slate-900" : "text-slate-700"}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">({item.count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── 8. Khu vực / Bãi biển ───────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Khu vực / Bãi biển
        </h4>
        <div className="space-y-2">
          {LOCATION_AREAS.map((item, idx) => (
            <label
              key={idx}
              className="flex items-center justify-between text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked={idx === 0}
                  className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
                />
                <span className="text-slate-700">{item.label}</span>
              </div>
              <span className="text-[11px] text-slate-400">{item.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── 9. Chính sách thanh toán ────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">
          Chính sách thanh toán
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.policies.includes("pay-at-hotel")}
              onChange={() => handlePolicyToggle("pay-at-hotel")}
              className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
            />
            <span>Thanh toán khi nhận phòng</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.policies.includes("free-cancellation")}
              onChange={() => handlePolicyToggle("free-cancellation")}
              className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-blue-400 cursor-pointer"
            />
            <span>Hủy miễn phí</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default HotelFilters;
