import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SECURITY_ALERTS } from "../../data/adminMockData";

export const AdminAlertsWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Cảnh báo & Kiểm duyệt
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Luồng sự kiện thời gian thực
            </p>
          </div>
        </div>
        <Link
          to="/admin/reviews"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Xem chi tiết →
        </Link>
      </div>

      {/* Stream Items */}
      <div className="space-y-3 my-2">
        {SECURITY_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {alert.badgeType === "danger" ? (
                  <span className="p-1 rounded-md bg-rose-100 text-rose-700">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </span>
                ) : alert.badgeType === "warning" ? (
                  <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                ) : (
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-xs font-bold text-slate-800">{alert.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{alert.timeAgo}</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed pl-1">
              {alert.description}
            </p>

            {alert.actionText && (
              <div className="flex items-center gap-2 pt-1 pl-1">
                {alert.actionType === "review" ? (
                  <Link
                    to="/admin/reviews"
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                  >
                    {alert.actionText}
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded">
                      {alert.badgeText}
                    </span>
                    <button
                      type="button"
                      onClick={() => toast.info("Chi tiết giám sát IP 14.161.42.***: 3 booking hủy liên tiếp trong 90s, đã gắn cờ theo dõi SOC.")}
                      className="text-[11px] font-bold text-slate-700 hover:text-blue-600"
                    >
                      {alert.actionText}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Security Badge */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">Security Audit Status</span>
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/50 text-[10px]">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          PCI-DSS Compliant
        </span>
      </div>
    </div>
  );
};

export default AdminAlertsWidget;
