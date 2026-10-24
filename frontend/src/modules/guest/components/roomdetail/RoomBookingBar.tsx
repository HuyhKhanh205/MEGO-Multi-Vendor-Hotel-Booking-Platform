import React from "react";
import { ChevronRight } from "../../../../components/common/Icons";

interface RoomBookingBarProps {
  originalPrice?: number;
  pricePerNight: number;
  availableRooms: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onBookNow: () => void;
}

export const RoomBookingBar: React.FC<RoomBookingBarProps> = ({
  originalPrice,
  pricePerNight,
  availableRooms,
  quantity,
  onQuantityChange,
  onBookNow,
}) => {
  const discountPercent =
    originalPrice && originalPrice > pricePerNight
      ? Math.round(((originalPrice - pricePerNight) / originalPrice) * 100)
      : 0;

  const totalPrice = pricePerNight * quantity;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Pricing Details */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
          <div>
            <div className="flex items-center gap-2">
              {originalPrice && originalPrice > pricePerNight && (
                <span className="text-xs text-slate-400 line-through">
                  {originalPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200">
                  -{discountPercent}% Ưu đãi
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#1677FF] tracking-tight">
                {pricePerNight.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-xs text-slate-500 font-medium">/ đêm</span>
            </div>

            <p className="text-[11px] text-slate-400">
              Đã bao gồm thuế, phí dịch vụ & bữa sáng
            </p>
          </div>

          {/* Quick Quantity Counter (Desktop) */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Số phòng:</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= availableRooms}
                onClick={() =>
                  onQuantityChange(Math.min(availableRooms, quantity + 1))
                }
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-slate-400">
              (Còn {availableRooms} phòng)
            </span>
          </div>
        </div>

        {/* Right: Booking Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Total for quantity if > 1 */}
          {quantity > 1 && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block font-medium">
                Tổng cho {quantity} phòng
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {totalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onBookNow}
            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Đặt phòng ngay</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingBar;