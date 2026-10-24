import { useState, useEffect } from "react";
import {
  X,
  User,
  Phone,
  Mail,
} from "../../../../components/common/Icons";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../stores/store";
import type { HotelRoom, BookingGuestInfo } from "../../../../types/hotel";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  room: HotelRoom | null;
  quantity: number;
  checkIn: string;
  checkOut: string;
  nightsCount: number;
  guestsCount: number;
}

export const BookingModal = ({
  isOpen,
  onClose,
  hotelName,
  room,
  quantity,
  checkIn,
  checkOut,
  nightsCount,
  guestsCount,
}: BookingModalProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [guestInfo, setGuestInfo] = useState<BookingGuestInfo>({
    fullName: user?.name || "",
    phoneNumber: "",
    email: user?.email || "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !room) return null;

  const totalPrice = room.pricePerNight * nightsCount * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!guestInfo.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên người nhận phòng!");
      return;
    }
    if (!guestInfo.phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ!");
      return;
    }
    if (!guestInfo.email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email nhận thông tin đặt phòng!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast.success(
        `Chúc mừng ${guestInfo.fullName}! Yêu cầu đặt phòng ${room.name} (${quantity} phòng) tại ${hotelName} đã được tiếp nhận thành công. Mã xác nhận đã gửi đến ${guestInfo.email}.`
      );
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <span className="text-[11px] font-bold text-[#1677FF] uppercase tracking-wider block">
              Xác nhận thông tin đặt phòng
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate max-w-xs sm:max-w-md">
              {room.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Reservation Summary Card */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Khách sạn:</span>
              <span className="font-bold text-slate-900 text-right">{hotelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hạng phòng:</span>
              <span className="font-bold text-slate-900 text-right">{room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số lượng phòng:</span>
              <span className="font-bold text-slate-900">{quantity} phòng</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Thời gian:</span>
              <span className="font-bold text-slate-900">
                {checkIn} → {checkOut} ({nightsCount} đêm)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Số khách lưu trú:</span>
              <span className="font-bold text-slate-900">{guestsCount} khách</span>
            </div>
            <div className="pt-2 border-t border-blue-200/60 flex justify-between items-baseline">
              <span className="font-bold text-slate-800 text-sm">Tổng cộng thanh toán:</span>
              <span className="text-lg font-extrabold text-[#1677FF]">
                {totalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Guest Information Form */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Thông tin người nhận phòng
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên người đại diện *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={guestInfo.fullName}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, fullName: e.target.value })
                  }
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại di động *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={guestInfo.phoneNumber}
                    onChange={(e) =>
                      setGuestInfo({
                        ...guestInfo,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="0912 345 678"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email nhận xác nhận *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={guestInfo.email}
                    onChange={(e) =>
                      setGuestInfo({ ...guestInfo, email: e.target.value })
                    }
                    placeholder="tenban@email.com"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Yêu cầu đặc biệt (tùy chọn)
              </label>
              <textarea
                rows={2}
                value={guestInfo.specialRequests}
                onChange={(e) =>
                  setGuestInfo({
                    ...guestInfo,
                    specialRequests: e.target.value,
                  })
                }
                placeholder="Ví dụ: Tầng cao, phòng không hút thuốc, nhận phòng muộn..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1677FF]/20 focus:border-[#1677FF]"
              />
            </div>
          </div>

          {/* Demo Note */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            <span className="font-bold">Lưu ý mô phỏng:</span> Đây là giao diện
            demo trải nghiệm đặt phòng MeGo. Hệ thống sẽ tiếp nhận thông tin và
            hiển thị thông báo xác nhận mà không trừ tiền thẻ thật.
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
