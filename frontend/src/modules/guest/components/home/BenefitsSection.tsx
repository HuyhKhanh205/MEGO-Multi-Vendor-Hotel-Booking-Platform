import React from "react";
import { BENEFITS_DATA } from "../../data/homeData";

export const BenefitsSection: React.FC = () => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "tag":
        return (
          <svg className="w-6 h-6 text-[#1677FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-6 h-6 text-[#00A389]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "refresh":
        return (
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "shield":
      default:
        return (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

  return (
    <section aria-label="Lợi ích nổi bật của MeGo" className="py-12 sm:py-16" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Vì sao chọn đặt phòng tại <span className="text-[#1677FF]">MeGo</span>?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Trải nghiệm đặt phòng trực tiếp thông minh, an toàn và tiết kiệm nhất cho chuyến đi của bạn.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS_DATA.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white rounded-3xl p-6 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {renderIcon(benefit.iconName)}
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#1677FF] transition-colors">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {benefit.badge && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#1677FF] bg-blue-50/80 px-2.5 py-0.5 rounded-full">
                    {benefit.badge}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
