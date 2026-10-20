import React from "react";
import HotelSearchForm from "./HotelSearchForm";

export const HeroSection: React.FC = () => {
  return (
    <section
      aria-label="Tìm kiếm kỳ nghỉ"
      className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Background Image with Dark Contrast Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=85"
          alt="Khu nghỉ dưỡng ven biển MeGo"
          className="w-full h-full object-cover object-center scale-105 transform animate-in fade-in duration-700"
          loading="eager"
        />
        {/* Modern dark gradient overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/50 to-gray-900/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        {/* Intro Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
          Nền tảng đặt phòng khách sạn & resort MeGo
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-sm">
          Khám phá kỳ nghỉ mơ ước <br className="hidden sm:inline" />
          của bạn cùng <span className="text-blue-400">MeGo</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-xs font-normal">
          Kết nối trực tiếp khách du lịch với hàng trăm khách sạn, resort ven biển và căn hộ nghỉ dưỡng hàng đầu. Cam kết giá tốt nhất, xác nhận tức thì.
        </p>

        {/* Search Bar Component */}
        <div className="mt-8 sm:mt-10">
          <HotelSearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
