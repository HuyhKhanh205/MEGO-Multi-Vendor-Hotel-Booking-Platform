import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking, CustomerData } from "../types/customer.types";
import { formatDate, formatVnd } from "../utils/formatters";

type Method = "VNPay" | "Chuyển khoản ngân hàng" | "Thanh toán tại khách sạn";
export default function Payment() {
  const { bookingId } = useParams(); const navigate = useNavigate();
  const [booking, setBooking] = useState<CustomerBooking | null>(null); const [data, setData] = useState<CustomerData | null>(null);
  const [method, setMethod] = useState<Method>("VNPay"); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [now, setNow] = useState(() => Date.now());
  useEffect(() => { if (!bookingId) return; let active = true; void Promise.all([customerApiMethods.getBooking(bookingId), customerApiMethods.getData()]).then(([item, fullData]) => { if (!active) return; if (!item) setError("Không tìm thấy đơn đặt phòng."); else { setBooking(item); setData(fullData); } }).catch(() => { if (active) setError("Không thể tải thông tin thanh toán."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [bookingId]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const expired = Boolean(booking?.holdUntil && Date.parse(booking.holdUntil) <= now);
  const settle = async (success: boolean) => {
    if (!booking || busy) return; setBusy(true); setError("");
    try {
      if (success) await customerApiMethods.confirmPayment(booking.id, method);
      navigate(`/customer/payment-result?status=${success ? "success" : "failed"}&bookingCode=${encodeURIComponent(booking.bookingCode)}&bookingId=${encodeURIComponent(booking.id)}&vnp_ResponseCode=${success ? "00" : "24"}`, { replace: true });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Không thể xử lý thanh toán."); }
    finally { setBusy(false); }
  };
  if (loading) return <div className="flex min-h-96 items-center justify-center"><CircularProgress aria-label="Đang tải thanh toán"/></div>;
  if (!booking || !data) return <main className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-2xl font-bold">Không tìm thấy đơn</h1><p className="my-3 text-slate-600">{error}</p><Button component={Link} to="/customer/bookings">Đến danh sách đơn</Button></main>;
  return <main className="mx-auto max-w-5xl px-4 py-8 text-slate-800 sm:px-6"><p className="text-xs text-slate-500">Trang chủ / Đặt phòng / Thanh toán</p><h1 className="mb-6 mt-3 text-3xl font-bold">Phương thức thanh toán</h1>
    <div className="grid gap-5 lg:grid-cols-[1fr_350px]"><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><h2 className="text-lg font-bold">Chọn phương thức</h2><div className="mt-4 space-y-3">{(["VNPay", "Chuyển khoản ngân hàng", "Thanh toán tại khách sạn"] as Method[]).map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${method === option ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}><input type="radio" name="payment" checked={method === option} disabled={option === "Thanh toán tại khách sạn" && !booking.payAtHotel} onChange={() => setMethod(option)} className="accent-blue-600"/><span className="font-semibold">{option}</span>{option === "Thanh toán tại khách sạn" && !booking.payAtHotel && <span className="ml-auto text-xs text-slate-500">Không khả dụng</span>}</label>)}</div>
      {method === "VNPay" && <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center"><div className="mx-auto grid h-40 w-40 place-items-center border-4 border-dashed border-blue-200 bg-white text-sm font-bold text-blue-700">VNPay QR<br/>Demo</div><p className="mt-3 text-sm text-slate-600">Quét mã QR bằng ứng dụng ngân hàng hoặc ví VNPay.</p></div>}
      {method === "Chuyển khoản ngân hàng" && <div className="mt-5 rounded-xl bg-blue-50 p-5 text-sm"><p>Ngân hàng: <b>{data.bankTransferInfo.bankName}</b></p><p className="mt-1">Chủ tài khoản: <b>{data.bankTransferInfo.accountName}</b></p><p className="mt-1">Số tài khoản: <b>{data.bankTransferInfo.accountNumber}</b></p><p className="mt-1">Nội dung chuyển khoản: <b>{booking.bookingCode}</b></p></div>}
      {method === "Thanh toán tại khách sạn" && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Thanh toán trực tiếp tại quầy lễ tân khi nhận phòng.</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {expired && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Đơn đã hết thời gian giữ chỗ.</p>}
      <div className="mt-5 flex flex-wrap gap-3"><Button disabled={busy || expired || (method === "Thanh toán tại khách sạn" && !booking.payAtHotel)} onClick={() => void settle(true)} variant="contained">{busy ? "Đang xử lý…" : method === "Chuyển khoản ngân hàng" ? "Xác nhận đã chuyển khoản" : "Thanh toán ngay"}</Button>{method === "VNPay" && <Button disabled={busy || expired} color="error" onClick={() => void settle(false)}>Mô phỏng thất bại</Button>}</div>
    </section><aside className="h-fit rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Tóm tắt đơn</h2><img src={booking.hotelImageUrl} alt={booking.hotelName} className="mt-4 h-40 w-full rounded-xl object-cover"/><h3 className="mt-3 font-bold">{booking.hotelName}</h3><p className="text-sm text-slate-500">{booking.roomName}</p><p className="mt-3 text-sm">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</p><p className="mt-1 text-sm">Mã đơn: {booking.bookingCode}</p><div className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Tổng thanh toán</span><span className="text-blue-700">{formatVnd(booking.total)}</span></div><p className="mt-2 text-xs text-slate-500">Giữ chỗ đến {booking.holdUntil ? new Date(booking.holdUntil).toLocaleTimeString("vi-VN") : "—"}</p></aside></div>
  </main>;
}

