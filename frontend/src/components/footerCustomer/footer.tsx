import React from "react";
import FooterBrand from "./FooterBrand";
import FooterLinkColumn from "./FooterLinkColumn";
import FooterPayment from "./FooterPayment";
import FooterBottom from "./FooterBottom";
import {
  SERVICES_DESTINATIONS_DATA,
  POLICIES_ASSURANCE_DATA,
} from "./footerData";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      role="contentinfo"
      aria-label="Chân trang MeGo"
      className={`w-full bg-white border-t border-[#E5E7EB] mt-auto select-text ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9 pb-4">
        {/* Upper 4-Column Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-8 lg:gap-8 pb-7">
          {/* Column 1: Logo & Brand Intro (~38-40%) */}
          <FooterBrand />

          {/* Column 2: Dịch vụ & Điểm đến (~20%) */}
          <FooterLinkColumn data={SERVICES_DESTINATIONS_DATA} />

          {/* Column 3: Chính sách & An tâm (~20%) */}
          <FooterLinkColumn data={POLICIES_ASSURANCE_DATA} />

          {/* Column 4: Cổng thanh toán bảo mật (~20%) */}
          <FooterPayment />
        </div>

        {/* Lower Section: Divider, Copyright & Utility Links */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
