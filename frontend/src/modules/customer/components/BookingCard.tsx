import { Link } from "react-router-dom";
import {
  CancelOutlined,
  CheckCircleOutlined,
  ContentCopyOutlined,
  DownloadOutlined,
  EventAvailableOutlined,
  LocationOnOutlined,
  StarOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { panelClass } from "./CustomerShared";
import type { BookingStatus, CustomerBooking } from "../types/customer.types";
import { formatDate, formatVnd } from "../utils/formatters";

const statusLabels: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đang lưu trú",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

const statusStyles: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-blue-50 text-[#0F62FE] ring-[#0F62FE]/20",
  CHECKED_IN: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 ring-red-200",
};

export function BookingCard({ booking }: { booking: CustomerBooking }) {
  const confirmed = booking.status === "CONFIRMED";
  const paid = booking.paymentStatus === "PAID";
  const copyBookingCode = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard API is unavailable");
      }
      await navigator.clipboard.writeText(booking.bookingCode);
      toast.success(`Đã sao chép mã: ${booking.bookingCode}`);
    } catch {
      toast.error("Không thể sao chép mã đặt phòng. Vui lòng thử lại.");
    }
  };

  return (
    <article className={`${panelClass} group !rounded-lg !overflow-hidden !border-[#0F62FE]/20 !bg-white !p-0 transition-shadow duration-300 hover:shadow-md hover:shadow-blue-100/60`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#0F62FE]/15 bg-gradient-to-r from-blue-50/90 via-white to-cyan-50/60 px-4 py-3.5 text-[11px] sm:px-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-medium text-slate-500">
          <span className="uppercase tracking-wide text-[10px] text-[#0F62FE]">Mã đặt phòng</span>
          <b className="rounded-lg bg-white px-1.5 py-0.5 text-slate-800 shadow-sm ring-1 ring-blue-100">{booking.bookingCode}</b>
          <button
            type="button"
            aria-label={`Sao chép mã đặt phòng ${booking.bookingCode}`}
            onClick={() => void copyBookingCode()}
            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-blue-100 hover:text-[#0F62FE] focus:outline-none focus:ring-2 focus:ring-[#0F62FE]/30"
          >
            <ContentCopyOutlined sx={{ fontSize: 14 }} />
          </button>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span>Ngày đặt: {formatDate(booking.createdAt)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold ring-1 ring-inset ${statusStyles[booking.status]}`}>
            <CheckCircleOutlined sx={{ fontSize: 14 }} />
            {statusLabels[booking.status]}
          </span>
          {paid && (
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircleOutlined sx={{ fontSize: 13 }} /> Đã thanh toán 100% qua VNPAY
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-5 p-4 sm:grid-cols-[210px_minmax(0,1fr)] sm:p-5">
        <div className="relative min-h-40 overflow-hidden rounded-lg bg-blue-100">
          <img
            src={booking.hotelImageUrl}
            alt={booking.hotelName}
            className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-full sm:min-h-40"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-[9px] font-semibold text-[#0F62FE] shadow-sm backdrop-blur-sm">
            <StarOutlined sx={{ fontSize: 11 }} /> Khách sạn nổi bật
          </span>
          <span className="absolute bottom-3 left-3 text-[10px] font-medium tracking-wide text-white">MEGO STAY</span>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_145px]">
          <div>
            <h2 className="text-xl font-bold leading-6 tracking-tight text-slate-900">
              {booking.hotelName}
            </h2>
            <p className="mt-1.5 flex items-start gap-1 text-xs text-slate-500">
              <LocationOnOutlined sx={{ fontSize: 14 }} />
              {booking.hotelAddress}
            </p>
            <div className="mt-4 grid gap-2.5 rounded-lg border border-[#0F62FE]/15 bg-gradient-to-br from-blue-50 to-cyan-50/50 p-3 text-[11px] sm:grid-cols-2">
              <div className="border-b border-blue-100 pb-2.5 sm:border-b-0 sm:border-r sm:pb-0">
                <p className="mb-1 font-medium uppercase tracking-wide text-[9px] text-[#0F62FE]">Nhận phòng</p>
                <b className="text-slate-800">14:00, {formatDate(booking.checkIn)}</b>
              </div>
              <div className="sm:pl-1">
                <p className="mb-1 font-medium uppercase tracking-wide text-[9px] text-[#0F62FE]">Trả phòng</p>
                <b className="text-slate-800">12:00, {formatDate(booking.checkOut)}</b>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Hạng phòng đã chọn: <b className="text-slate-800">{booking.roomName}</b>
            </p>
            <p className="mt-1.5 text-[11px] text-slate-500">
              <EventAvailableOutlined sx={{ mr: 0.5, fontSize: 13, verticalAlign: "text-bottom" }} />
              Bao gồm ăn sáng buffet&nbsp; · &nbsp;Bãi biển riêng&nbsp; · &nbsp;
              {booking.numberOfNights} đêm · {booking.numberOfGuests} người lớn
            </p>
          </div>
          <div className="rounded-lg bg-slate-50/80 p-3 text-left sm:text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Tổng thanh toán</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[#0F62FE]">
              {formatVnd(booking.total)}
            </p>
            <p className="mt-1 text-[9px] leading-4 text-slate-400">
              Đã bao gồm thuế & phí dịch vụ
            </p>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#0F62FE]/15 bg-gradient-to-r from-white to-blue-50/50 px-4 py-3.5 sm:px-5">
        <p className="flex items-start gap-1 text-[10px] font-semibold text-emerald-600">
          <EventAvailableOutlined sx={{ fontSize: 14 }} />
          Miễn phí hủy phòng trước 14:00 ngày {formatDate(booking.checkIn)}
        </p>
        <div className="flex flex-wrap gap-2">
          {confirmed && (
            <Button
              component={Link}
              to={`/customer/bookings/${booking.id}`}
              size="small"
              variant="outlined"
              startIcon={<VisibilityOutlined />}
              sx={{ borderRadius: "8px", borderColor: "#0F62FE", color: "#0F62FE", "&:hover": { borderColor: "#0F62FE", backgroundColor: "#eff6ff" } }}
            >
              Liên hệ khách sạn
            </Button>
          )}
          {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
            <Button
              component={Link}
              to={`/customer/bookings/${booking.id}`}
              size="small"
              startIcon={<CancelOutlined />}
              sx={{ borderRadius: "8px", backgroundColor: "#fff1f2", color: "#ef4444", "&:hover": { backgroundColor: "#ffe4e6" } }}
            >
              Hủy phòng
            </Button>
          )}
          <Button
            component={Link}
            to={`/customer/bookings/${booking.id}`}
            size="small"
            startIcon={<DownloadOutlined />}
            sx={{ borderRadius: "8px", backgroundColor: "#eff6ff", color: "#0F62FE", "&:hover": { backgroundColor: "#dbeafe" } }}
          >
            Tải E-Voucher
          </Button>
          <Button
            component={Link}
            to={`/customer/bookings/${booking.id}`}
            size="small"
            variant="contained"
            startIcon={<VisibilityOutlined />}
            sx={{ borderRadius: "8px", backgroundColor: "#0F62FE", "&:hover": { backgroundColor: "#0052CC" } }}
          >
            Xem chi tiết đơn
          </Button>
          {booking.status === "PENDING_PAYMENT" && (
            <Button
              component={Link}
              to={`/customer/payment/${booking.id}`}
              size="small"
              variant="contained"
              sx={{ borderRadius: "8px", backgroundColor: "#0F62FE", "&:hover": { backgroundColor: "#0052CC" } }}
            >
              Thanh toán ngay
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}
