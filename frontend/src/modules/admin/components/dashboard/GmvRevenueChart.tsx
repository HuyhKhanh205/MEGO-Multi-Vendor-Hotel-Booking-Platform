import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MONTHLY_GMV_TREND } from "../../data/adminMockData";

export const GmvRevenueChart: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(MONTHLY_GMV_TREND.length - 1);

  // Chart coordinates calculation
  const width = 640;
  const height = 260;
  const paddingX = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxGmv = 55; // Tỷ VND
  const minGmv = 25;

  const pointsGmv = MONTHLY_GMV_TREND.map((item, idx) => {
    const x = paddingX + (idx / (MONTHLY_GMV_TREND.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((item.gmv - minGmv) / (maxGmv - minGmv)) * innerHeight;
    return { x, y, ...item };
  });

  const pointsCommission = MONTHLY_GMV_TREND.map((item, idx) => {
    const x = paddingX + (idx / (MONTHLY_GMV_TREND.length - 1)) * innerWidth;
    // scale commission proportionally
    const y = paddingTop + innerHeight - ((item.commission * 8 - minGmv) / (maxGmv - minGmv)) * innerHeight;
    return { x, y, ...item };
  });

  const pathD = pointsGmv.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsGmv[idx - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${pointsGmv[pointsGmv.length - 1].x} ${height - paddingBottom} L ${pointsGmv[0].x} ${height - paddingBottom} Z`;

  const commissionPathD = pointsCommission.reduce((acc, p, idx) => {
    if (idx === 0) return `M ${p.x} ${p.y}`;
    const prev = pointsCommission[idx - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  const activeItem = pointsGmv[activeIdx] || pointsGmv[pointsGmv.length - 1];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Xu hướng GMV & Hoa hồng
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            12 tháng gần nhất (11/2024 - 10/2025)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-slate-700">Tổng GMV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-500"></span>
            <span className="text-slate-700">Hoa hồng sàn</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden">
        {/* Active Tooltip Box */}
        {activeItem && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{
              left: `${(activeItem.x / width) * 100}%`,
              top: `${(activeItem.y / height) * 100 - 8}%`,
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl border border-slate-700 space-y-0.5 whitespace-nowrap">
              <div className="font-bold text-blue-300">Tháng {activeItem.month}</div>
              <div>GMV: <span className="font-extrabold text-white">{activeItem.gmv} Tỷ VND</span></div>
              <div>Hoa hồng: <span className="font-semibold text-teal-300">{activeItem.commission} Tỷ VND</span></div>
            </div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          <defs>
            <linearGradient id="gmvAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1677FF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#1677FF" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + innerHeight * ratio;
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* GMV Gradient Area */}
          <path d={areaD} fill="url(#gmvAreaGradient)" />

          {/* GMV Line */}
          <path d={pathD} fill="none" stroke="#1677FF" strokeWidth="2.8" strokeLinecap="round" />

          {/* Commission Line */}
          <path d={commissionPathD} fill="none" stroke="#00A389" strokeWidth="2.2" strokeLinecap="round" />

          {/* Interactive points & Month labels */}
          {pointsGmv.map((p, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Vertical hover guide */}
                {isSelected && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={height - paddingBottom}
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Point dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 6 : 3.5}
                  fill={isSelected ? "#1677FF" : "#FFFFFF"}
                  stroke="#1677FF"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* Month Label */}
                <text
                  x={p.x}
                  y={height - 15}
                  textAnchor="middle"
                  className={`text-[10px] font-medium ${
                    isSelected ? "fill-blue-600 font-bold" : "fill-slate-400"
                  }`}
                >
                  {p.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Insight Banner */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>GMV Q4: +114% chỉ tiêu đặt ra</span>
        </div>
        <Link
          to="/admin/finance"
          className="text-slate-500 hover:text-blue-600 font-semibold transition-colors flex items-center gap-1"
        >
          <span>Xem báo cáo chi tiết</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

export default GmvRevenueChart;
