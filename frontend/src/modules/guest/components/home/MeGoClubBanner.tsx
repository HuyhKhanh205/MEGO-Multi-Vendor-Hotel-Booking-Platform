import React from "react";
import { Link } from "react-router-dom";

export const MeGoClubBanner: React.FC = () => {
  return (
    <section aria-label="Đặc quyền Hội viên MeGo Club" className="py-10 sm:py-14 bg-[#F9F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004CCD] via-[#0f62d4] to-[#00A389] p-8 sm:p-12 text-white shadow-xl">
          {/* Subtle Decorative Circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
            {/* Left Content */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
                <span>👑</span>
                <span>Đặc quyền Hội viên MeGo Club</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Gia nhập MeGo Club — Mở khóa giá phòng bí mật &amp; tích điểm từng kỳ nghỉ
              </h2>

              <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
                Đăng ký thành viên hoàn toàn miễn phí. Nhận ngay voucher giảm thêm 15% cho đơn đầu tiên, tích điểm đổi đêm nghỉ và ưu tiên nâng hạng phòng tại các resort đối tác.
              </p>

              {/* Perks Highlights */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Giảm thêm tới 15%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Nhận phòng sớm miễn phí
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Hỗ trợ VIP 24/7
                </span>
              </div>
            </div>

            {/* Right CTA */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95 text-center cursor-pointer"
              >
                Đăng ký thành viên ngay
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition-all text-center border border-white/20"
              >
                Đã có tài khoản? Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeGoClubBanner;
