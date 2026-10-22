import React from "react";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import FeaturedHotelsSection from "../components/home/FeaturedHotelsSection";
import MeGoRadarSection from "../components/home/MeGoRadarSection";
import MeGoClubBanner from "../components/home/MeGoClubBanner";
import PopularDestinationsSection from "../components/home/PopularDestinationsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";

export const GuestHome: React.FC = () => {
  return (
    <div className="w-full bg-[#F9F9FF] text-[#111C2D] overflow-x-hidden">
      {/* Section 1: Hero Banner & Thanh tìm kiếm khách sạn */}
      <HeroSection />

      {/* Section 2: Các lợi ích nổi bật của MeGo */}
      <BenefitsSection />

      {/* Section 3: Khách sạn và ưu đãi nổi bật */}
      <FeaturedHotelsSection />

      {/* Section 4: MeGo Radar – Bản đồ và khám phá vị trí */}
      <MeGoRadarSection />

      {/* Section 5: Banner Đặc quyền Hội viên MeGo Club */}
      <MeGoClubBanner />

      {/* Section 6.1: Điểm đến nghỉ dưỡng phổ biến */}
      <PopularDestinationsSection />

      {/* Section 6.2: Đánh giá thực tế từ khách hàng */}
      <TestimonialsSection />
    </div>
  );
};

export default GuestHome;
