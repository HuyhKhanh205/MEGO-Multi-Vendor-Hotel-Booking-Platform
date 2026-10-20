import React from "react";
import { Link } from "react-router-dom";
import { BRAND_DATA } from "./footerData";

interface FooterBrandProps {
  className?: string;
}

export const FooterBrand: React.FC<FooterBrandProps> = ({ className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Brand Logo */}
      <Link
        to="/"
        aria-label="MeGo - Về trang chủ"
        className="inline-flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-0.5"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1677FF] to-[#4096ff] text-white shadow-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
            aria-hidden="true"
          >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9h1" />
            <path d="M9 13h1" />
            <path d="M9 17h1" />
            <path d="M15 13h1" />
            <path d="M15 17h1" />
          </svg>
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-extrabold tracking-tight text-[#1677FF] leading-none">
            Me
          </span>
          <span className="text-xl font-black tracking-tight text-gray-900 leading-none">
            Go
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] ml-0.5" aria-hidden="true" />
        </div>
      </Link>

      {/* Brand Description */}
      <p className="text-[12.5px] leading-relaxed text-[#64748B] max-w-sm">
        {BRAND_DATA.description}
      </p>

      {/* Hotline Section */}
      <div className="pt-1 space-y-1.5">
        <h3 className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-gray-500">
          {BRAND_DATA.hotlineTitle}
        </h3>

        <a
          href={`tel:${BRAND_DATA.hotlineTel}`}
          aria-label={`Hotline hỗ trợ: ${BRAND_DATA.hotline}`}
          className="inline-flex items-center gap-2 text-[#1677FF] hover:text-blue-700 font-bold text-sm sm:text-[15px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          {/* Phone / Headset Icon */}
          <svg
            className="w-4 h-4 text-[#1677FF] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="tracking-wide">{BRAND_DATA.hotline}</span>
        </a>
      </div>
    </div>
  );
};

export default FooterBrand;
