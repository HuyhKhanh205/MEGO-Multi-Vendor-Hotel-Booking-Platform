import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import BookingProgress from "../components/BookingProgress";
import { formatCurrency } from "../components/bookingFormatters";
import customerData from "../data/dataCustomer.json";
import { readBookingCheckoutSession } from "../services/bookingSession";

const PaymentResult = () => {
  const navigate = useNavigate();
  const booking = customerData.booking;
  const result = customerData.paymentResult;
  const checkoutSession = readBookingCheckoutSession();
  const contact = checkoutSession?.contact ?? booking.contact;
  const checkIn = checkoutSession?.checkIn ?? booking.checkIn;
  const checkOut = checkoutSession?.checkOut ?? booking.checkOut;
  const specialRequests = checkoutSession?.specialRequests ?? booking.specialRequests;
  const promotionDiscount = checkoutSession?.promotionDiscount ?? booking.price.promotion.discountAmount;
  const pointsDiscount = checkoutSession?.pointsDiscount ?? booking.price.pointsDiscount.discountAmount;
  const total = checkoutSession?.total ?? booking.price.totalAmount;
  const paymentOption = customerData.paymentOptions.find((option) => option.id === checkoutSession?.paymentMethodId);

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#17233c]">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <BookingProgress activeStep={3} />
        <section className="rounded-xl bg-gradient-to-br from-[#f5f8ff] via-white to-[#edf4ff] px-5 py-10 text-center shadow-sm">
          <CheckCircleIcon className="text-[#1677ff]" sx={{ fontSize: 58 }} />
          <h1 className="mt-3 text-2xl font-bold text-[#26344f]">Đặt phòng thành công!</h1>
          <p className="mx-auto mt-2 max-w-xl text-xs text-[#71809c]">{result.emailMessage}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-[#dff7f1] px-3 py-2 text-[10px] font-semibold text-[#008f7b]">✓ {result.statusLabel}</span>
            <button type="button" className="rounded-full bg-[#e5efff] px-3 py-2 text-[10px] font-semibold text-[#1677ff]"><ContentCopyIcon sx={{ fontSize: 12 }} /> Sao chép mã đặt phòng</button>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between border-b border-[#edf0f6] pb-4">
              <div><p className="text-[10px] font-bold text-[#1677ff]">THẺ LƯU TRÚ ĐIỆN TỬ · MEGO FAST CHECK-IN</p><p className="mt-1 text-[10px] text-[#8a95a9]">Mã đặt phòng: {result.bookingCode}</p></div>
              <span className="rounded bg-[#eef3ff] px-2 py-1 text-[9px] font-semibold text-[#536da5]">{booking.numberOfRooms} PHÒNG · {booking.numberOfNights} ĐÊM</span>
            </div>
            <div className="mt-4 flex gap-4">
              <img className="h-24 w-32 rounded-lg object-cover" src={booking.room.hotelImageUrl} alt={booking.room.hotelName} />
              <div><p className="text-[10px] font-semibold text-[#8a95a9]">★ {booking.room.hotelRating.toFixed(1)} {booking.room.hotelName}</p><h2 className="mt-1 text-lg font-bold text-[#29344e]">{booking.room.roomName}</h2><p className="mt-1 text-[10px] text-[#71809c]">{booking.room.hotelAddress}</p></div>
            </div>
            <div className="mt-5 grid gap-3 rounded-lg bg-[#eef3ff] p-4 text-xs sm:grid-cols-2">
              <div><p className="text-[9px] font-bold text-[#8a95a9]">NHẬN PHÒNG (CHECK-IN)</p><strong className="text-base">{checkIn}</strong><p className="text-[10px]">14:00 · {contact.fullName}</p></div>
              <div><p className="text-[9px] font-bold text-[#8a95a9]">TRẢ PHÒNG (CHECK-OUT)</p><strong className="text-base">{checkOut}</strong><p className="text-[10px]">12:00 · {booking.numberOfGuests} khách</p></div>
            </div>
            <div className="mt-4 rounded-lg border border-[#e4eaf5] p-4 text-xs text-[#596780]"><strong>Yêu cầu đặc biệt đã ghi nhận:</strong><p className="mt-2">{specialRequests.join(", ") || "Không có yêu cầu đặc biệt."}</p></div>
            <div className="mt-4 flex items-center gap-4 rounded-lg bg-[#f4f7ff] p-4"><QrCode2Icon sx={{ fontSize: 76 }} className="text-[#26344f]" /><div><strong className="text-xs text-[#1677ff]">MÃ NHẬN PHÒNG NHANH (FAST CHECK-IN)</strong><p className="mt-1 text-[10px] text-[#71809c]">Mã của bạn: {result.checkInCode}. Xuất trình mã này tại quầy lễ tân để nhận phòng.</p></div></div>
          </section>

          <aside className="h-fit rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><h2 className="text-xs font-bold text-[#3b4964]">CHI TIẾT THANH TOÁN</h2><span className="rounded bg-[#dff7f1] px-2 py-1 text-[9px] font-semibold text-[#008f7b]">✓ Đã thanh toán</span></div>
            <div className="mt-4 space-y-3 border-b border-[#edf0f6] pb-4 text-xs text-[#68748d]">
              <div className="flex justify-between"><span>Giá gốc</span><span>{formatCurrency(booking.price.originalSubtotal)}đ</span></div>
              {promotionDiscount > 0 && <div className="flex justify-between text-[#ed4d65]"><span>Ưu đãi {checkoutSession?.promotionCode ?? booking.price.promotion.code}</span><span>-{formatCurrency(promotionDiscount)}đ</span></div>}
              {pointsDiscount > 0 && <div className="flex justify-between text-[#00a389]"><span>Điểm MeGo Club ({booking.price.pointsDiscount.pointsUsed} pts)</span><span>-{formatCurrency(pointsDiscount)}đ</span></div>}
            </div>
            <div className="flex items-end justify-between py-4"><strong className="text-[10px] text-[#788399]">TỔNG TIỀN ĐÃ THANH TOÁN</strong><strong className="text-xl text-[#1677ff]">{formatCurrency(total)}<small className="ml-1 text-xs">VND</small></strong></div>
            <div className="rounded-lg bg-[#eef3ff] p-3 text-[10px] text-[#53617d]">Phương thức: <strong>{paymentOption?.name ?? result.paymentMethod}</strong><br />Mã giao dịch: <strong>{result.bookingCode}</strong></div>
            <div className="mt-3 rounded-lg bg-[#eafaf6] p-3 text-[10px] text-[#3b7770]">Bạn đã được ghi nhận <strong>{result.pointsEarned} MeGo Points</strong> cho lần đặt phòng này.</div>
            <button type="button" onClick={() => navigate("/customer")} className="mt-4 w-full rounded-lg bg-[#1677ff] py-3 text-xs font-bold text-white">Về trang chủ</button>
            <p className="mt-5 text-center text-[10px] text-[#8490a7]">Hỗ trợ đặt phòng: {result.supportPhone}</p>
          </aside>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-white p-4 shadow-sm">
          <button type="button" className="rounded-lg bg-[#eef3ff] px-3 py-2 text-[10px] font-semibold text-[#1677ff]">Tải xuống Voucher PDF</button>
          <button type="button" className="rounded-lg bg-[#f3f5fb] px-3 py-2 text-[10px] font-semibold text-[#53617d]">Gửi lại qua Email</button>
          <button type="button" className="rounded-lg bg-[#1677ff] px-3 py-2 text-[10px] font-semibold text-white">Quản lý chuyến đi (Xem/Đổi chi tiết)</button>
          <span className="ml-auto text-[10px] text-[#71809c]">Hỗ trợ 24/7: {result.supportPhone}</span>
        </div>
      </main>
    </div>
  );
};

export default PaymentResult;
