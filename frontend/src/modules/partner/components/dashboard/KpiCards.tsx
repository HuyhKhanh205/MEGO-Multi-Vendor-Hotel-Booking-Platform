import type { ReactNode } from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import FlightLandOutlined from "@mui/icons-material/FlightLandOutlined";
import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined";
import MeetingRoomOutlined from "@mui/icons-material/MeetingRoomOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import TrendingDownOutlined from "@mui/icons-material/TrendingDownOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import type { DashboardPeriod, PartnerKpis, RoomStatusSummary } from "../../types/partner.types";
import { formatCompactVnd, formatVnd } from "../../utils/formatters";
import { PERIOD_COPY } from "./dashboardLabels";

const percent = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 });

interface KpiCardProps {
  title: string;
  icon: SvgIconComponent;
  iconClass: string;
  children: ReactNode;
  footer: ReactNode;
}

const KpiCard = ({ title, icon: Icon, iconClass, children, footer }: KpiCardProps) => (
  <article className="flex min-w-0 flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5">
    <div className="flex items-start justify-between gap-3">
      <h2 className="text-sm font-semibold text-slate-600">{title}</h2>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon sx={{ fontSize: 20 }} />
      </span>
    </div>
    {/* Số liệu luôn nằm trên 1 dòng, không bị cắt như bản Figma */}
    <div className="min-w-0 whitespace-nowrap">{children}</div>
    <div className="text-xs text-slate-500">{footer}</div>
  </article>
);

const Change = ({ value, suffix }: { value: number; suffix: string }) => {
  const up = value >= 0;
  const Icon = up ? TrendingUpOutlined : TrendingDownOutlined;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-bold ${up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
        <Icon sx={{ fontSize: 14 }} /> {up ? "+" : ""}{percent.format(value)}%
      </span>
      {suffix}
    </span>
  );
};

interface KpiCardsProps {
  period: DashboardPeriod;
  kpis: PartnerKpis;
  roomStatus: RoomStatusSummary;
}

export const KpiCards = ({ period, kpis, roomStatus }: KpiCardsProps) => {
  const copy = PERIOD_COPY[period];
  const targetReached = kpis.occupancyPct >= kpis.occupancyTargetPct;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chỉ số chính">
      <KpiCard title={copy.revenue} icon={InsertChartOutlined} iconClass="bg-blue-50 text-[#1677FF]" footer={<Change value={kpis.revenueChangePct} suffix={copy.comparison} />}>
        <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight text-slate-900" title={formatVnd(kpis.revenue)}>
          {formatCompactVnd(kpis.revenue)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{formatVnd(kpis.revenue)}</p>
      </KpiCard>

      <KpiCard
        title="Công suất phòng (Occupancy)"
        icon={MeetingRoomOutlined}
        iconClass="bg-cyan-50 text-cyan-600"
        footer={
          <span className="flex flex-wrap items-center justify-between gap-2">
            <Change value={kpis.occupancyChangePct} suffix="" />
            <span className={targetReached ? "font-semibold text-emerald-600" : ""}>Mục tiêu: {kpis.occupancyTargetPct}%</span>
          </span>
        }
      >
        <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight text-slate-900">
          {percent.format(kpis.occupancyPct)}<span className="text-lg text-slate-500">%</span>
        </p>
        <div className="relative mt-2 h-2 rounded-full bg-slate-100" role="progressbar" aria-valuenow={kpis.occupancyPct} aria-valuemin={0} aria-valuemax={100} aria-label="Công suất phòng">
          <div className="h-2 rounded-full bg-[#1677FF]" style={{ width: `${Math.min(100, kpis.occupancyPct)}%` }} />
          <span className="absolute -top-1 h-4 w-0.5 rounded bg-slate-400" style={{ left: `${kpis.occupancyTargetPct}%` }} title={`Mục tiêu ${kpis.occupancyTargetPct}%`} />
        </div>
      </KpiCard>

      <KpiCard
        title={copy.bookings}
        icon={ReceiptLongOutlined}
        iconClass="bg-indigo-50 text-indigo-600"
        footer={
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 font-bold text-[#1677FF]">
              <BoltOutlined sx={{ fontSize: 14 }} /> {kpis.newBookings24h} mới
            </span>
            trong 24 giờ qua
          </span>
        }
      >
        <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight text-slate-900">
          {kpis.bookings} <span className="text-lg font-semibold text-slate-500">lượt</span>
        </p>
      </KpiCard>

      <KpiCard
        title="Điều phối hôm nay"
        icon={FlightLandOutlined}
        iconClass="bg-rose-50 text-rose-500"
        footer={
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {roomStatus.cleaning} phòng đang dọn
            </span>
            <span>Sẵn sàng: {roomStatus.vacantReady} phòng</span>
          </span>
        }
      >
        <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight">
          <span className="text-[#1677FF]">{kpis.checkInsToday}</span>
          <span className="text-base font-semibold text-slate-500"> nhận</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-teal-700">{kpis.checkOutsToday}</span>
          <span className="text-base font-semibold text-slate-500"> trả</span>
        </p>
      </KpiCard>
    </section>
  );
};

export default KpiCards;
