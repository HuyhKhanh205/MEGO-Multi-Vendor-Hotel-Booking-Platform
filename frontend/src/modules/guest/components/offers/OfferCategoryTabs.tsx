import React, { useRef, useState, useEffect, useCallback } from "react";
import { CATEGORY_TABS } from "./offersData";
import type { OfferCategoryId } from "./types";

interface OfferCategoryTabsProps {
  activeTab: OfferCategoryId;
  onSelectTab: (tabId: OfferCategoryId) => void;
}

export const OfferCategoryTabs: React.FC<OfferCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to display navigation controls and fade indicators
  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [checkScrollState]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -240 : 240;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleTabClick = (tabId: OfferCategoryId, e: React.MouseEvent<HTMLButtonElement>) => {
    onSelectTab(tabId);
    // Auto-scroll clicked tab into view if partially hidden
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  return (
    <nav
      aria-label="Thanh danh mục ưu đãi"
      className="sticky top-[68px] z-30 w-full bg-white/95 backdrop-blur-md shadow-xs py-2.5 sm:py-3 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="relative flex items-center justify-between gap-3 w-full min-w-0">
          
          {/* Scroll Left Button (desktop/tablet when overflow) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Cuộn sang trái"
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 hover:text-primary shadow-md border border-slate-200 items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Left subtle fade gradient indicator */}
          {canScrollLeft && (
            <div
              aria-hidden="true"
              className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"
            />
          )}

          {/* Category Tabs Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={checkScrollState}
            role="tablist"
            className="flex-1 min-w-0 flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth py-1 px-0.5 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={(e) => handleTabClick(tab.id, e)}
                  className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE] ${
                    isActive
                      ? "bg-[#0F62FE] text-white font-bold shadow-sm shadow-blue-500/25"
                      : "bg-[#E7EEFF] hover:bg-[#D8E3FB] text-[#111C2D] hover:text-[#0F62FE] font-semibold"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                      isActive ? "text-white" : "text-[#0F62FE]"
                    }`}
                  >
                    {tab.iconName}
                  </span>
                  <span>{tab.label}</span>
                  {typeof tab.badgeCount === "number" && (
                    <span
                      className={`ml-0.5 text-xs font-bold px-2 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#0F62FE] shadow-xs"
                      }`}
                    >
                      {tab.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right subtle fade gradient indicator */}
          {canScrollRight && (
            <div
              aria-hidden="true"
              className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
            />
          )}

          {/* Scroll Right Button (desktop/tablet when overflow) */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Cuộn sang phải"
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 hover:text-primary shadow-md border border-slate-200 items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

         
        </div>
      </div>
    </nav>
  );
};

export default OfferCategoryTabs;
