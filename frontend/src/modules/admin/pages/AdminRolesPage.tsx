import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  INITIAL_ROLES,
  INITIAL_PERMISSION_MODULES,
} from "../data/adminMockData";
import type { AdminRoleItem, RolePermissionModule } from "../types/admin";

export const AdminRolesPage: React.FC = () => {
  const [roles] = useState<AdminRoleItem[]>(INITIAL_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("r-02"); // Content Moderator by default
  const [modules, setModules] = useState<RolePermissionModule[]>(INITIAL_PERMISSION_MODULES);
  const [searchRole, setSearchRole] = useState("");

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (moduleId: string, permId: string) => {
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            permissions: mod.permissions.map((p) =>
              p.id === permId ? { ...p, checked: !p.checked } : p
            ),
          };
        }
        return mod;
      })
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    setModules((prev) =>
      prev.map((mod) => ({
        ...mod,
        permissions: mod.permissions.map((p) => ({ ...p, checked: selectAll })),
      }))
    );
    toast.info(selectAll ? "Đã bật tất cả đặc quyền cho vai trò này." : "Đã bỏ chọn tất cả đặc quyền.");
  };

  const handleSavePermissions = () => {
    toast.success(`Đã lưu cấu hình phân quyền cho vai trò "${selectedRole.name}"!`);
  };

  const handleResetDefaults = () => {
    setModules(INITIAL_PERMISSION_MODULES);
    toast.info("Đã khôi phục ma trận phân quyền về mặc định.");
  };

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
      r.code.toLowerCase().includes(searchRole.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Phân quyền &amp; Định danh &gt; Phân quyền Vai trò Hệ thống (P40)
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Vai trò &amp; Phân quyền
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              RBAC FRAMEWORK
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập danh sách phân quyền chi tiết, kiểm soát đặc quyền truy cập và thao tác dữ liệu trên toàn hệ thống sàn MeGo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/audit-logs"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Nhật ký phân quyền (Audit Log P42)</span>
          </Link>
          <button
            type="button"
            onClick={() => toast.info("Mở form tạo vai trò hệ thống mới")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Tạo vai trò mới</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">TỔNG SỐ VAI TRÒ</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">🛡️</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">6</div>
          <span className="text-[11px] text-slate-500">7 hệ thống mặc định • 4 tùy chỉnh</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">TÀI KHOẢN NỘI BỘ</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">👥</span>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1">42</div>
          <span className="text-[11px] text-slate-500">Đang hoạt động trên sàn</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CHÍNH SÁCH AN NINH</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100%</div>
          <span className="text-[11px] text-slate-500">Tuân thủ ISO/IEC 27001</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase">CẢNH BÁO ĐẶC QUYỀN</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">⚠️</span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">6</div>
          <span className="text-[11px] text-amber-700 font-semibold">Super Admins (Root L4)</span>
        </div>
      </div>

      {/* 2-Column Split: Roles List (Left) + Permissions Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Roles list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Danh sách Vai trò
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {roles.length} hoạt động
              </span>
            </div>

            {/* Search input */}
            <input
              type="text"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              placeholder="Tìm kiếm vai trò hoặc mã..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />

            {/* Roles Selection Cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600/30"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900">{role.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {role.accessLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {role.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">👥 {role.userCount} nhân sự</span>
                      {isSelected ? (
                        <span className="text-blue-600 font-bold text-[10px]">Đang chọn ✓</span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Nhấn để cấu hình</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Support Callout */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/50 text-[11px] text-blue-800 space-y-1">
              <span className="font-bold block">💡 Cần cấp quyền theo chuỗi đối tác?</span>
              <p className="text-slate-600 leading-normal">
                Bạn có thể tạo vai trò đối tác quản lý chuỗi khách sạn riêng biệt tại mục Quản lý Đối tác.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Permission Matrix for Selected Role */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                  CẤU HÌNH VAI TRÒ ĐANG CHỌN •
                </span>
                <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  {selectedRole.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Áp dụng cho {selectedRole.userCount} nhân sự nội bộ hệ thống MeGo
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Module Groups */}
            <div className="space-y-4">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{mod.moduleName}</h4>
                      <p className="text-[11px] text-slate-500">{mod.subtitle}</p>
                    </div>
                    {mod.badgeText && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          mod.badgeType === "danger"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {mod.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Permission Checkbox Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {mod.permissions.map((perm) => (
                      <label
                        key={perm.id}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          perm.checked
                            ? "bg-white border-blue-300 shadow-2xs ring-1 ring-blue-500/10"
                            : "bg-white/60 border-slate-200 hover:bg-white text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={perm.checked}
                          onChange={() => handleTogglePermission(mod.id, perm.id)}
                          className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <div className="space-y-0.5 text-xs">
                          <div className="font-bold text-slate-900 leading-snug">
                            {perm.name}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {perm.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Security Notice Card */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
              <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <span className="font-bold block">Xác thực chính sách An toàn Hệ thống</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Mọi thay đổi trong cấu hình phân quyền sẽ có hiệu lực ngay lập tức và được ghi nhận chi tiết vào Nhật ký Kiểm toán Hệ thống (Audit Log P42) theo chuẩn SOC-2 Type II.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Cập nhật lần cuối: Hôm nay lúc 11:24 bởi Super Admin (Vũ Hoàng Nam)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Khôi phục mặc định
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
                >
                  Lưu cấu hình Vai trò
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRolesPage;
