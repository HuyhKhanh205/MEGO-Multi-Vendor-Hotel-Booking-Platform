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
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}>
      {/* Section 1: Hero Banner & Thanh tìm kiếm khách sạn */}
      <HeroSection />

      {/* Section 2: Các lợi ích nổi bật của MeGo */}
      <BenefitsSection />

      {/* Section 3: Banner Đặc quyền Hội viên MeGo Club */}
      <MeGoClubBanner />

      {/* Section 4: Điểm đến hàng đầu Việt Nam */}
      <PopularDestinationsSection />

      {/* Section 5: Khách sạn và ưu đãi nổi bật */}
      <FeaturedHotelsSection />

      {/* Section 6: MeGo Radar – Bản đồ và khám phá vị trí */}
      <MeGoRadarSection />

      {/* Section 7: Đánh giá thực tế từ khách hàng */}
      <TestimonialsSection />
    </div>
  );
};

export default GuestHome;
