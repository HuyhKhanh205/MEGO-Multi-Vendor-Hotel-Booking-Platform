import React from "react";
import { TESTIMONIALS_DATA } from "../../data/homeData";

export const TestimonialsSection: React.FC = () => {
  return (
    <section aria-label="Đánh giá từ khách hàng" className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            ★ Trải nghiệm thực tế
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Khách hàng nói gì về <span className="text-[#1677FF]">MeGo</span>?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Hơn 50.000+ du khách đã lựa chọn và đồng hành cùng MeGo trên mọi hành trình.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50/70 rounded-3xl p-6 border border-gray-100 hover:border-blue-100 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {item.avatarText}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.author}
                  </h4>
                  <p className="text-[10.5px] text-gray-400 truncate">
                    {item.location} • Đã lưu trú tại {item.stayedAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
