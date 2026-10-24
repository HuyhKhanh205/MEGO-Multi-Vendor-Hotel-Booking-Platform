import {
  Clock,
  CheckCircle2,
  Users,
  ShieldAlert,
  Info,
} from "../../../../components/common/Icons";

interface HotelPoliciesProps {
  checkInTime: string;
  checkOutTime: string;
  payAtHotel: boolean;
  freeCancellation: boolean;
}

export const HotelPolicies = ({
  checkInTime,
  checkOutTime,
  payAtHotel,
  freeCancellation,
}: HotelPoliciesProps) => {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* ── Section Title ── */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Chính sách lưu trú & Quy định chung
        </h2>
        <div className="h-1 w-12 bg-[#1677FF] rounded-full" />
      </div>

      {/* ── Policies Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        {/* Check-in / Check-out */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Clock className="w-4 h-4 text-[#1677FF]" />
            <span>Thời gian nhận & trả phòng</span>
          </div>
          <p className="text-slate-600">
            • Nhận phòng từ: <span className="font-semibold text-slate-900">{checkInTime || "14:00"}</span>
          </p>
          <p className="text-slate-600">
            • Trả phòng trước: <span className="font-semibold text-slate-900">{checkOutTime || "12:00"}</span>
          </p>
          <p className="text-[11px] text-slate-400">
            * Nhận phòng sớm hoặc trả phòng muộn tùy thuộc vào tình trạng phòng sẵn có và có thể áp dụng phụ thu.
          </p>
        </div>

        {/* Cancellation & Payment */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hủy phòng & Thanh toán</span>
          </div>
          <p className="text-slate-600">
            {freeCancellation
              ? "• Miễn phí hủy phòng trước 24 giờ so với ngày nhận phòng."
              : "• Chính sách hủy phòng có tính phí tùy thuộc vào từng loại phòng."}
          </p>
          <p className="text-slate-600">
            {payAtHotel
              ? "• Hỗ trợ thanh toán trực tiếp tại khách sạn bằng tiền mặt hoặc thẻ."
              : "• Yêu cầu thanh toán trước trực tuyến an toàn qua hệ thống MeGo."}
          </p>
        </div>

        {/* Children & Extra Bed */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Trẻ em & Giường phụ</span>
          </div>
          <p className="text-slate-600">
            • Trẻ em dưới 6 tuổi được ở miễn phí khi sử dụng giường có sẵn.
          </p>
          <p className="text-slate-600">
            • Trẻ từ 6–11 tuổi có phụ thu bữa sáng buffet tại quầy lễ tân.
          </p>
          <p className="text-slate-600">
            • Khách từ 12 tuổi trở lên tính phí như người lớn nếu kê giường phụ.
          </p>
        </div>

        {/* Other Rules */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Quy định chung tại khách sạn</span>
          </div>
          <p className="text-slate-600">
            • Không hút thuốc lá trong khuôn viên phòng nghỉ (có khu vực hút thuốc riêng).
          </p>
          <p className="text-slate-600">
            • Vui lòng không mang theo thú cưng vào khu vực lưu trú.
          </p>
          <p className="text-slate-600">
            • Xuất trình Căn cước công dân hoặc Hộ chiếu khi làm thủ tục nhận phòng.
          </p>
        </div>
      </div>

      {/* Accepted Payment Logos Note */}
      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="font-semibold text-blue-900 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#1677FF]" />
          Phương thức thanh toán chấp nhận: Visa, MasterCard, JCB, QR Napas 247, MoMo, ZaloPay
        </span>
        <span className="text-[11px] text-slate-500 font-medium">Bảo mật mã hóa SSL 256-bit</span>
      </div>
    </section>
  );
};
