import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import SyncAltOutlined from "@mui/icons-material/SyncAltOutlined";
import SyncOutlined from "@mui/icons-material/SyncOutlined";
import type { DashboardPeriod } from "../../types/partner.types";
import { formatDate, formatTime } from "../../utils/formatters";
import { PERIOD_OPTIONS } from "./dashboardLabels";

interface DashboardHeaderProps {
  hotelName: string;
  today: string;
  syncedAt: string;
  period: DashboardPeriod;
  syncing: boolean;
  onPeriodChange: (period: DashboardPeriod) => void;
  onSync: () => void;
  onExport: () => void;
}

export const DashboardHeader = ({ hotelName, today, syncedAt, period, syncing, onPeriodChange, onSync, onExport }: DashboardHeaderProps) => (
  <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Xin chào, {hotelName}</h1>
      <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-slate-500">
        <SyncOutlined sx={{ fontSize: 16 }} className="text-[#1677FF]" />
        Hôm nay, {formatDate(today)} • Đồng bộ lúc {formatTime(syncedAt)}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2.5">
      <div role="tablist" aria-label="Khoảng thời gian" className="flex rounded-xl bg-slate-100 p-1">
        {PERIOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={period === option.value}
            onClick={() => onPeriodChange(option.value)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              period === option.value ? "bg-white text-[#1677FF] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onExport} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
        <FileDownloadOutlined sx={{ fontSize: 18 }} /> Xuất báo cáo
      </button>
      <button
        type="button"
        onClick={onSync}
        disabled={syncing}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#1677FF] px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-600 disabled:cursor-wait disabled:opacity-70"
      >
        <SyncAltOutlined sx={{ fontSize: 18 }} className={syncing ? "animate-spin" : ""} />
        {syncing ? "Đang đồng bộ..." : "Đồng bộ tức thì"}
      </button>
    </div>
  </section>
);

export default DashboardHeader;
