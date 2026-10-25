import React, { useState } from "react";
import { REGIONAL_REVENUE_DISTRIBUTION } from "../../data/adminMockData";

export const RevenueDonutChart: React.FC = () => {
  const [activeCity, setActiveCity] = useState<string>("Đà Nẵng & Hội An");

  // Donut SVG parameters
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const currentSelection =
    REGIONAL_REVENUE_DISTRIBUTION.find((c) => c.city === activeCity) ||
    REGIONAL_REVENUE_DISTRIBUTION[0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Phân bổ Doanh thu
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo trọng điểm du lịch
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
          Toàn quốc
        </span>
      </div>

      {/* Donut and Legend Body */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90 select-none">
            {REGIONAL_REVENUE_DISTRIBUTION.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percentage;

              const isHighlighted = item.city === activeCity;

              return (
                <circle
                  key={item.city}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHighlighted ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                  onMouseEnter={() => setActiveCity(item.city)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              ĐỨNG ĐẦU
            </span>
            <span className="text-sm font-extrabold text-slate-900 leading-tight">
              {currentSelection.city.split("&")[0].split("-")[0].trim()}
            </span>
            <span className="text-xs font-bold text-blue-600">
              {currentSelection.percentage}% tỷ trọng
            </span>
          </div>
        </div>

        {/* Breakdown Legend List */}
        <div className="flex-1 w-full space-y-2 text-xs">
          {REGIONAL_REVENUE_DISTRIBUTION.map((item) => {
            const isHovered = item.city === activeCity;
            return (
              <div
                key={item.city}
                onMouseEnter={() => setActiveCity(item.city)}
                className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors ${
                  isHovered ? "bg-slate-50 font-bold" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-slate-700 truncate">{item.city}</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="font-bold text-slate-900">{item.revenue} Tỷ</span>
                  <span className="text-[11px] text-slate-400 ml-1">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Segment Tag */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Top phân khúc:</span>
        <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/50">
          Resort biển & Boutique Hotel
        </span>
      </div>
    </div>
  );
};

export default RevenueDonutChart;
