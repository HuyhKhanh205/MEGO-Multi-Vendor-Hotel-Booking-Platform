import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking, CustomerData } from "../types/customer.types";
import type { RoomSelection } from "../types/customer.types";
import { MOCK_HOTELS } from "../../../data/hotels";
import BookingSummary from "../components/BookingSummary";
import BookingHoldTimer from "../components/BookingHoldTimer";
import { useBookingHold } from "../components/useBookingHold";

type Method =
  | "VNPay"
  | "Thẻ Quốc tế (Credit / Debit Card)"
  | "Ví điện tử (MoMo / ZaloPay)"
  | "Thanh toán tại khách sạn";
export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [data, setData] = useState<CustomerData | null>(null);
  const [method, setMethod] = useState<Method>(
    "Thẻ Quốc tế (Credit / Debit Card)",
  );
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { expired } = useBookingHold(booking?.holdUntil ?? null);
  useEffect(() => {
    if (!bookingId) return;
    let active = true;
    void Promise.all([
      customerApiMethods.getBooking(bookingId),
      customerApiMethods.getData(),
    ])
      .then(([item, fullData]) => {
        if (!active) return;
        if (!item) setError("Không tìm thấy đơn đặt phòng.");
        else {
          setBooking(item);
          setData(fullData);
        }
      })
      .catch(() => {
        if (active) setError("Không thể tải thông tin thanh toán.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [bookingId]);
  const settle = async (success: boolean) => {
    if (!booking || busy) return;
    setBusy(true);
    setError("");
    try {
      if (success) await customerApiMethods.confirmPayment(booking.id, method);
      navigate(
        `/customer/payment-result?status=${success ? "success" : "failed"}&bookingCode=${encodeURIComponent(booking.bookingCode)}&bookingId=${encodeURIComponent(booking.id)}&vnp_ResponseCode=${success ? "00" : "24"}`,
        { replace: true },
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Không thể xử lý thanh toán.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (loading)
    return (
      <div className="flex min-h-96 items-center justify-center">
        <CircularProgress aria-label="Đang tải thanh toán" />
      </div>
    );
  if (!booking || !data)
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy đơn</h1>
        <p className="my-3 text-slate-600">{error}</p>
        <Button component={Link} to="/customer/bookings">
          Đến danh sách đơn
        </Button>
      </main>
    );
  const hotelPolicy = MOCK_HOTELS.find(
    (hotel) =>
      hotel.id === booking.hotelId ||
      hotel.name === booking.hotelName ||
      booking.hotelName.includes(hotel.name) ||
      hotel.name.includes(booking.hotelName),
  );
  const canPayAtHotel =
    booking.payAtHotel || Boolean(hotelPolicy?.policies.payAtHotel);
  const paymentDisabled =
    method === "Thanh toán tại khách sạn" && !canPayAtHotel;
  return (
    <main className="min-h-screen bg-[#f7f8fd] px-3 py-4 text-[#17233c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-[#16a34a]">
            <CheckIcon sx={{ fontSize: 14 }} />
            1. Thông tin đặt phòng
          </span>
          <span>›</span>
          <span className="rounded-full bg-[#1677ff] px-3 py-1 font-semibold text-white">
            2. Thanh toán bảo mật
          </span>
          <span>›</span>
          <span>3. Kết quả và vé điện tử</span>
        </div>
        <BookingHoldTimer holdUntil={booking.holdUntil} variant="payment" />
        <p className="mb-1 text-[10px] font-semibold uppercase text-[#1677ff]">
          BƯỚC CUỐI CÙNG
        </p>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section>
            <h1 className="mb-4 text-xl font-bold">
              Chọn phương thức thanh toán an toàn
            </h1>
            <div className="space-y-3">
              <PaymentOption
                selected={method === "VNPay"}
                onChange={() => setMethod("VNPay")}
                title="Cổng VNPAY (Quét mã QR / App Ngân hàng)"
                badge="Khuyến mại - Nhanh nhất"
                meta="VNPAY · QR"
              />
              <PaymentOption
                selected={method === "Thẻ Quốc tế (Credit / Debit Card)"}
                onChange={() => setMethod("Thẻ Quốc tế (Credit / Debit Card)")}
                title="Thẻ Quốc tế (Credit / Debit Card)"
                badge="Miễn phí giao dịch quốc tế"
                meta="Chấp nhận Visa, Mastercard, JCB, American Express."
                cardBrands
              />
              {method === "Thẻ Quốc tế (Credit / Debit Card)" && (
                <InternationalCardForm />
              )}
              <PaymentOption
                selected={method === "Ví điện tử (MoMo / ZaloPay)"}
                onChange={() => setMethod("Ví điện tử (MoMo / ZaloPay)")}
                title="Ví điện tử (MoMo / ZaloPay)"
                badge="Tích hợp MeGo Club"
                meta="MoMo · ZaloPay"
              />
              {method === "Ví điện tử (MoMo / ZaloPay)" && (
                <div className="rounded-lg border border-t-0 border-[#dbe4f8] bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">
                  Bạn sẽ được chuyển đến ví điện tử để hoàn tất thanh toán an
                  toàn.
                </div>
              )}
              <PaymentOption
                selected={method === "Thanh toán tại khách sạn"}
                onChange={() => setMethod("Thanh toán tại khách sạn")}
                title="Thanh toán tại khách sạn khi nhận phòng"
                badge={canPayAtHotel ? "Không cần trả trước" : "Không khả dụng"}
                meta="Thanh toán trực tiếp tại quầy lễ tân"
                disabled={!canPayAtHotel}
              />
            </div>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {expired && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                Đơn đã hết thời gian giữ chỗ.
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                disabled={busy || expired || paymentDisabled}
                onClick={() => void settle(true)}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  bgcolor: "#1677ff",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {busy ? "Đang xử lý…" : "Thanh toán ngay"}
              </Button>
              {method === "VNPay" && (
                <Button
                  disabled={busy || expired}
                  color="error"
                  onClick={() => void settle(false)}
                >
                  Mô phỏng thất bại
                </Button>
              )}
            </div>
          </section>
          <BookingSummary
            room={{
              hotelId: booking.hotelId,
              hotelName: booking.hotelName,
              hotelAddress: booking.hotelAddress,
              hotelImageUrl: booking.hotelImageUrl,
              roomTypeId: booking.roomName,
              roomName: booking.roomName,
              pricePerNight: booking.pricePerNight,
              availableRooms: booking.numberOfRooms,
              freeCancellation: booking.cancellationPolicy.includes("Miễn phí"),
              payAtHotel: booking.payAtHotel,
            } satisfies RoomSelection}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            numberOfNights={booking.numberOfNights}
            numberOfRooms={booking.numberOfRooms}
            numberOfGuests={booking.numberOfGuests}
            roomTotal={booking.pricePerNight * booking.numberOfNights * booking.numberOfRooms}
            vat={booking.taxes}
            promotionDiscount={booking.discount}
            pointsDiscount={0}
            total={booking.total}
            agreed
            onAgreeChange={() => undefined}
            formError=""
            onContinue={() => undefined}
            isExpired={expired}
            isSaving={false}
            readOnly
          />
        </div>
      </div>
    </main>
  );
}

function PaymentOption({
  selected,
  onChange,
  title,
  badge,
  meta,
  disabled = false,
  cardBrands = false,
}: {
  selected: boolean;
  onChange: () => void;
  title: string;
  badge: string;
  meta: string;
  disabled?: boolean;
  cardBrands?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 shadow-sm transition ${selected ? "border-[#1677ff] bg-white ring-1 ring-[#1677ff]" : disabled ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60" : "border-transparent bg-white hover:border-[#b8d1ff]"}`}
    >
      <input
        type="radio"
        name="payment"
        checked={selected}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 accent-blue-600"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#33415c]">
          {title}
          <small className="rounded bg-[#dff8f5] px-1.5 py-0.5 text-[9px] font-medium text-[#008f7b]">
            {badge}
          </small>
        </span>
        <small className="mt-1 block text-[10px] text-slate-500">{meta}</small>
      </span>
      {cardBrands && (
        <span className="hidden text-[9px] font-bold text-[#1677ff] sm:block">
          VISA <i className="text-[#ed4d65]">MC</i> JCB
        </span>
      )}
    </label>
  );
}

function InternationalCardForm() {
  return (
    <div className="rounded-xl border border-t-0 border-[#dbe4f8] bg-[#eef1fc] px-4 pb-4 pt-1 text-xs shadow-sm">
      <div className="mt-2 flex items-center justify-between">
        <b>Số thẻ in trên thẻ</b>
        <span className="text-[10px] text-[#008f7b]">♢ Xác thực 3D-Secure</span>
      </div>
      <div className="mt-1 rounded-lg bg-white px-3 py-2 text-slate-400">
        ▣ &nbsp; 4111&nbsp;••••&nbsp;••••&nbsp;1234{" "}
        <span className="float-right text-[9px] font-bold text-[#1677ff]">
          VISA <i className="text-[#ed4d65]">MC</i>
        </span>
      </div>
      <b className="mt-3 block">Tên trên thẻ (Không dấu)</b>
      <div className="mt-1 rounded-lg bg-white px-3 py-2 text-slate-400">
        ♙ &nbsp; NGUYEN VAN AN
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <b>Hạn sử dụng</b>
          <div className="mt-1 rounded-lg bg-white px-3 py-2 text-slate-400">
            ▣ &nbsp; MM/YY
          </div>
        </div>
        <div>
          <b>Mã bảo mật CVV/CVC</b>
          <div className="mt-1 rounded-lg bg-white px-3 py-2 text-slate-400">
            ♙ &nbsp; •••
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-slate-500">
        ■ Lưu thông tin thẻ an toàn cho các ngày nghỉ tiếp theo (chuẩn bảo mật
        mã hóa PCI-DSS Level 1).
      </p>
    </div>
  );
}
