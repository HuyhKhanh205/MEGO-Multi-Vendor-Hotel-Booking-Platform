import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../stores/store";
import { ChevronRight } from "../../../../components/common/Icons";

// ─── Config (dễ cập nhật khi chính sách thay đổi) ────────────────────────────
const CLUB_CONFIG = {
  discountPercent: 15,
  badge: "ĐẶC QUYỀN HỘI VIÊN MEGO CLUB",
  title: "Đăng ký thành viên MeGo Club – Nhận ngay giảm 15%",
  description:
    "Giảm ngay 15% cho lần đặt đầu tiên. Nâng hạng VIP, miễn phí check-in sớm.",
  perks: ["Giảm thêm tới 15%", "Nhận phòng sớm miễn phí", "Hỗ trợ VIP 24/7"],
  registerPath: "/register",
  loginPath: "/login",
  policyPath: "/policies/mego-club",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const MeGoClubBanner: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleActivate = () => {
    if (isAuthenticated) {
      // Người dùng đã đăng nhập → trang quản lý thành viên / quyền lợi
      navigate("/my-bookings");
    } else {
      navigate(CLUB_CONFIG.registerPath);
    }
  };

  return (
    <section
      aria-label="Đặc quyền Hội viên MeGo Club"
      className="py-6 sm:py-8 transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0039B3] via-[#1055D4] to-[#0099A8] shadow-lg">
          {/* ── Decorative light blobs ── */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Centre glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-white/8 blur-3xl" />
            {/* Top-right accent */}
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-cyan-400/15 blur-2xl" />
            {/* Bottom-left accent */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-blue-200/10 blur-2xl" />
          </div>

          {/* ── Content ── */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-6 sm:px-8 py-6 sm:py-7">
            {/* Left — text */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                <span className="text-amber-300 text-[10px] font-black uppercase tracking-widest leading-none">
                  {CLUB_CONFIG.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold text-white tracking-tight leading-snug max-w-xl">
                {CLUB_CONFIG.title}
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-lg">
                {CLUB_CONFIG.description}
              </p>

              {/* Perks row */}
              <div className="hidden sm:flex flex-wrap items-center gap-3 pt-0.5">
                {CLUB_CONFIG.perks.map((perk) => (
                  <span
                    key={perk}
                    className="inline-flex items-center gap-1.5 text-[11px] text-white/85 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — CTAs */}
            <div className="shrink-0 flex flex-row md:flex-col lg:flex-row gap-2.5">
              {/* Primary button */}
              <button
                type="button"
                onClick={handleActivate}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 active:scale-[0.97] text-[#1055D4] font-bold text-sm shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 whitespace-nowrap"
              >
                <span>
                  {isAuthenticated
                    ? "Xem quyền lợi của tôi"
                    : "Kích hoạt MeGo Club Ngay"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Secondary button */}
              <Link
                to={CLUB_CONFIG.policyPath}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.97] border border-white/25 text-white font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 whitespace-nowrap"
              >
                Xem chính sách quyền lợi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeGoClubBanner;
