import React from "react";
import {
  Utensils,
  CheckCircle2,
  Sparkles,
  Info,
} from "../../../../components/common/Icons";

interface RoomPoliciesProps {
  perks: string[];
  breakfastIncluded: boolean;
  freeCancellation: boolean;
}

export const RoomPolicies: React.FC<RoomPoliciesProps> = ({
  perks,
  breakfastIncluded,
  freeCancellation,
}) => {
  const getPerkIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("sáng") || lower.includes("buffet"))
      return <Utensils className="w-4 h-4 text-amber-500" />;
    if (lower.includes("hủy") || lower.includes("miễn phí"))
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (lower.includes("club") || lower.includes("thưởng") || lower.includes("đặc quyền"))
      return <Sparkles className="w-4 h-4 text-[#1677FF]" />;
    return <Info className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="bg-blue-50/50 rounded-2xl border border-blue-100/80 p-5 sm:p-6 shadow-xs space-y-3.5">
      {/* Title & Quick Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
          <h3 className="text-xs sm:text-sm font-extrabold text-blue-900 tracking-wider uppercase">
            Chính sách & Đặc quyền kèm theo
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {breakfastIncluded && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              Có bữa sáng
            </span>
          )}
          {freeCancellation && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Hủy miễn phí
            </span>
          )}
        </div>
      </div>

      {/* Perks List */}
      <div className="space-y-2.5">
        {perks.map((perk, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-blue-100/60 shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
              {getPerkIcon(perk)}
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed flex-1">
              {perk}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPolicies;