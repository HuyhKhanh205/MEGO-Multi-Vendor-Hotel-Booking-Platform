import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HERO_FLASH_SALE } from "./offersData";

interface OffersHeroProps {
  destination: string;
  onDestinationChange: (dest: string) => void;
  dealType: string;
  onDealTypeChange: (type: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const OffersHero: React.FC<OffersHeroProps> = ({
  destination,
  onDestinationChange,
  dealType,
  onDealTypeChange,
  onSearchSubmit,
}) => {
  // ── Flash Sale Countdown Timer (8h 34m 12s initial demo) ────────────────
  const [totalSeconds, setTotalSeconds] = useState<number>(8 * 3600 + 34 * 60 + 12);
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);

  useEffect(() => {
    if (totalSeconds <= 0) return;

    const timer = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalSeconds]);

  const isExpired = totalSeconds <= 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padZero = (n: number) => String(n).padStart(2, "0");

  const handleCopyCode = async () => {
    const code = HERO_FLASH_SALE.couponCode;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedCoupon(true);
      toast.success(`Đã sao chép mã: ${code}`);
      setTimeout(() => setCopiedCoupon(false), 2000);
    } catch {
      toast.error(`Không thể sao chép tự động. Vui lòng ghi lại mã: ${code}`);
    }
  };

  const showcase = HERO_FLASH_SALE.showcase;

  return (
    <section className="relative w-full bg-surface-container-low overflow-hidden pt-6 sm:pt-8 pb-12 sm:pb-16 rounded-b-3xl">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ── Left Column: Intro & Voucher Box ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live event pill */}
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest shadow-xs px-3.5 py-1.5 rounded-full">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
              </span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {HERO_FLASH_SALE.badge}
              </span>
            </div>

            {/* Campaign Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface leading-[1.15] tracking-tight">
              {HERO_FLASH_SALE.title.replace("MeGo", "")}
              <span className="text-primary tracking-tight">MeGo</span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-secondary mt-1.5">
                {HERO_FLASH_SALE.subtitle}
              </span>
            </h1>

            {/* Campaign Description */}
            <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              {HERO_FLASH_SALE.description}
            </p>

            {/* Countdown Flash Timer */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">timer</span>
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-on-surface-variant">
                    Flash Sale kết thúc sau
                  </p>
                  <p className={`text-xs sm:text-sm font-bold ${isExpired ? "text-slate-500" : "text-error"}`}>
                    {isExpired ? "Chương trình đã kết thúc" : "Đang áp dụng giá sốc trong ngày"}
                  </p>
                </div>
              </div>

              {/* Timer Blocks */}
              <div className="flex items-center gap-2" aria-label="Bộ đếm thời gian Flash Sale">
                <div className="flex flex-col items-center">
                  <div className="w-12 sm:w-14 h-11 sm:h-12 bg-on-background text-surface-container-lowest rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-inner">
                    {padZero(hours)}
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-1 font-semibold">Giờ</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-on-surface mb-4">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-12 sm:w-14 h-11 sm:h-12 bg-on-background text-surface-container-lowest rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-inner">
                    {padZero(minutes)}
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-1 font-semibold">Phút</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-on-surface mb-4">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-12 sm:w-14 h-11 sm:h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shadow-inner">
                    {padZero(seconds)}
                  </div>
                  <span className="text-[11px] text-primary mt-1 font-semibold">Giây</span>
                </div>
              </div>
            </div>

            {/* Hero Coupon Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-lowest shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">redeem</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-tertiary">
                      {HERO_FLASH_SALE.couponBadge}
                    </span>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {HERO_FLASH_SALE.couponStatus}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-black text-on-surface mt-0.5 tracking-wider font-mono">
                    {HERO_FLASH_SALE.couponCode}
                  </p>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    {HERO_FLASH_SALE.couponDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="shrink-0 px-5 py-3 rounded-xl bg-primary hover:bg-surface-tint active:scale-95 text-on-primary text-xs sm:text-sm font-bold transition-all shadow-[0_4px_12px_rgba(15,98,254,0.25)] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedCoupon ? "done" : "content_copy"}
                </span>
                <span>{copiedCoupon ? "Đã chép!" : "Sao chép mã"}</span>
              </button>
            </div>
          </div>

          {/* ── Right Column: Hero Visual Showcase Bento ── */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest">
              <div
                className="bg-cover bg-center w-full h-[380px] sm:h-[440px] flex flex-col justify-between p-5 sm:p-6"
                style={{ backgroundImage: `url('${showcase.imageUrl}')` }}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-current">star</span>
                    {showcase.badge}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-error text-on-error text-xs font-bold shadow-md">
                    {showcase.discountBadge}
                  </span>
                </div>

                {/* Bottom Glass Card Overlay */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      {showcase.roomType}
                    </span>
                    <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface text-xs font-bold">
                      <span>{showcase.rating}</span>
                      <span className="text-tertiary">{showcase.ratingText}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-on-surface line-clamp-1 hover:text-primary transition-colors">
                    <Link to={`/hotels/${showcase.hotelId}`}>
                      {showcase.hotelName}
                    </Link>
                  </h3>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs sm:text-sm text-outline line-through mr-2">
                        {new Intl.NumberFormat("vi-VN").format(showcase.originalPrice)}đ
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-primary">
                        {new Intl.NumberFormat("vi-VN").format(showcase.pricePerNight)}đ
                      </span>
                      <span className="text-xs text-on-surface-variant">/đêm</span>
                    </div>

                    <span className="text-xs text-tertiary font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[16px]">free_cancellation</span>
                      {showcase.policyText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Quick Search Bar inside Hero ── */}
        <div className="mt-10 sm:mt-12 bg-surface-container-lowest rounded-2xl shadow-xl p-4 md:p-5">
          <form
            onSubmit={onSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Destination Field */}
            <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant">
                  Tìm ưu đãi theo nơi đến
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => onDestinationChange(e.target.value)}
                  placeholder="Nhập thành phố, resort, đảo..."
                  className="w-full bg-transparent text-sm font-semibold text-on-surface focus:outline-none placeholder:text-outline"
                />
              </div>
            </div>

            {/* Deal Type Field */}
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-tertiary text-[24px]">sell</span>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant">
                  Loại khuyến mãi
                </label>
                <select
                  value={dealType}
                  onChange={(e) => onDealTypeChange(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="all">Tất cả ưu đãi giảm sâu</option>
                  <option value="beach">Resort ven biển (-40%)</option>
                  <option value="early">Early Bird đặt sớm</option>
                  <option value="luxury">Khách sạn 5 sao sang trọng</option>
                </select>
              </div>
            </div>

            {/* Date / Stay Type */}
            <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-secondary text-[24px]">calendar_today</span>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] uppercase font-bold text-on-surface-variant">
                  Thời gian kỳ nghỉ
                </label>
                <div className="text-sm font-semibold text-on-surface truncate">
                  Hè 2026 (Tháng 5 - Tháng 8)
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-3.5 px-6 rounded-xl bg-primary hover:bg-surface-tint active:scale-95 text-on-primary text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
                <span>Tìm Deal</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default OffersHero;
