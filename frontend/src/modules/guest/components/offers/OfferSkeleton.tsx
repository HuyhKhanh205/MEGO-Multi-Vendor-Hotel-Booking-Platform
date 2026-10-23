import React from "react";

export const OfferSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-4 space-y-4"
        >
          <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferSkeleton;
