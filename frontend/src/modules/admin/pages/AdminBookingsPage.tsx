import React, { useState } from "react";
import { toast } from "react-toastify";
import { MOCK_BOOKING_ORDERS } from "../data/adminMockData";
import type { BookingOrderItem } from "../types/admin";

export const AdminBookingsPage: React.FC = () => {
  const [orders, setOrders] = useState<BookingOrderItem[]>(MOCK_BOOKING_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = statusFilter === "all" || o.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancelBooking = (bookingCode: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.bookingCode === bookingCode ? { ...o, bookingStatus: "cancelled" } : o
      )
    );
    toast.warn(`Đã cập nhật trạng thái hủy đơn đặt phòng "${bookingCode}".`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Đơn đặt phòng Toàn sàn
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              14.820 đơn hoàn tất
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tình trạng giữ chỗ, cổng thanh toán VNPay, chính sách hủy phòng và hỗ trợ xử lý tranh chấp giữa khách &amp; đối tác.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Đang xuất danh sách đơn đặt phòng (.xlsx)...")}
          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>📥</span>
          <span>Xuất danh sách đơn (.xlsx)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn MEGO-, tên khách, khách sạn..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái đặt phòng</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Đã hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã đơn đặt phòng</th>
                <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                <th className="py-3.5 px-4 font-semibold">Khách sạn &amp; Loại phòng</th>
                <th className="py-3.5 px-4 font-semibold">Thời gian lưu trú</th>
                <th className="py-3.5 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3.5 px-4 font-semibold">Thanh toán</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    {item.bookingCode}
                    <div className="text-[10px] text-slate-400 font-sans font-normal">{item.createdAt}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{item.hotelName}</div>
                    <div className="text-[11px] text-slate-500">{item.roomType}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {item.checkIn} → {item.checkOut}
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {item.totalAmount.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      VNPay QR
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {item.bookingStatus === "confirmed" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đã xác nhận
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
                        Đã hủy
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toast.info(`Xem hóa đơn điện tử đơn ${item.bookingCode}`)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                      >
                        Hóa đơn
                      </button>
                      {item.bookingStatus === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(item.bookingCode)}
                          className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold rounded-lg transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
