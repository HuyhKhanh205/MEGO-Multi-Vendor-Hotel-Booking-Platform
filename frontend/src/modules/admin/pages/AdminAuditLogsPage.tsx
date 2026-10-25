import React, { useState } from "react";
import { toast } from "react-toastify";
import { MOCK_AUDIT_LOGS } from "../data/adminMockData";
import type { AuditLogEntry } from "../types/admin";

export const AdminAuditLogsPage: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.targetId.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Nhật ký Hệ thống (Audit Log Trail P42)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              SOC-2 Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi vết bất biến mọi thao tác can thiệp dữ liệu, phê duyệt payout, đình chỉ tài khoản và truy cập hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Đang tạo gói mã hóa xuất bản ghi kiểm toán P42...")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>📜</span>
          <span>Xuất tệp Audit Trail</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
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
            placeholder="Tìm theo thao tác, admin, mã định danh..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Thời gian</th>
                <th className="py-3.5 px-4 font-semibold">Nhân sự thực hiện</th>
                <th className="py-3.5 px-4 font-semibold">Hành động</th>
                <th className="py-3.5 px-4 font-semibold">Đối tượng mục tiêu</th>
                <th className="py-3.5 px-4 font-semibold">Chi tiết thao tác</th>
                <th className="py-3.5 px-4 font-semibold">Địa chỉ IP</th>
                <th className="py-3.5 px-4 text-right font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500 font-sans">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 font-sans">{log.adminName}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">{log.action}</td>
                  <td className="py-3.5 px-4 text-slate-800 font-bold">{log.targetId}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-sans">{log.details}</td>
                  <td className="py-3.5 px-4 text-slate-500">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      Thành công
                    </span>
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

export default AdminAuditLogsPage;
