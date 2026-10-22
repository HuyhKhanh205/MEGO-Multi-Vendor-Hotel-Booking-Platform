import React from "react";
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  Award,
} from "../../../../components/common/Icons";

export const LoginHero: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] rounded-3xl overflow-hidden flex flex-col justify-between p-7 sm:p-9 lg:p-10 select-none">
      {/* Background Image with Deep Luxury Gradient Overlay */}
      <img
        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85"
        alt="MeGo Luxury Resort & Hotel"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40" />

      {/* ── Top Badges ── */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-sm">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>50,000+ Khách sạn & Resort cao cấp</span>
        </span>

        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-sm">
          Ưu đãi mùa hè 2026
        </span>
      </div>

      {/* ── Middle Narrative & Benefits ── */}
      <div className="relative z-10 space-y-4 my-auto py-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-[#1677FF]/80 backdrop-blur-md text-white border border-blue-400/30">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>MEGO CLUB • ĐẶC QUYỀN HỘI VIÊN</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
          Chào mừng trở lại! Tiếp tục hành trình kỳ nghỉ trong mơ cùng MeGo.
        </h2>

        <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-lg">
          Đăng nhập ngay để kích hoạt mức giá thành viên độc quyền, tích lũy điểm MeGo Club cho mỗi đêm nghỉ và nhận hỗ trợ ưu tiên 24/7.
        </p>

        {/* 2 Key Benefit Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Bảo đảm giá tốt nhất</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
            <Clock className="w-4 h-4 text-blue-300 shrink-0" />
            <span>Hỗ trợ 24/7 tức thì</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Floating Rating Card ── */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-15 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md">
            MeGo
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
              ))}
              <span className="text-white text-xs font-extrabold ml-1">4.9 / 5.0</span>
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5">
              Hơn 500,000+ du khách tin tưởng đặt phòng
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/80 text-white border border-emerald-400/30">
          Xác thực 100%
        </span>
      </div>
    </div>
  );
};

export default LoginHero;