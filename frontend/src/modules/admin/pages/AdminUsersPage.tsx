import React, { useState } from "react";
import { toast } from "react-toastify";
import { INITIAL_USERS } from "../data/adminMockData";
import type { AdminUser } from "../types/admin";
import SuspendUserModal from "../components/users/SuspendUserModal";

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUserForSuspend, setSelectedUserForSuspend] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.userCode.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenSuspend = (user: AdminUser) => {
    setSelectedUserForSuspend(user);
  };

  const handleConfirmSuspend = (
    userId: string,
    reason: string,
    note: string,
    duration: "7_days" | "30_days" | "permanent",
    sendNotification: boolean,
    writeAuditLog: boolean
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: "suspended",
            suspensionInfo: {
              reason,
              note,
              duration,
              suspendedAt: new Date().toLocaleString("vi-VN"),
              suspendedBy: "Super Admin (Vũ Hoàng Nam)",
            },
          };
        }
        return u;
      })
    );
    toast.error(`Đã đình chỉ tài khoản ${selectedUserForSuspend?.fullName} (${duration}). Phiên JWT đã bị hủy.`);
    if (sendNotification) {
      toast.info("Đã gửi email cảnh cáo và SMS thông báo thời hạn khóa.");
    }
    if (writeAuditLog) {
      console.log("Logged to Audit Trail P42:", { userId, reason, note });
    }
    setSelectedUserForSuspend(null);
  };

  const handleUnsuspend = (userId: string, userName: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: "active",
            suspensionInfo: undefined,
          };
        }
        return u;
      })
    );
    toast.success(`Đã mở khóa và khôi phục quyền truy cập cho tài khoản "${userName}".`);
  };

  const totalUsers = users.length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const customersCount = users.filter((u) => u.role === "customer").length;
  const partnersCount = users.filter((u) => u.role === "partner").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Tài khoản & Phân quyền
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu, kiểm duyệt đặc quyền VIP, cấp phát vai trò và xử lý vi phạm tài khoản toàn sàn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Tính năng Thêm tài khoản Admin/Nhân viên nội bộ")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+</span>
          <span>Thêm tài khoản Admin/Nhân viên</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Tổng tài khoản</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalUsers}</div>
          <span className="text-[11px] text-slate-500">Người dùng sàn</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Khách hàng</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{customersCount}</div>
          <span className="text-[11px] text-slate-500">Bao gồm hạng VIP</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Chủ khách sạn (Partner)</span>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">{partnersCount}</div>
          <span className="text-[11px] text-slate-500">Đại diện pháp luật</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-500 uppercase">Tài khoản bị khóa</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{suspendedCount}</div>
          <span className="text-[11px] text-rose-500 font-semibold">Vi phạm chính sách</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT, mã user..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng (Customer)</option>
            <option value="partner">Đối tác (Partner)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="suspended">Đang bị khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã định danh</th>
                <th className="py-3.5 px-4 font-semibold">Người dùng</th>
                <th className="py-3.5 px-4 font-semibold">Email & Địa chỉ</th>
                <th className="py-3.5 px-4 font-semibold">Số điện thoại</th>
                <th className="py-3.5 px-4 font-semibold">Vai trò hệ thống</th>
                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                <th className="py-3.5 px-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Không tìm thấy người dùng phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {u.userCode}
                    </td>

                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {u.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {u.vipTier && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {u.vipTier}
                              </span>
                            )}
                          </div>
                          {u.suspensionInfo && (
                            <span className="text-[10px] text-rose-500 font-medium">
                              {u.suspensionInfo.reason}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email & Location */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{u.email}</div>
                      <div className="text-[11px] text-slate-400">{u.location}</div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {u.phone}
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          🛡️ {u.roleDetail}
                        </span>
                      ) : u.role === "partner" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          🏨 {u.roleDetail}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          👤 {u.roleDetail}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {u.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Đang bị khóa
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {u.status === "active" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenSuspend(u)}
                          className="px-2.5 py-1.5 text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all"
                        >
                          Khóa tài khoản
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUnsuspend(u.id, u.fullName)}
                          className="px-2.5 py-1.5 text-emerald-700 hover:text-white hover:bg-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
                        >
                          Mở khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Hiển thị <strong>1 - {filteredUsers.length}</strong> trong tổng số <strong>{totalUsers}</strong> người dùng
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium">«</button>
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">1</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium">2</button>
            <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium">»</button>
          </div>
        </div>
      </div>

      {/* Suspend User Modal */}
      <SuspendUserModal
        user={selectedUserForSuspend}
        isOpen={Boolean(selectedUserForSuspend)}
        onClose={() => setSelectedUserForSuspend(null)}
        onConfirm={handleConfirmSuspend}
      />
    </div>
  );
};

export default AdminUsersPage;
