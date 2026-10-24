import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking } from "../types/customer.types";
import { formatVnd } from "../utils/formatters";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const id = params.get("bookingId") ?? params.get("vnp_TxnRef") ?? "";

  useEffect(() => {
    if (!id) return;
    let active = true;
    void customerApiMethods.getBooking(id).then((value) => {
      if (!active) return;
      if (value) setBooking(value);
      else setError("Giao dịch không khớp với đơn đặt phòng trong tài khoản.");
    }).catch(() => { if (active) setError("Không thể xác minh giao dịch."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);

  if (loading && id) return <div className="flex min-h-96 items-center justify-center"><CircularProgress aria-label="Đang xác minh giao dịch" /></div>;
  const success = Boolean(booking && booking.status !== "CANCELLED" && booking.paymentStatus === "PAID");
  const pendingTransfer = Boolean(booking && booking.paymentStatus === "PENDING");
  const message = error || (!id ? "Không tìm thấy mã đơn giao dịch." : pendingTransfer ? "Đơn sẽ được xác nhận sau khi hệ thống nhận khoản chuyển." : success ? "Đơn đặt phòng của bạn đã được xác nhận." : "Giao dịch chưa hoàn tất. Bạn có thể thử lại nếu đơn còn hạn giữ chỗ.");
  return <main className="mx-auto max-w-2xl px-4 py-16"><section className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
    {success || pendingTransfer ? <CheckCircleIcon sx={{ fontSize: 64, color: success ? "#10b981" : "#0ea5e9" }} /> : <ErrorIcon sx={{ fontSize: 64, color: "#ef4444" }} />}
    <h1 className="mt-4 text-2xl font-bold">{pendingTransfer ? "Đang chờ xác nhận chuyển khoản" : success ? "Thanh toán thành công" : "Thanh toán chưa thành công"}</h1>
    <p className="mt-2 text-slate-600">{message}</p>
    {booking && <div className="my-6 rounded-xl bg-slate-50 p-4 text-left text-sm"><p>Mã đặt phòng: <b>{booking.bookingCode}</b></p><p className="mt-1">{booking.hotelName} / {booking.roomName}</p><p className="mt-1">Tổng tiền: <b>{formatVnd(booking.total)}</b></p></div>}
    <div className="flex flex-wrap justify-center gap-3"><Button component={Link} to={booking ? `/customer/bookings/${booking.id}` : "/customer/bookings"} variant="contained">Xem đơn đặt phòng</Button>{!success && !pendingTransfer && booking?.holdUntil && Date.parse(booking.holdUntil) > now && <Button component={Link} to={`/customer/payment/${booking.id}`} variant="outlined">Thử thanh toán lại</Button>}<Button component={Link} to="/" color="inherit">Về trang chủ</Button></div>
  </section></main>;
}
