import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BookingProgress from "../components/BookingProgress";
import { formatCurrency } from "../components/bookingFormatters";
import customerData from "../data/dataCustomer.json";
import { readBookingCheckoutSession, saveBookingCheckoutSession } from "../services/bookingSession";

const holdExpiryStorageKey = `mego-booking-hold-expiry-${customerData.booking.id}`;

const Payment = () => {
  const navigate = useNavigate();
  const booking = customerData.booking;
  const paymentResult = customerData.paymentResult;
  const paymentPage = customerData.paymentPage;
  const checkoutSession = readBookingCheckoutSession();
  const [selectedMethod, setSelectedMethod] = useState(checkoutSession?.paymentMethodId ?? customerData.paymentOptions[0].id);
  const checkoutContact = checkoutSession?.contact ?? booking.contact;
  const checkoutCheckIn = checkoutSession?.checkIn ?? booking.checkIn;
  const checkoutCheckOut = checkoutSession?.checkOut ?? booking.checkOut;
  const checkoutPromotionDiscount = checkoutSession?.promotionDiscount ?? booking.price.promotion.discountAmount;
  const checkoutPointsDiscount = checkoutSession?.pointsDiscount ?? booking.price.pointsDiscount.discountAmount;
  const checkoutTotal = checkoutSession?.total ?? booking.price.totalAmount;
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const expiry = Number(window.sessionStorage.getItem(holdExpiryStorageKey));
    return Number.isFinite(expiry) ? Math.max(Math.ceil((expiry - Date.now()) / 1000), 0) : 0;
  });
  const total = checkoutTotal;
  const selectedOption = customerData.paymentOptions.find((option) => option.id === selectedMethod);
  const isExpired = remainingSeconds === 0;
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  useEffect(() => {
    if (isExpired) return;

    const timer = window.setInterval(() => {
      const expiry = Number(window.sessionStorage.getItem(holdExpiryStorageKey));
      setRemainingSeconds(Number.isFinite(expiry) ? Math.max(Math.ceil((expiry - Date.now()) / 1000), 0) : 0);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isExpired]);

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#17233c]">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <BookingProgress activeStep={2} />
        <div className="mb-5 flex items-center justify-between rounded-xl bg-[#eaf2ff] px-4 py-3 text-xs text-[#31527f]">
          <strong>Giữ đơn đặt phòng trong {minutes}:{seconds}</strong>
          <span className="hidden sm:block">Đơn vị: {paymentPage.currency}</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <p className="mb-1 text-[10px] font-semibold uppercase text-[#1677ff]">Bước cuối cùng</p>
              <h1 className="text-xl font-bold text-[#26344f]">Chọn phương thức thanh toán an toàn</h1>
              <p className="mt-1 text-xs text-[#8490a7]">Thanh toán bảo mật, xác nhận đặt phòng ngay lập tức.</p>
            </div>

            {customerData.paymentOptions.filter((option) => option.enabled).map((option) => {
              const active = option.id === selectedMethod;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedMethod(option.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${active ? "border-[#9bbfff] bg-[#eef3ff] shadow-sm" : "border-transparent bg-white shadow-[0_3px_15px_rgba(30,60,120,0.06)]"}`}
                >
                  <div className="flex items-start gap-3">
                    {active ? <CheckCircleIcon className="text-[#1677ff]" /> : <RadioButtonUncheckedIcon className="text-[#aeb8ca]" />}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm text-[#35425d]">{option.name}</strong>
                        <span className="rounded bg-white px-2 py-1 text-[9px] font-semibold text-[#1677ff]">{option.badge}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-[#8792a7]">{option.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#5371a8]">{option.provider}</span>
                  </div>
                  {active && option.id === "international-card" && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="text-[10px] font-semibold text-[#596780] sm:col-span-2">Số thẻ in trên thẻ<input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-3 text-xs font-normal outline-none ring-1 ring-[#e4eaf5]" placeholder="4111 ···· ···· 1234" /></label>
                      <label className="text-[10px] font-semibold text-[#596780] sm:col-span-2">Tên in trên thẻ<input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-3 text-xs font-normal outline-none ring-1 ring-[#e4eaf5]" placeholder={checkoutContact.fullName} /></label>
                      <label className="text-[10px] font-semibold text-[#596780]">Hạn sử dụng<input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-3 text-xs font-normal outline-none ring-1 ring-[#e4eaf5]" placeholder="MM / YY" /></label>
                      <label className="text-[10px] font-semibold text-[#596780]">Mã bảo mật CVV/CVC<input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-3 text-xs font-normal outline-none ring-1 ring-[#e4eaf5]" placeholder="3 chữ số" /></label>
                      <p className="text-[10px] text-[#71809c] sm:col-span-2">✓ {paymentPage.cardSaveNote}</p>
                    </div>
                  )}
                  {active && option.id !== "international-card" && (
                    <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[10px] text-[#53617d]">ⓘ {option.instruction}</p>
                  )}
                </button>
              );
            })}
          </section>

          <aside className="h-fit rounded-xl bg-white p-4 shadow-[0_5px_18px_rgba(30,60,120,0.1)] lg:sticky lg:top-24">
            <div className="mb-4 flex gap-3 border-b border-[#edf0f6] pb-4">
              <img className="h-20 w-24 rounded-lg object-cover" src={booking.room.hotelImageUrl} alt={booking.room.hotelName} />
              <div>
                <p className="text-[10px] font-semibold text-[#9c7413]">★ {booking.room.hotelRating.toFixed(1)} Luxury</p>
                <h2 className="mt-1 text-sm font-bold text-[#29344e]">{booking.room.hotelName}</h2>
                <p className="mt-1 text-[9px] text-[#9ba3b4]">{booking.room.hotelAddress}</p>
              </div>
            </div>
            <div className="rounded-lg bg-[#eef3ff] p-3 text-xs text-[#52617d]">
              <div className="flex justify-between"><strong>{booking.room.roomName}</strong><span>{booking.numberOfGuests} khách</span></div>
              <p className="mt-2 text-[10px]">{checkoutCheckIn} - {checkoutCheckOut} · {booking.numberOfNights} đêm · {booking.numberOfRooms} phòng</p>
              <p className="mt-2 text-[10px]">✓ 1 giường {booking.room.bedType} · ✓ {booking.room.amenities.slice(0, 2).join(" · ")}</p>
              <p className="mt-1 text-[10px] text-[#00a389]">✓ {booking.room.description}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-[#e4eaf5] p-3 text-[10px] text-[#68748d]">
              <div><strong className="block text-[9px] text-[#8d97aa]">NHẬN PHÒNG</strong><span>{checkoutCheckIn} · 14:00</span></div>
              <div><strong className="block text-[9px] text-[#8d97aa]">TRẢ PHÒNG</strong><span>{checkoutCheckOut} · 12:00</span></div>
              <div className="col-span-2"><strong className="block text-[9px] text-[#8d97aa]">KHÁCH LƯU TRÚ</strong><span>{checkoutContact.fullName} · {checkoutContact.phone}</span></div>
            </div>
            <div className="space-y-2 border-b border-[#edf0f6] py-4 text-xs text-[#68748d]">
              <div className="flex justify-between"><span>Giá phòng</span><span>{formatCurrency(booking.price.roomSubtotal)}đ</span></div>
              <div className="flex justify-between"><span>Phí dịch vụ & VAT</span><span>{formatCurrency(booking.price.serviceFee + booking.price.vat)}đ</span></div>
              {checkoutPromotionDiscount > 0 && <div className="flex justify-between text-[#ed4d65]"><span>Mã ưu đãi</span><span>-{formatCurrency(checkoutPromotionDiscount)}đ</span></div>}
              {checkoutPointsDiscount > 0 && <div className="flex justify-between text-[#00a389]"><span>MeGo Points</span><span>-{formatCurrency(checkoutPointsDiscount)}đ</span></div>}
            </div>
            <div className="flex items-end justify-between py-4"><strong className="text-[10px] text-[#788399]">TỔNG TIỀN THANH TOÁN</strong><strong className="text-xl text-[#1677ff]">{formatCurrency(total)}<small className="ml-1 text-xs">VND</small></strong></div>
            <button type="button" disabled={isExpired} onClick={() => {
              if (checkoutSession) {
                saveBookingCheckoutSession({ ...checkoutSession, paymentMethodId: selectedMethod });
              }
              navigate("/customer/payment-result");
            }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677ff] py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#aeb8ca]">
              <PaymentIcon sx={{ fontSize: 17 }} /> {isExpired ? "Đã hết thời gian giữ phòng" : "Xác nhận & Thanh toán"}
            </button>
            <p className="mt-3 flex justify-center gap-1 text-[10px] text-[#8a95a9]"><LockOutlinedIcon sx={{ fontSize: 12 }} /> Thanh toán an toàn và bảo mật</p>
            <p className="mt-2 text-center text-[10px] text-[#7e8ba2]">Phương thức: {selectedOption?.name}</p>
            <div className="mt-3 rounded-lg bg-[#f4f7ff] p-3 text-[10px] text-[#68748d]">
              <strong className="text-[#53617d]">Điều kiện & hướng dẫn</strong>
              <p className="mt-1">✓ {booking.room.cancellationPolicy}</p>
              <p className="mt-1">✓ {paymentPage.securityNote}</p>
              <p className="mt-1">✓ {paymentPage.supportNote}</p>
            </div>
          </aside>
        </div>
        <p className="mt-5 text-center text-[10px] text-[#8490a7]">Mã xác nhận thanh toán sẽ được gửi qua {paymentResult.emailMessage.split("đến ")[1]?.replace(".", "") ?? booking.contact.email}</p>
      </main>
    </div>
  );
};

export default Payment;
