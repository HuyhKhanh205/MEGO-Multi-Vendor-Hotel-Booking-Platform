import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import type { RecentBooking } from "../../types/partner.types";
import { formatDayMonth, formatVnd, nightsBetween } from "../../utils/formatters";
import { PAYMENT_STATUS, STAY_STATUS } from "./dashboardLabels";

const PAGE_SIZE = 4;

const actionFor = (booking: RecentBooking): { label: string; primary: boolean } => {
  if (booking.stayStatus === "ARRIVING") return { label: "Check-in nhanh", primary: true };
  if (booking.stayStatus === "DEPARTING") return { label: "Trả phòng", primary: true };
  if (booking.paymentStatus === "PAY_AT_HOTEL") return { label: "Thu ngân", primary: false };
  return { label: "Xem đơn", primary: false };
};

const initials = (name: string) => name.split(" ").filter(Boolean).slice(-2).map((word) => word[0]).join("").toUpperCase();

interface RecentBookingsTableProps {
  bookings: RecentBooking[];
  totalBookings: number;
}

export const RecentBookingsTable = ({ bookings, totalBookings }: RecentBookingsTableProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return bookings;
    return bookings.filter((booking) => `${booking.code} ${booking.guestName} ${booking.roomNumber} ${booking.roomType}`.toLowerCase().includes(keyword));
  }, [bookings, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Danh sách đặt phòng gần nhất</h2>
          <p className="text-sm text-slate-500">Các đơn nhận/trả phòng quanh ngày hôm nay</p>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Tìm theo mã đơn, tên khách hoặc số phòng</span>
          <SearchOutlined sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder="Tìm mã đơn, tên khách, số phòng..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 border-t border-slate-100 px-6 py-12 text-center">
          <SearchOffOutlined className="text-slate-300" sx={{ fontSize: 40 }} />
          <p className="font-semibold text-slate-700">Không tìm thấy đơn phù hợp</p>
          <p className="text-sm text-slate-500">Thử tìm bằng mã đơn (VD: MG-84920), tên khách hoặc số phòng.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* 6 cột thay vì 8 như Figma để nội dung không bị xuống 4–5 dòng */}
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Khách & mã đơn</th>
                <th scope="col" className="px-4 py-3">Phòng</th>
                <th scope="col" className="px-4 py-3">Lưu trú</th>
                <th scope="col" className="px-4 py-3">Thanh toán</th>
                <th scope="col" className="px-4 py-3">Trạng thái</th>
                <th scope="col" className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((booking) => {
                const payment = PAYMENT_STATUS[booking.paymentStatus];
                const stay = STAY_STATUS[booking.stayStatus];
                const action = actionFor(booking);
                const nights = nightsBetween(booking.checkIn, booking.checkOut);
                return (
                  <tr key={booking.code} className="hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#004CCD]">{initials(booking.guestName)}</span>
                        <div className="min-w-0">
                          <p className="whitespace-nowrap font-semibold text-slate-900" title={booking.guestNote}>{booking.guestName}</p>
                          <p className="whitespace-nowrap font-mono text-xs font-semibold text-[#1677FF]">#{booking.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap font-medium text-slate-800">{booking.roomType}</p>
                      <p className="whitespace-nowrap text-xs text-slate-500" title={booking.bedInfo}>Phòng {booking.roomNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap font-medium text-slate-800">{formatDayMonth(booking.checkIn)} – {formatDayMonth(booking.checkOut)}</p>
                      <p className="whitespace-nowrap text-xs text-slate-500">{nights} đêm · {booking.guests} khách</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="whitespace-nowrap font-bold text-slate-900">{formatVnd(booking.totalAmount)}</p>
                      <span className={`mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${payment.className}`}>
                        {booking.paymentStatus === "PAY_AT_HOTEL" ? payment.label : `${payment.label} · ${booking.paymentMethod}`}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${stay.className}`}>
                        {stay.label}{booking.expectedTime ? ` · ${booking.expectedTime}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/partner/bookings/${booking.code}`)}
                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          action.primary ? "bg-[#1677FF] text-white hover:bg-blue-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {action.label}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
        <span>
          Hiển thị {from}–{from === 0 ? 0 : from + rows.length - 1} trong {filtered.length} đơn gần nhất ·{" "}
          <Link to="/partner/bookings" className="inline-flex items-center gap-0.5 font-semibold text-[#1677FF] hover:underline">
            Xem tất cả {totalBookings} đơn <ArrowForwardOutlined sx={{ fontSize: 15 }} />
          </Link>
        </span>
        <nav className="flex items-center gap-1" aria-label="Phân trang">
          <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Trang trước">
            <ChevronLeftOutlined fontSize="small" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={`h-8 min-w-8 rounded-lg px-2 text-sm font-semibold ${pageNumber === currentPage ? "bg-[#1677FF] text-white" : "hover:bg-slate-100"}`}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-40" aria-label="Trang sau">
            <ChevronRightOutlined fontSize="small" />
          </button>
        </nav>
      </div>
    </section>
  );
};

export default RecentBookingsTable;
