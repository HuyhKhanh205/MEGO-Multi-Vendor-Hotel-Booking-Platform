import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../stores/store";
import { MEGO_CLUB_REDEEM_OPTIONS } from "./offersData";
import type { MeGoClubRedeemOption } from "./types";

export const MeGoClubLoyaltySection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Available points (demo default 2450 points, or stateful)
  const [availablePoints, setAvailablePoints] = useState<number>(2450);
  const [selectedOption, setSelectedOption] = useState<MeGoClubRedeemOption>(
    MEGO_CLUB_REDEEM_OPTIONS[1]
  );
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleRedeem = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thực hiện đổi điểm MeGo Points!");
      navigate("/login");
      return;
    }

    if (availablePoints < selectedOption.pointsRequired) {
      toast.error(
        `Số điểm hiện tại (${availablePoints} Points) không đủ để đổi voucher này (cần ${selectedOption.pointsRequired} Points).`
      );
      return;
    }

    setIsRedeeming(true);
    setTimeout(() => {
      setAvailablePoints((prev) => prev - selectedOption.pointsRequired);
      setIsRedeeming(false);
      setIsSuccess(true);
      toast.success(
        `Chúc mừng! Bạn đã đổi thành công ${selectedOption.pointsRequired} Points thành ${selectedOption.voucherLabel}. Mã đã được lưu vào ví.`
      );

      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    }, 800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-14 w-full">
      <div className="relative rounded-3xl bg-gradient-to-br from-inverse-surface via-inverse-surface to-on-background text-inverse-on-surface p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* ── Left Column: Intro & Benefits ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">stars</span>
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary-fixed">
                Chương trình Khách hàng Thân thiết
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Nâng tầm trải nghiệm với Đặc quyền Hội viên{" "}
              <span className="text-tertiary-fixed">MeGo Club</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-inverse-on-surface/80 max-w-xl leading-relaxed">
              Tích lũy 10% giá trị phòng thành MeGo Points sau mỗi chuyến đi. Sử dụng điểm thưởng để đổi trực tiếp sang voucher giảm giá hoặc đổi phòng miễn phí.
            </p>

            {/* 3 Key VIP Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                <span className="material-symbols-outlined text-[24px] text-tertiary-fixed">savings</span>
                <p className="text-sm font-bold text-white">Tích điểm 10%</p>
                <p className="text-xs text-inverse-on-surface/70 leading-relaxed">
                  Hoàn xu điểm vào ví tích lũy ngay sau khi check-out.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                <span className="material-symbols-outlined text-[24px] text-tertiary-fixed">upgrade</span>
                <p className="text-sm font-bold text-white">Nâng hạng phòng</p>
                <p className="text-xs text-inverse-on-surface/70 leading-relaxed">
                  Miễn phí nâng lên hạng Deluxe / Ocean khi còn phòng trống.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                <span className="material-symbols-outlined text-[24px] text-tertiary-fixed">more_time</span>
                <p className="text-sm font-bold text-white">Check-in sớm 2H</p>
                <p className="text-xs text-inverse-on-surface/70 leading-relaxed">
                  Ưu tiên nhận phòng sớm hoặc trả phòng trễ đến 14:00.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Column: Loyalty Conversion Card ── */}
          <div className="lg:col-span-5 bg-surface-container-lowest text-on-surface p-5 sm:p-6 rounded-2xl shadow-xl space-y-5">
            {/* User points status */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">loyalty</span>
                </div>
                <div>
                  <p className="text-[11px] text-on-surface-variant uppercase font-bold">
                    {isAuthenticated ? `Xin chào, ${user?.name || "Hội viên"}` : "Điểm khả dụng của bạn"}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-primary">
                    {new Intl.NumberFormat("vi-VN").format(availablePoints)}{" "}
                    <span className="text-xs font-normal text-on-surface">MeGo Points</span>
                  </p>
                </div>
              </div>

              <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                Hạng Gold VIP
              </span>
            </div>

            {/* Select Conversion Options */}
            <div className="space-y-3">
              <label className="block text-xs uppercase font-bold text-on-surface-variant">
                Chọn mức quy đổi voucher tiền mặt
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {MEGO_CLUB_REDEEM_OPTIONS.map((opt) => {
                  const isSelected = selectedOption.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-surface-container-high ring-2 ring-primary"
                          : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? "text-primary" : "text-on-surface"}`}>
                        {opt.voucherLabel}
                      </span>
                      <span className="text-xs text-tertiary font-semibold mt-1">
                        {new Intl.NumberFormat("vi-VN").format(opt.pointsRequired)} Points
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
              <span>
                Mã voucher sau khi đổi sẽ được tự động lưu vào ví và áp dụng trừ trực tiếp ở bước thanh toán cuối cùng.
              </span>
            </div>

            {/* Redeem Action Button */}
            <button
              type="button"
              disabled={isRedeeming}
              onClick={handleRedeem}
              className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                isSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-primary hover:bg-surface-tint text-on-primary active:scale-98"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRedeeming ? "hourglass_empty" : isSuccess ? "check" : "currency_exchange"}
              </span>
              <span>
                {isRedeeming
                  ? "Đang xử lý đổi điểm..."
                  : isSuccess
                  ? "Đổi Điểm Thành Công!"
                  : `Đổi Điểm Lấy ${selectedOption.voucherLabel}`}
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MeGoClubLoyaltySection;
