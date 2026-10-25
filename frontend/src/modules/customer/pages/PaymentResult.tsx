import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking } from "../types/customer.types";
import BookingProgress from "../components/BookingProgress";
import { formatDate, formatVnd } from "../utils/formatters";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const id = params.get("bookingId") ?? params.get("vnp_TxnRef") ?? "";
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [loading, setLoading] = useState(() => Boolean(id));
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!id) return;
    let active = true;
    void customerApiMethods
      .getBooking(id)
      .then((value) => {
        if (!active) return;
        if (value) setBooking(value);
        else setError("Giao dịch không khớp với đơn đặt phòng trong tài khoản.");
      })
      .catch(() => {
        if (active) setError("Không thể xác minh giao dịch.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <CircularProgress aria-label="Đang xác minh giao dịch" />
      </div>
    );
  }

  const success = Boolean(
    booking &&
      booking.status !== "CANCELLED" &&
      booking.paymentStatus === "PAID",
  );
  const pendingTransfer = Boolean(
    booking && booking.paymentStatus === "PENDING",
  );

  if (!booking || (!success && !pendingTransfer)) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <ErrorIcon sx={{ fontSize: 64, color: "#ef4444" }} />
          <h1 className="mt-4 text-2xl font-bold">Thanh toán chưa thành công</h1>
          <p className="mt-2 text-slate-600">
            {error || "Giao dịch chưa hoàn tất."}
          </p>
          <ResultActions booking={booking} now={now} />
        </section>
      </main>
    );
  }

  const roomTotal =
    booking.pricePerNight * booking.numberOfNights * booking.numberOfRooms;
  const paymentLabel =
    booking.paymentMethod === "Chưa chọn"
      ? "Cổng VNPAY"
      : booking.paymentMethod;

  return (
    <main className="min-h-screen bg-[#f7f8fd] px-3 py-4 text-[#17233c] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <BookingProgress activeStep={3} />
        <section className="rounded-xl bg-white px-4 py-7 text-center shadow-sm sm:px-8">
          <CheckCircleIcon sx={{ fontSize: 64, color: "#1677ff" }} />
          <h1 className="mt-3 text-2xl font-extrabold text-[#17233c]">
            {pendingTransfer ? "Đang chờ xác nhận thanh toán" : "Đặt phòng thành công!"}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            {pendingTransfer
              ? "Don dat phong dang cho xac nhan thanh toan. Ma dat phong cua ban la "
              : "Cam on ban da dat phong tai MeGo. Ma dat phong cua ban la "}
            <strong className="rounded bg-[#eaf2ff] px-2 py-1 text-[#1677ff]">
              {booking.bookingCode}
            </strong>
            {pendingTransfer ? "." : ". Email xac nhan da duoc gui den "}
            {!pendingTransfer && <strong>{booking.contactEmail}</strong>}
            {!pendingTransfer && "."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="rounded-full bg-[#e7f8f2] px-3 py-1 font-semibold text-[#008f7b]">
              {pendingTransfer
                ? `Dang cho thanh toan qua ${paymentLabel}`
                : `Da xac nhan thanh toan qua ${paymentLabel}`}
            </span>
            <span className="rounded-full bg-[#eaf2ff] px-3 py-1 font-semibold text-[#31527f]">
              Mã {booking.bookingCode}
            </span>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section className="overflow-hidden rounded-xl border border-[#e5eaf5] bg-white shadow-sm">
            <div className="border-t-4 border-[#1677ff] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between text-[11px] font-semibold uppercase text-[#1677ff]">
              <span>▣ Thẻ lưu trú điện tử (E-voucher) · MeGo Fast Check-in</span>
              <span className="rounded bg-slate-100 px-2 py-1 text-slate-500">
                {booking.numberOfRooms} phòng · {booking.numberOfNights} đêm
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-[112px_1fr]">
              <img
                src={booking.hotelImageUrl}
                alt={booking.hotelName}
                className="h-24 w-full rounded-lg object-cover sm:h-28"
              />
              <div>
                <h2 className="text-lg font-extrabold">{booking.hotelName}</h2>
                <p className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                  <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />
                  {booking.hotelAddress}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
                  {booking.contactPhone}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 rounded-xl bg-[#eef3ff] p-4 text-xs sm:grid-cols-2">
              <Info label="NHẬN PHÒNG (CHECK-IN)" value={formatDate(booking.checkIn)} />
              <Info label="TRẢ PHÒNG (CHECK-OUT)" value={formatDate(booking.checkOut)} />
              <Info label="NGƯỜI ĐẶT" value={booking.contactName} />
              <Info label="KHÁCH Ở CÙNG" value={booking.guestName} />
              <div className="sm:col-span-2">
                <Info label="HẠNG PHÒNG ĐĂNG KÝ" value={booking.roomName} />
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="rounded bg-white px-2 py-1">✓ Đã bao gồm tiện nghi phòng</span>
                  <span className="rounded bg-white px-2 py-1">✓ {booking.cancellationPolicy}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-xl bg-[#eef3ff] p-4">
              <QrCode2OutlinedIcon sx={{ fontSize: 76, color: "#17233c" }} />
              <div className="text-xs text-slate-600">
                <strong className="text-[#1677ff]">Mã nhận phòng nhanh (Fast Check-in)</strong>
                <p className="mt-1">
                  Xuất trình mã này tại quầy để nhận phòng nhanh chóng.
                </p>
                <b className="mt-1 block text-slate-800">Mã: {booking.bookingCode}</b>
              </div>
            </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8edf6] bg-white px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => downloadBookingCode(booking)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1677ff] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#0d63dc]"
              >
                <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
                Tải mã đặt phòng
              </button>
              <div className="flex flex-wrap gap-2">
                <Button
                  component={Link}
                  to={`/customer/bookings/${booking.id}`}
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#1677ff",
                    px: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#0d63dc" },
                  }}
                >
                  Xem đơn đặt phòng
                </Button>
                <Button
                  component={Link}
                  to="/"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    borderColor: "#d8e1f2",
                    color: "#52617d",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#1677ff",
                      color: "#1677ff",
                    },
                  }}
                >
                  Về trang chủ
                </Button>
              </div>
            </div>
          </section>

          <aside className="h-fit overflow-hidden rounded-xl border border-[#e5eaf5] bg-white shadow-sm">
            <div className="border-t-4 border-[#1677ff] px-4 pb-4 pt-3 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xs font-extrabold tracking-wide text-[#26344f]">
                  CHI TIẾT THANH TOÁN
                </h2>
                <span className="shrink-0 rounded-full bg-[#e3f8f1] px-2 py-1 text-[9px] font-bold text-[#008f7b]">
                  {pendingTransfer ? "Dang cho thanh toan" : "Da quyet toan"}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <PaymentLine
                  label={`Giá gốc (${booking.numberOfNights} đêm)`}
                  value={roomTotal}
                />
                <PaymentLine
                  label="Thuế GTGT (VAT 8%) & phí phục vụ"
                  value={booking.taxes}
                />
                {booking.discount > 0 && (
                  <PaymentLine
                    label="Mã ưu đãi MeGo"
                    value={-booking.discount}
                  />
                )}
              </div>
            </div>
            <div className="mx-4 rounded-xl border border-[#e4eaf6] bg-[#f7f9ff] p-4 sm:mx-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-500">
                  {pendingTransfer ? "TONG TIEN CAN THANH TOAN" : "TONG TIEN DA THANH TOAN"}
                </span>
                <span className="rounded bg-white px-2 py-1 text-[9px] font-bold text-[#1677ff]">
                  VND
                </span>
              </div>
              <strong className="mt-1 block text-2xl font-extrabold tracking-tight text-[#1677ff]">
                {formatVnd(booking.total)}
              </strong>
              <div className="mt-3 flex items-start gap-2 border-t border-[#e4eaf6] pt-3 text-[10px] text-slate-600">
                <CreditCardOutlinedIcon sx={{ fontSize: 14, color: "#008f7b" }} />
                <span>
                  Phương thức: <b>{paymentLabel}</b>
                  <br />
                  Mã giao dịch: <b>{booking.bookingCode}</b>
                </span>
              </div>
            </div>
            {!pendingTransfer && (
            <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl bg-[#eaf2ff] p-3 text-[10px] text-[#31527f] sm:mx-5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white font-bold text-[#1677ff]">
                +
              </span>
              <span>
                <b>+{Math.floor(booking.total / 10000)} MeGo Points</b> đã được ghi
                nhận vào ví hội viên VIP của bạn.
              </span>
            </div>
            )}
            <div className="mx-4 mt-3 rounded-xl bg-[#fbfcff] p-3 text-[10px] text-slate-600 sm:mx-5">
              <div className="flex items-center gap-1 font-bold text-[#52617d]">
                <HelpOutlineOutlinedIcon sx={{ fontSize: 14, color: "#1677ff" }} />
                ĐIỀU KHOẢN & HƯỚNG DẪN
              </div>
              <p className="mt-2">
                <b>Miễn phí hủy phòng</b> trước 14:00 ngày{" "}
                {formatDate(booking.checkIn)}. Sau thời điểm này sẽ tính phí theo
                chính sách.
              </p>
              <p className="mt-2">
                Thực hiện check-in bằng giấy tờ tùy thân trùng khớp tên khách lưu trú.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#eef1f7] px-4 py-3 text-[10px] text-slate-500 sm:px-5">
              <span className="flex items-center gap-1">
                <HeadsetMicOutlinedIcon sx={{ fontSize: 14 }} />
                Hỗ trợ nhận phòng tại quầy
              </span>
              <a className="font-bold text-[#1677ff]" href="tel:+842363847333">
                (+84) 236 3847 333
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold text-slate-500">{label}</span>
      <strong className="mt-1 block text-sm text-[#26344f]">{value}</strong>
    </div>
  );
}

function PaymentLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-start justify-between gap-3 text-[11px] text-slate-600">
      <span className="max-w-[68%] leading-snug">{label}</span>
      <span className={`whitespace-nowrap font-semibold ${value < 0 ? "text-[#008f7b]" : "text-[#26344f]"}`}>
        {formatVnd(value)}
      </span>
    </div>
  );
}

function downloadBookingCode(booking: CustomerBooking) {
  const content = [
    "MEGO - MA DAT PHONG",
    `Ma dat phong: ${booking.bookingCode}`,
    `Khach san: ${booking.hotelName}`,
    `Hang phong: ${booking.roomName}`,
    `Nhan phong: ${formatDate(booking.checkIn)}`,
    `Tra phong: ${formatDate(booking.checkOut)}`,
    `Tong tien: ${formatVnd(booking.total)}`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `mego-${booking.bookingCode}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function ResultActions({
  booking,
  now,
}: {
  booking: CustomerBooking | null;
  now: number;
}) {
  const canRetry = Boolean(
    booking?.holdUntil && Date.parse(booking.holdUntil) > now,
  );
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Button
        component={Link}
        to={booking ? `/customer/bookings/${booking.id}` : "/customer/bookings"}
        variant="contained"
      >
        Xem đơn đặt phòng
      </Button>
      {canRetry && booking && (
        <Button component={Link} to={`/customer/payment/${booking.id}`} variant="outlined">
          Thử thanh toán lại
        </Button>
      )}
      <Button component={Link} to="/" color="inherit">Về trang chủ</Button>
    </div>
  );
}
