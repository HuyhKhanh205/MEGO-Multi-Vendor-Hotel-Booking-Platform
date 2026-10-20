import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SUPPORT_INFO } from "./headerData";

interface SupportPopoverProps {
  className?: string;
}

export const SupportPopover: React.FC<SupportPopoverProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Trung tâm hỗ trợ và liên hệ"
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100/70 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        {/* Headset / Customer Support Icon */}
        <svg
          className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M3 18v-6a9 9 0 0118 0v6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"
          />
        </svg>

        {/* Small blue badge with number 3 */}
        <span
          aria-label="3 nhân viên trực tuyến"
          className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-[#1677FF] text-white text-[10.5px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
        >
          {SUPPORT_INFO.onlineStaff}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Trung tâm trợ giúp</h4>
              <p className="text-[11.5px] text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {SUPPORT_INFO.onlineStaff} nhân viên đang trực tuyến
              </p>
            </div>
            <span className="text-[10px] bg-blue-50 text-[#1677FF] px-2 py-0.5 rounded-full font-semibold">
              24/7
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            <a
              href={`tel:${SUPPORT_INFO.hotline.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1677FF] flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] text-gray-400 font-medium">Hotline tư vấn</p>
                <p className="text-[13px] font-bold text-gray-900 group-hover:text-[#1677FF] transition-colors">
                  {SUPPORT_INFO.hotline}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${SUPPORT_INFO.email}`}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] text-gray-400 font-medium">Hòm thư hỗ trợ</p>
                <p className="text-[13px] font-bold text-gray-900 truncate group-hover:text-[#1677FF] transition-colors">
                  {SUPPORT_INFO.email}
                </p>
              </div>
            </a>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100">
            <Link
              to="/support"
              onClick={() => setIsOpen(false)}
              className="block w-full py-1.5 text-center text-[12.5px] text-[#1677FF] hover:text-blue-700 font-semibold hover:bg-blue-50/50 rounded-lg transition-colors"
            >
              Xem trang Câu hỏi thường gặp & Trợ giúp &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPopover;
