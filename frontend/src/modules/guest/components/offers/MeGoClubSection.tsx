import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../stores/store";
import { Sparkles, Award, ShieldCheck, ChevronRight, Check } from "../../../../components/common/Icons";

export const MeGoClubSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleJoinOrManage = () => {
    if (isAuthenticated) {
      navigate("/my-bookings");
    } else {
      navigate("/register");
    }
  };

  return (
    <section
      aria-labelledby="mego-club-heading"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0039B3] to-[#0F62FE] text-white p-6 sm:p-10 shadow-xl"
    >
      {/* Decorative ambient elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Perks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-black tracking-widest text-amber-300 uppercase">
              MEGO CLUB — ĐẶC QUYỀN HỘI VIÊN
            </span>
          </div>

          <h2
            id="mego-club-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight"
          >
            Nâng tầm kỳ nghỉ cùng MeGo Club
          </h2>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-xl">
            Khám phá quyền lợi thành viên, ưu đãi lưu trú và các đặc quyền theo
            hạng hội viên trên toàn bộ hệ thống đối tác MeGo.
          </p>

          {/* Key club perks list */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-blue-50">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-300" />
              </span>
              <span>
                <strong>Giá thành viên:</strong> Tiết kiệm thêm 10% - 15% tại khách sạn áp dụng
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-300" />
              </span>
              <span>
                <strong>Tích lũy điểm thưởng:</strong> Đổi voucher ưu đãi cho chuyến đi tiếp theo
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-300" />
              </span>
              <span>
                <strong>Ưu tiên nhận phòng:</strong> Hỗ trợ check-in sớm / check-out trễ linh hoạt
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-300" />
              </span>
              <span>
                <strong>Chăm sóc đặc quyền:</strong> Kênh tổng đài tư vấn ưu tiên 24/7
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleJoinOrManage}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#0039B3] bg-white hover:bg-blue-50 active:scale-95 transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{isAuthenticated ? "Xem thông tin hội viên" : "Tham gia MeGo Club"}</span>
              <ChevronRight className="w-4 h-4 text-[#0039B3]" />
            </button>

            <Link
              to="/policies/mego-club"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Khám phá quyền lợi</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Card Display */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black shadow-md">
                  <Award className="w-5 h-5 text-amber-900" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Thẻ Hội Viên MeGo</h3>
                  <p className="text-[11px] text-blue-200">
                    {isAuthenticated ? (user?.name || "Thành viên MeGo") : "Tài khoản khách"}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/30">
                {isAuthenticated ? "Thành viên" : "Đăng ký nhận ưu đãi"}
              </span>
            </div>

            <div className="py-4 space-y-2 text-xs text-blue-100/90">
              <div className="flex justify-between py-1">
                <span className="text-blue-200">Trạng thái tài khoản:</span>
                <span className="font-semibold text-white">
                  {isAuthenticated ? "Đã kích hoạt" : "Chưa kích hoạt"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-blue-200">Ưu đãi phòng nghỉ:</span>
                <span className="font-semibold text-emerald-300">Tự động áp dụng khi đăng nhập</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-blue-200">Bảo mật thông tin:</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  Được mã hóa SSL
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/15 text-center">
              <p className="text-[11px] text-blue-200/80">
                * Mức giảm và tích điểm thực tế sẽ được cập nhật đồng bộ theo từng đặt phòng thành công.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeGoClubSection;
