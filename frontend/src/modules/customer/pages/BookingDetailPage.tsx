import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Rating,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
} from "../../../components/common/Icons";
import {
  AccountLayout,
  LoadingState,
  PageHeading,
  panelClass,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking } from "../types/customer.types";
import { calcCancelFee } from "../utils/cancelPolicy";
import { formatDate, formatVnd } from "../utils/formatters";
export default function BookingDetailPage() {
  const { bookingId = "" } = useParams();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const load = () => {
    customerApiMethods
      .getBooking(bookingId)
      .then((item) => {
        setBooking(item ?? null);
        setError(item ? "" : "Không tìm thấy đơn đặt phòng.");
      })
      .catch(() => setError("Không thể tải chi tiết đơn."))
      .finally(() => setLoading(false));
  };
  useEffect(load, [bookingId]);
  if (loading)
    return (
      <AccountLayout>
        <PageHeading title="Chi tiết đơn đặt phòng" subtitle="Đang tải thông tin đơn của bạn." />
        <div className={panelClass}>
          <LoadingState />
        </div>
      </AccountLayout>
    );
  if (error || !booking)
    return (
      <AccountLayout>
        <div className={`${panelClass} text-center`}>
          <PageHeading
            title="Không tìm thấy đơn"
            subtitle={error || "Đơn đặt phòng không tồn tại."}
          />
          <Button component={Link} to="/customer/bookings" variant="contained">
            Về danh sách đơn
          </Button>
          <Button onClick={() => { setLoading(true); load(); }}>Thử lại</Button>
        </div>
      </AccountLayout>
    );
  const quote = calcCancelFee(
    booking.total,
    booking.checkIn,
    booking.paymentStatus === "PAID",
  );
  const earnedPoints = Math.floor(booking.total / 10000);
  const downloadVoucher = () => {
    toast.info("Đang mở hộp thoại lưu E-Voucher PDF.");
    window.print();
  };
  const statusText =
    booking.status === "CONFIRMED"
      ? "ĐÃ XÁC NHẬN"
      : booking.status === "COMPLETED"
        ? "ĐÃ HOÀN TẤT"
        : booking.status === "CANCELLED"
          ? "ĐÃ HỦY"
          : "CHỜ THANH TOÁN";
  return (
    <AccountLayout>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <Link className="hover:text-[#0F62FE]" to="/customer/bookings">Trang chủ</Link>
            <span className="mx-2">›</span>
            <Link className="hover:text-[#0F62FE]" to="/customer/bookings">Chi tiết đơn đặt phòng</Link>
            <span className="mx-2">›</span>
            <span className="font-semibold text-[#0F62FE]">{booking.bookingCode}</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
              ● {statusText}
            </span>
            {booking.paymentStatus === "PAID" && (
              <span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-blue-700">
                ✓ ĐÃ THANH TOÁN
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <Link className="text-sm font-semibold text-slate-700 hover:text-[#0F62FE]" to="/customer/bookings">
            ← Quay lại danh sách đơn
          </Link>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="relative h-52 sm:h-64">
                <img src={booking.hotelImageUrl} alt={booking.hotelName} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-amber-700 shadow-sm">★ 5 Sao Luxury Resort</span>
                  <span className="rounded-full bg-teal-500 px-3 py-1 text-white shadow-sm">♨ 9.6/10 Xuất sắc (842 đánh giá)</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-5 pb-4 pt-14 text-white">
                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{booking.hotelName}</h1>
                  <p className="mt-1 text-xs text-slate-200">⌖ {booking.hotelAddress}</p>
                </div>
              </div>
              <div className="grid gap-2 p-4 text-xs text-slate-600 sm:grid-cols-[1.3fr_1fr_1fr]">
                <span className="rounded-lg bg-slate-50 px-3 py-2">▣ Hotline hỗ trợ lễ tân (24/7)<br /><b className="text-slate-800">(+84) 236 3847 333 · 1900 1234</b></span>
                <button type="button" onClick={() => toast.info("Tính năng bản đồ sẽ được mở trong phiên bản tiếp theo.")} className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-[#0F62FE]">▣ Mở bản đồ đường đi</button>
                <a href={`tel:${booking.contactPhone}`} className="rounded-lg bg-blue-50 px-3 py-2 text-center font-semibold text-[#0F62FE] hover:bg-blue-100">♧ Liên hệ lễ tân</a>
              </div>
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0F62FE]">HẠNG PHÒNG ĐÃ ĐẶT</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">{booking.roomName}</h2>
                  <p className="text-xs text-slate-500">{booking.numberOfRooms} phòng · {booking.numberOfGuests} khách · {booking.numberOfNights} đêm</p>
                </div>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">♟ Tối đa {booking.numberOfGuests} người</span>
              </div>
              <div className="grid gap-3 rounded-xl bg-[#F0F3FF] p-4 sm:grid-cols-[1fr_1fr_1fr]">
                <div className="border-b border-blue-100 pb-3 sm:border-b-0 sm:border-r sm:pb-0">
                  <p className="text-[10px] uppercase text-slate-500">Nhận phòng (check-in)</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">14:00</p>
                  <p className="text-xs text-slate-500"><Calendar className="mr-1 inline h-3.5 w-3.5" />{formatDate(booking.checkIn)}</p>
                </div>
                <div className="order-3 flex items-center justify-center border-t border-blue-100 pt-3 text-center sm:order-none sm:border-t-0 sm:border-r sm:pt-0">
                  <span className="rounded-xl bg-blue-100 px-4 py-2 text-xs font-semibold text-slate-700">◔ {booking.numberOfNights} Đêm lưu trú<br /><small className="font-normal">Nghỉ dưỡng tiêu chuẩn</small></span>
                </div>
                <div className="sm:pl-3">
                  <p className="text-[10px] uppercase text-slate-500">Trả phòng (check-out)</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">12:00</p>
                  <p className="text-xs text-slate-500"><Calendar className="mr-1 inline h-3.5 w-3.5" />{formatDate(booking.checkOut)}</p>
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-slate-800">♧ Quyền lợi phòng & Tiện ích đã bao gồm</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3 text-xs"><p className="font-bold text-slate-500">KHÁCH NHẬN LƯU TRÚ</p><p className="mt-2 font-semibold">{booking.guestName}</p><p className="text-slate-500">{booking.contactPhone}</p></div>
                <div className="rounded-lg bg-slate-50 p-3 text-xs"><p className="font-bold text-slate-500">KHÁCH ĐẶT CÙNG & SỐ LƯỢNG</p><p className="mt-2 font-semibold">{booking.contactName}</p><p className="text-slate-500">{booking.numberOfGuests} khách</p></div>
              </div>
              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">✓ Dọn phòng hàng ngày</span>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">✓ Bữa sáng và wifi miễn phí</span>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">✓ Dịch vụ đón sân bay</span>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">✓ Trà chiều và quà chào mừng</span>
              </div>
              <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-600"><b>Yêu cầu đặc biệt của khách:</b> {booking.specialRequest || "Không có yêu cầu đặc biệt."}</p>
            </section>

            <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0F62FE]">QUÉT MÃ TẠI QUẦY CHECK-IN</p>
                  <h2 className="mt-1 text-lg font-bold">MeGo Fast Priority Check-in</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Xuất trình mã QR hoặc mã đặt phòng này để được ưu tiên làm thủ tục nhận phòng nhanh hơn.</p>
                </div>
                <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F0F3FF] text-center text-[8px] font-bold leading-3 text-slate-700">
                  <div className="grid grid-cols-5 gap-0.5 border-4 border-slate-800 bg-white p-1">{Array.from({ length: 25 }).map((_, i) => <span key={i} className={`h-2 w-2 ${[0, 1, 3, 5, 7, 9, 12, 13, 16, 18, 19, 21, 23, 24].includes(i) ? "bg-slate-900" : "bg-white"}`} />)}</div>
                  <span className="mt-1">#MEGO-CHECKIN-{booking.bookingCode.slice(-6)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-cyan-50 p-3 text-xs text-cyan-900"><b>▣ Chính sách phòng & Hoàn tiền linh hoạt</b><div className="mt-2 rounded-md bg-white/80 p-2 font-semibold">⚙ Miễn phí hủy phòng 100% trước 14:00 ngày {formatDate(booking.checkIn)}</div><p className="mt-2">✓ Hủy trước thời hạn: hoàn tiền đầy đủ &nbsp; · &nbsp; ⓘ Hủy sau thời hạn: áp dụng phí theo chính sách.</p></div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="font-bold">Chi tiết thanh toán</h2><span className="text-[10px] font-bold text-emerald-600">ĐÃ HOÀN TẤT</span></div>
              <div className="mt-4 space-y-2 border-b border-dashed border-slate-200 pb-4 text-xs text-slate-600">
                <p className="flex justify-between"><span>Giá phòng × {booking.numberOfNights} đêm</span><b>{formatVnd(booking.pricePerNight * booking.numberOfNights * booking.numberOfRooms)}</b></p>
                <p className="flex justify-between"><span>Thuế GTGT & phí dịch vụ</span><b>{formatVnd(booking.taxes)}</b></p>
                <p className="flex justify-between text-emerald-600"><span>Ưu đãi MeGo</span><b>-{formatVnd(booking.discount)}</b></p>
              </div>
              <div className="flex items-end justify-between gap-3 py-5"><span className="text-xs font-bold uppercase leading-3">TỔNG TIỀN ĐÃ TRẢ<br /><small className="font-normal normal-case">Đã bao gồm toàn bộ phí</small></span><strong className="text-3xl leading-8 text-[#0F62FE]">{formatVnd(booking.total)}</strong></div>
              <div className="rounded-xl bg-[#F0F3FF] p-3 text-xs"><p className="font-semibold">▤ Cổng thanh toán: <span className="text-slate-800">{booking.paymentMethod}</span></p><p className="mt-1 text-slate-500">Mã đối soát giao dịch: <b>{booking.bookingCode}</b></p><p className="mt-2 font-semibold text-teal-700">♙ Tích lũy hội viên VIP: +{earnedPoints.toLocaleString("vi-VN")} MeGo Points</p></div>
            </section>
            <section className="flex flex-col gap-[10px] rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <Button fullWidth variant="contained" onClick={downloadVoucher} sx={{ minHeight: 38, borderRadius: "8px", bgcolor: "#1769ff", boxShadow: "0 4px 10px rgba(23,105,255,.2)", py: 1.05, fontSize: 12, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#0f5de0" } }}>⇩&nbsp; Tải E-Voucher PDF</Button>
              <Button fullWidth variant="outlined" onClick={() => toast.success("Đã mở trình soạn email gửi voucher.")} sx={{ minHeight: 38, borderRadius: "8px", borderColor: "#e8edfb", bgcolor: "#f1f4ff", color: "#0f62fe", py: 1.05, fontSize: 12, fontWeight: 600, textTransform: "none", "&:hover": { borderColor: "#cbd9ff", bgcolor: "#eaf0ff" } }}><Mail className="mr-2 h-4 w-4" /> Gửi lại vé qua Email</Button>
              <Button fullWidth variant="outlined" href={`tel:${booking.contactPhone}`} sx={{ minHeight: 38, borderRadius: "8px", borderColor: "#e8edfb", bgcolor: "#f1f4ff", color: "#334155", py: 1.05, fontSize: 12, fontWeight: 500, textTransform: "none", "&:hover": { borderColor: "#cbd9ff", bgcolor: "#eaf0ff" } }}><Phone className="mr-2 h-4 w-4 text-[#0f62fe]" /> Hỗ trợ VIP 24/7 (Miễn cước 1900 1234)</Button>
              {["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status) && <><Button fullWidth color="error" variant="outlined" onClick={() => setCancelOpen(true)} sx={{ minHeight: 38, borderRadius: "8px", borderColor: "#ffd9d9", bgcolor: "#ffebeb", color: "#ef4444", py: 1.05, fontSize: 12, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#ffc1c1", bgcolor: "#ffe2e2" } }}>⊗&nbsp; Yêu cầu Hủy phòng</Button><p className="text-center text-xs text-slate-500">Hủy miễn phí đến {formatDate(booking.checkIn)}</p></>}
            </section>
            <div className="rounded-lg bg-blue-50 p-4 text-xs text-slate-600"><ShieldCheck className="mr-2 inline h-4 w-4 text-[#0F62FE]" /><b className="text-slate-800">Bảo đảm an tâm phòng 100% MeGo</b><p className="mt-2">Nếu khách sạn không đúng mô tả, MeGo hỗ trợ hoàn tiền hoặc tìm nơi nghỉ thay thế.</p></div>
            {booking.status === "COMPLETED" && !booking.reviewed && <Button fullWidth variant="contained" onClick={() => setReviewOpen(true)} sx={{ borderRadius: "8px", bgcolor: "#0F62FE" }}>Viết đánh giá kỳ nghỉ</Button>}
          </aside>
        </div>
      </div>
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>Xác nhận hủy phòng</DialogTitle>
        <DialogContent>
          <p>{quote.message}</p>
          <p>
            Phí hủy: {formatVnd(quote.fee)} · Hoàn dự kiến:{" "}
            {formatVnd(quote.refund)}
          </p>
          <TextField
            select
            fullWidth
            label="Lý do hủy"
            defaultValue="Thay đổi kế hoạch"
            className="mt-3"
          >
            <MenuItem value="Thay đổi kế hoạch">Thay đổi kế hoạch</MenuItem>
            <MenuItem value="Đặt nhầm">Đặt nhầm</MenuItem>
            <MenuItem value="Lý do khác">Lý do khác</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Không hủy</Button>
          <Button
            color="error"
            disabled={!quote.eligible}
            onClick={() =>
              void customerApiMethods
                .cancelBooking(booking.id)
                .then((item) => {
                  setBooking(item);
                  setCancelOpen(false);
                  toast.success("Đã hủy đặt phòng.");
                })
                .catch((reason: unknown) =>
                  toast.error(
                    reason instanceof Error
                      ? reason.message
                      : "Không thể hủy đơn.",
                  ),
                )
            }
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogTitle>Đánh giá kỳ nghỉ</DialogTitle>
        <DialogContent>
          <Rating defaultValue={5} />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Nhận xét phòng và dịch vụ"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Đóng</Button>
          <Button
            onClick={() => {
              setBooking({ ...booking, reviewed: true });
              setReviewOpen(false);
              toast.success("Cảm ơn bạn đã đánh giá.");
            }}
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </AccountLayout>
  );
}
