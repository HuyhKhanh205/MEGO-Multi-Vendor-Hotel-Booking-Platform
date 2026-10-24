import React from "react";
import {
  Sparkles,
  Tag,
  Star,
  Clock,
  Shield,
  Award,
} from "../../../../components/common/Icons";

export const RegisterHero: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[640px] lg:min-h-[720px] rounded-3xl overflow-hidden flex flex-col justify-between p-7 sm:p-9 lg:p-10 select-none">
      {/* Background Luxury Hotel Image with Rich Gradient Overlay */}
      <img
        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=85"
        alt="MeGo Club Luxury Privilege"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-blue-950/50" />

      {/* ── Top Brand Header & Reward Badge ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/25 shadow-sm">
          <span className="text-xl font-black text-white">MeGo</span>
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Tặng ngay 500 MeGo Points khi đăng ký</span>
        </span>
      </div>

      {/* ── Middle Narrative & 3 Privilege Cards ── */}
      <div className="relative z-10 space-y-4 my-auto py-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider  text-white border border-blue-400/30">
          <Award className="w-3 h-3 text-amber-300" />
          <span>THÀNH VIÊN MEGO CLUB</span>
        </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
        <h2 >
          Gia nhập MeGo Club. 
        </h2>
        <h2>
           Mở khóa kỳ nghỉ đặc quyền.
        </h2>
      </div>
        

        {/* 3 Privileges Cards Stack */}
        <div className="space-y-3 pt-2">
          {/* Card 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-300/30">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Giảm đến 15%
              </h4>
              <p className="text-[11.5px] text-slate-200 mt-0.5 leading-relaxed">
                Giá ưu đãi đặc quyền dành riêng cho thành viên trên 50.000+ khách sạn & resort đối tác.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Tích lũy & đổi điểm linh hoạt
              </h4>
              <p className="text-[11.5px] text-slate-200 mt-0.5 leading-relaxed">
                Tích lũy MeGo Points sau mỗi đêm lưu trú để trừ trực tiếp tiền mặt hoặc nâng hạng phòng.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-300/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Đặc quyền check-in & Nâng hạng
              </h4>
              <p className="text-[11.5px] text-slate-200 mt-0.5 leading-relaxed">
                Ưu tiên check-in sớm, trả phòng trễ và cơ hội nhận nâng hạng phòng theo điều kiện áp dụng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Security & Rating Card ── */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/80 text-white flex items-center justify-center shrink-0 shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Bảo mật chuẩn quốc tế SSL</span>
              <div className="flex items-center text-amber-300 gap-0.5 ml-1">
                <Star className="w-3 h-3 fill-amber-300" />
                <span className="text-white text-xs font-bold">4.9/5</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5">
              Thông tin của bạn được mã hóa an toàn 256-bit
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/20 text-white">
          500,000+ Hội viên
        </span>
      </div>
    </div>
  );
};

export default RegisterHero;