import React, { useState } from "react";
import { toast } from "react-toastify";
import MetricCard from "../components/dashboard/MetricCard";
import GmvRevenueChart from "../components/dashboard/GmvRevenueChart";
import RevenueDonutChart from "../components/dashboard/RevenueDonutChart";
import PartnerVerificationTable from "../components/dashboard/PartnerVerificationTable";
import AdminAlertsWidget from "../components/dashboard/AdminAlertsWidget";
import { OVERVIEW_METRICS } from "../data/adminMockData";

export const AdminHome: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<string>("month");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Dữ liệu chỉ số toàn sàn đã được đồng bộ mới nhất (Độ trễ: 12ms)!");
    }, 600);
  };

  const handleExportSummary = () => {
    toast.info("Đang xuất file Báo cáo Tổng quan Q4/2026 (.xlsx)...");
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Filters & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tổng quan Hệ thống & Hoạt động Toàn sàn
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Hệ thống vận hành ổn định • 99.98% Uptime
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng hợp chỉ số GMV, doanh thu hoa hồng và kiểm duyệt đối tác thời gian thực.
          </p>
        </div>

        {/* Time Filter Buttons & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Filter Pills */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setSelectedRange("today")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === "today" ? "bg-white text-blue-700 shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange("7days")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === "7days" ? "bg-white text-blue-700 shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              7 ngày qua
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange("month")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedRange === "month" ? "bg-white text-blue-700 shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Tháng này (10/2026)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange("custom")}
              className={`px-3 py-1.5 rounded-lg transition-colors hidden sm:block ${
                selectedRange === "custom" ? "bg-white text-blue-700 shadow-2xs" : "hover:text-slate-900"
              }`}
            >
              Tùy chỉnh
            </button>
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={handleExportSummary}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Xuất báo cáo</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-75"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm mới dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {OVERVIEW_METRICS.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Middle Row: Trend Area Chart (Left) + Donut Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GmvRevenueChart />
        </div>
        <div className="lg:col-span-1">
          <RevenueDonutChart />
        </div>
      </div>

      {/* Bottom Row: Pending Verification Table (Left) + Real-time Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PartnerVerificationTable />
        </div>
        <div className="lg:col-span-1">
          <AdminAlertsWidget />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
