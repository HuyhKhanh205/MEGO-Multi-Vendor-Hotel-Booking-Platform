import React from "react";
import { Link } from "react-router-dom";
import { BOTTOM_UTILITY_LINKS } from "./footerData";

interface FooterBottomProps {
  className?: string;
  year?: number;
}

export const FooterBottom: React.FC<FooterBottomProps> = ({
  className = "",
  year = new Date().getFullYear(),
}) => {
  return (
    <div
      className={`border-t border-[#E5E7EB] pt-4 sm:pt-5 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] sm:text-[11.5px] text-[#64748B] ${className}`}
    >
      {/* Left: Copyright */}
      <div className="text-center md:text-left select-none">
        <span>
          &copy; {year} MeGo Hospitality Corp. Toàn bộ bản quyền được bảo lưu.
        </span>
      </div>

      {/* Right: Utility Links */}
      <nav aria-label="Liên kết tiện ích chân trang">
        <ul className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {BOTTOM_UTILITY_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className="hover:text-[#1677FF] transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FooterBottom;
