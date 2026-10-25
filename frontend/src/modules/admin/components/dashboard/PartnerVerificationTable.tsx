import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { INITIAL_VERIFICATION_ITEMS } from "../../data/adminMockData";
import type { PartnerVerificationItem } from "../../types/admin";

export const PartnerVerificationTable: React.FC = () => {
  const [items, setItems] = useState<PartnerVerificationItem[]>(INITIAL_VERIFICATION_ITEMS);

  const handleApprove = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Đã duyệt hồ sơ đối tác "${name}" thành công!`);
  };

  const handleRequestDocs = (name: string) => {
    toast.info(`Đã gửi yêu cầu bổ sung hồ sơ PCCC đến "${name}" qua Email/SMS.`);
  };

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.warn("Đã tạm hoãn xem xét hồ sơ này.");
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Hồ sơ Đối tác & Khách sạn chờ thẩm định
          </h3>
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/70">
            {items.length} yêu cầu mới
          </span>
        </div>
        <Link
          to="/admin/partners"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          <span>Xem toàn bộ (18)</span>
          <span>→</span>
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-1 font-semibold">Đối tác</th>
              <th className="pb-3 font-semibold">Khu vực</th>
              <th className="pb-3 font-semibold">Pháp lý</th>
              <th className="pb-3 pr-1 text-right font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                  🎉 Toàn bộ hồ sơ đối tác mới đã được xử lý xong!
                </td>
              </tr>
            ) : (
              items.map((partner) => (
                <tr key={partner.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 pl-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 overflow-hidden">
                        {partner.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-snug">
                          {partner.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {partner.code} • {partner.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 font-medium text-slate-700">
                    {partner.region}
                  </td>

                  <td className="py-3">
                    {partner.legalStatus === "valid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Hợp lệ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Thiếu PCCC
                      </span>
                    )}
                  </td>

                  <td className="py-3 pr-1 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {partner.legalStatus === "valid" ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(partner.id, partner.name)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Duyệt nhanh
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRequestDocs(partner.name)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Bổ sung
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDismiss(partner.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title="Tạm hoãn"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerVerificationTable;
