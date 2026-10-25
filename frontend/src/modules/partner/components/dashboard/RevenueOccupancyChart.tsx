import { useState } from "react";
import type { DailyTrendPoint } from "../../types/partner.types";
import { formatDate, formatDayMonth, formatVnd, formatWeekday, isWeekend } from "../../utils/formatters";

const WIDTH = 680;
const HEIGHT = 280;
const PAD = { top: 16, right: 44, bottom: 34, left: 44 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const REVENUE_STEP = 4_000_000;
const OCCUPANCY_TICKS = [0, 25, 50, 75, 100];

interface RevenueOccupancyChartProps {
  trend: DailyTrendPoint[];
  today: string;
}

export const RevenueOccupancyChart = ({ trend, today }: RevenueOccupancyChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxRevenue = Math.max(REVENUE_STEP, Math.ceil((Math.max(...trend.map((point) => point.revenue)) * 1.1) / REVENUE_STEP) * REVENUE_STEP);
  const revenueTicks = Array.from({ length: maxRevenue / REVENUE_STEP + 1 }, (_, index) => index * REVENUE_STEP);
  const slot = PLOT_W / trend.length;
  const barWidth = Math.min(26, slot * 0.6);
  const xCenter = (index: number) => PAD.left + slot * index + slot / 2;
  const yRevenue = (value: number) => PAD.top + PLOT_H - (value / maxRevenue) * PLOT_H;
  const yOccupancy = (value: number) => PAD.top + PLOT_H - (value / 100) * PLOT_H;
  const linePath = trend.map((point, index) => `${index === 0 ? "M" : "L"}${xCenter(index)},${yOccupancy(point.occupancyPct)}`).join(" ");
  const active = hovered === null ? null : trend[hovered];

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Xu hướng Doanh thu & Công suất</h2>
          <p className="text-sm text-slate-500">
            {trend.length} ngày qua ({formatDayMonth(trend[0].date)} – {formatDayMonth(trend[trend.length - 1].date)})
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-[#1677FF]" /> Doanh thu (triệu ₫)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-teal-600" /> Công suất (%)</span>
        </div>
      </div>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Biểu đồ doanh thu và công suất phòng theo ngày" onMouseLeave={() => setHovered(null)}>
          {/* Lưới + nhãn trục Y bên trái (doanh thu) */}
          {revenueTicks.map((tick) => (
            <g key={`r-${tick}`}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yRevenue(tick)} y2={yRevenue(tick)} stroke="#E2E8F0" strokeDasharray={tick === 0 ? undefined : "4 4"} />
              <text x={PAD.left - 8} y={yRevenue(tick) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">{tick / 1_000_000}</text>
            </g>
          ))}
          {/* Nhãn trục Y bên phải (công suất) */}
          {OCCUPANCY_TICKS.map((tick) => (
            <text key={`o-${tick}`} x={WIDTH - PAD.right + 8} y={yOccupancy(tick) + 4} className="fill-teal-600 text-[11px]">{tick}%</text>
          ))}

          {trend.map((point, index) => {
            const isToday = point.date === today;
            const highlighted = hovered === index || isToday || isWeekend(point.date);
            const x = xCenter(index);
            return (
              <g key={point.date} onMouseEnter={() => setHovered(index)}>
                <rect x={PAD.left + slot * index} y={PAD.top} width={slot} height={PLOT_H} fill="transparent" />
                <rect
                  x={x - barWidth / 2}
                  y={yRevenue(point.revenue)}
                  width={barWidth}
                  height={PAD.top + PLOT_H - yRevenue(point.revenue)}
                  rx={5}
                  fill={highlighted ? "#1677FF" : "#DCE7FF"}
                />
                {/* Đếm lùi từ ngày cuối để nhãn "hôm nay" không đè lên nhãn liền trước */}
                {(trend.length - 1 - index) % 2 === 0 && (
                  <text
                    x={x}
                    y={HEIGHT - 12}
                    textAnchor="middle"
                    className={`text-[11px] ${isToday || isWeekend(point.date) ? "fill-[#1677FF] font-semibold" : "fill-slate-500"}`}
                  >
                    {formatDayMonth(point.date)}{isToday ? " (nay)" : ""}
                  </text>
                )}
              </g>
            );
          })}

          <path d={linePath} fill="none" stroke="#0D9488" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" pointerEvents="none" />
          {trend.map((point, index) => (
            <circle key={`dot-${point.date}`} cx={xCenter(index)} cy={yOccupancy(point.occupancyPct)} r={hovered === index ? 5 : 3} fill="#fff" stroke="#0D9488" strokeWidth={2} pointerEvents="none" />
          ))}
        </svg>

        {active && hovered !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: `${(xCenter(hovered) / WIDTH) * 100}%` }}
          >
            <p className="font-semibold capitalize text-slate-300">{formatWeekday(active.date)}, {formatDate(active.date)}</p>
            <p className="mt-0.5 font-bold">{formatVnd(active.revenue)} • {active.occupancyPct}% công suất</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RevenueOccupancyChart;
