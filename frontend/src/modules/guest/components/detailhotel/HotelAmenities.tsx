import React from "react";
import {
  Waves,
  Sparkles,
  Dumbbell,
  Utensils,
  Wine,
  Wifi,
  Sun,
  Plane,
} from "../../../../components/common/Icons";

export interface AmenityDetail {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgClass: string;
}

// 8 Tiện nghi nổi bật chuẩn theo thiết kế tham chiếu
export const FEATURED_AMENITIES_8: AmenityDetail[] = [
  {
    id: "amenity-pool",
    title: "Hồ bơi vô cực",
    subtitle: "Nước ngọt & Lagoon.",
    icon: <Waves className="w-5 h-5" />,
    bgClass: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    id: "amenity-spa",
    title: "Spa & Trị liệu",
    subtitle: "Massage đá nóng.",
    icon: <Sparkles className="w-5 h-5" />,
    bgClass: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    id: "amenity-gym",
    title: "Gym & Yoga",
    subtitle: "Studio hiện đại 24/7.",
    icon: <Dumbbell className="w-5 h-5" />,
    bgClass: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    id: "amenity-dining",
    title: "Ẩm thực Á - Âu",
    subtitle: "Buffet hải sản tươi.",
    icon: <Utensils className="w-5 h-5" />,
    bgClass: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    id: "amenity-lounge",
    title: "Hải Vân Lounge",
    subtitle: "Bar cocktail ven biển.",
    icon: <Wine className="w-5 h-5" />,
    bgClass: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    id: "amenity-wifi",
    title: "Wifi 500Mbps",
    subtitle: "Cáp quang tốc độ cao.",
    icon: <Wifi className="w-5 h-5" />,
    bgClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    id: "amenity-beach",
    title: "Bãi biển riêng tư",
    subtitle: "Cát trắng mịn màng.",
    icon: <Sun className="w-5 h-5" />,
    bgClass: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    id: "amenity-shuttle",
    title: "Đưa đón sân bay",
    subtitle: "Xe riêng 2 chiều.",
    icon: <Plane className="w-5 h-5" />,
    bgClass: "bg-sky-50 text-sky-600 border-sky-100",
  },
];

interface HotelAmenitiesProps {
  amenities?: string[];
}

export const HotelAmenities: React.FC<HotelAmenitiesProps> = () => {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Tiện nghi nổi bật
          </h2>
          <div className="h-1 w-12 bg-[#1677FF] rounded-full" />
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          8 tiện ích đặc quyền 5 sao
        </span>
      </div>

      {/* ── 8 Core Featured Amenities Grid (4x2 on Desktop, 2x4 on Tablet, 1x8 on Mobile) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_AMENITIES_8.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
          >
            {/* Number order indicator + Styled Icon */}
            <div className="relative shrink-0">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform ${item.bgClass}`}
              >
                {item.icon}
              </div>
              <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-200/90 group-hover:bg-[#1677FF] group-hover:text-white text-slate-600 text-[9px] font-bold flex items-center justify-center transition-colors">
                {idx + 1}
              </span>
            </div>

            {/* Text Content */}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HotelAmenities;