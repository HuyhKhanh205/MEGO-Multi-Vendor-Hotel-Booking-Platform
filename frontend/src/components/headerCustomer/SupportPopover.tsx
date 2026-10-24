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
        className="relative p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer
          text-gray-600 hover:text-blue-600 hover:bg-gray-100/70
          dark:text-[var(--icon-default)] dark:hover:text-[var(--brand-primary)] dark:hover:bg-[var(--bg-surface-hover)]"
      >
        <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 18v-6a9 9 0 0118 0v6" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
        </svg>

        {/* Blue badge */}
        <span
          aria-label="3 nhân viên trực tuyến"
          className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-[#1677FF] text-white text-[10.5px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[var(--header-bg)]"
        >
          {SUPPORT_INFO.onlineStaff}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl shadow-xl border p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{
            backgroundColor: "var(--popover-bg)",
            borderColor: "var(--popover-border)",
          }}
        >
          <div
            className="flex items-center justify-between pb-3 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div>
              <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Trung tâm trợ giúp
              </h4>
              <p className="text-[11.5px] text-green-600 font-medium flex items-center gap-1.5 mt-0.5 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse dark:bg-green-400" />
                {SUPPORT_INFO.onlineStaff} nhân viên đang trực tuyến
              </p>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-[#1677FF] dark:text-[var(--brand-primary)]"
              style={{ backgroundColor: "var(--brand-primary-bg)" }}
            >
              24/7
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            <a
              href={`tel:${SUPPORT_INFO.hotline.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors group"
              style={{ hover: { backgroundColor: "var(--bg-muted)" } } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[#1677FF] transition-colors group-hover:bg-blue-600 group-hover:text-white dark:text-[var(--brand-primary)] dark:group-hover:bg-[var(--brand-primary)] dark:group-hover:text-white"
                style={{ backgroundColor: "var(--brand-primary-bg)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-medium" style={{ color: "var(--text-muted)" }}>
                  Hotline tư vấn
                </p>
                <p
                  className="text-[13px] font-bold group-hover:text-[#1677FF] transition-colors dark:group-hover:text-[var(--brand-primary)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SUPPORT_INFO.hotline}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${SUPPORT_INFO.email}`}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors group"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-muted)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors dark:bg-indigo-900/30 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] font-medium" style={{ color: "var(--text-muted)" }}>
                  Hòm thư hỗ trợ
                </p>
                <p
                  className="text-[13px] font-bold truncate group-hover:text-[#1677FF] transition-colors dark:group-hover:text-[var(--brand-primary)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SUPPORT_INFO.email}
                </p>
              </div>
            </a>
          </div>

          <div
            className="mt-3 pt-2.5 border-t"
            style={{ borderColor: "var(--border-light)" }}
          >
            <Link
              to="/support"
              onClick={() => setIsOpen(false)}
              className="block w-full py-1.5 text-center text-[12.5px] font-semibold rounded-lg transition-colors
                text-[#1677FF] hover:text-blue-700 hover:bg-blue-50/50
                dark:text-[var(--brand-primary)] dark:hover:bg-[var(--brand-primary-bg)]"
            >
              Xem trang Câu hỏi thường gặp &amp; Trợ giúp &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPopover;
