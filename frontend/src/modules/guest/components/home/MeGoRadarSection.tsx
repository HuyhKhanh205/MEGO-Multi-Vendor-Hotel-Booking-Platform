import React from "react";
import { Link } from "react-router-dom";

export const MeGoRadarSection: React.FC = () => {
  return (
    <section
      aria-label="MeGo Radar bản đồ vị trí"
      className="py-12 sm:py-16 border-y transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content (5-6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#00A389] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00A389] animate-ping" />
              Công nghệ MeGo Radar
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
              Tìm khách sạn gần bãi biển &amp; trung tâm thuận tiện
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Không còn lo lắng khách sạn cách xa bờ biển hay thiếu tiện ích xung quanh. Với MeGo Radar, bạn dễ dàng định vị cơ sở lưu trú tối ưu theo khoảng cách thực tế đến bãi tắm, khu ẩm thực và các địa danh nổi tiếng.
            </p>

            {/* Radar Benefit Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1677FF] flex items-center justify-center shrink-0 text-sm font-bold">
                  🏖️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Cách bờ biển &lt; 200m</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Lọc trực quan đường đi bộ ra biển</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#00A389] flex items-center justify-center shrink-0 text-sm font-bold">
                  🍜
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Kề cận phố ẩm thực</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Tiếp cận các nhà hàng đặc sản địa phương</p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/hotels?view=map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#004CCD] hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Mở bản đồ khách sạn trực quan</span>
              </Link>

              <span className="text-xs text-gray-400">
                (Giao diện bản đồ demo)
              </span>
            </div>
          </div>

          {/* Right Visual / Map Illustration (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 shadow-lg bg-slate-900 aspect-[4/3] group">
              {/* Map Canvas Background */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80"
                alt="MeGo Radar bản đồ khách sạn"
                className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Radar Scanner Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Pin 1: Danang Beach */}
              <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-blue-500/40 animate-ping absolute" />
                  <div className="px-2.5 py-1 rounded-full bg-white text-[#1677FF] font-bold text-xs shadow-md border border-blue-200 flex items-center gap-1">
                    <span>🏨</span>
                    <span>2.850.000₫</span>
                  </div>
                </div>
              </div>

              {/* Pin 2: Nha Trang Resort */}
              <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                <div className="relative flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-teal-500/40 animate-ping absolute" />
                  <div className="px-2.5 py-1 rounded-full bg-[#1677FF] text-white font-bold text-xs shadow-md border border-white flex items-center gap-1">
                    <span>★ 4.9</span>
                    <span>Resort sát biển</span>
                  </div>
                </div>
              </div>

              {/* Map Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-white/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-bold text-gray-800">MeGo Radar Scanner</span>
                  <span className="text-gray-400 hidden sm:inline">• 120+ khách sạn ven biển</span>
                </div>
                <Link
                  to="/hotels"
                  className="font-bold text-[#1677FF] hover:underline"
                >
                  Xem ngay &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeGoRadarSection;
