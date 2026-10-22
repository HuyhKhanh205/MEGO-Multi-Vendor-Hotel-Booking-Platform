export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 flex flex-col lg:flex-row gap-4 animate-pulse">
      {/* 1. Left: Main Photo + 3 Thumbnails */}
      <div className="w-full lg:w-[270px] xl:w-[290px] shrink-0 flex flex-col gap-2">
        <div className="aspect-[16/10] lg:aspect-[4/3] rounded-xl bg-slate-200" />
        <div className="grid grid-cols-3 gap-1.5">
          <div className="aspect-[16/10] rounded-lg bg-slate-200" />
          <div className="aspect-[16/10] rounded-lg bg-slate-200" />
          <div className="aspect-[16/10] rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* 2. Center: Hotel Information */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-3">
        <div>
          <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
          <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-3.5 w-1/2 bg-slate-200 rounded mb-3" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 rounded-md" />
            <div className="h-6 w-24 bg-slate-200 rounded-md" />
            <div className="h-6 w-20 bg-slate-200 rounded-md" />
          </div>
        </div>
        <div className="h-6 w-44 bg-slate-200 rounded-md" />
      </div>

      {/* 3. Right: Rating Badge + Price + CTA */}
      <div className="w-full lg:w-[220px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4 flex flex-row lg:flex-col justify-between items-end gap-3">
        <div className="flex items-center gap-2 self-start lg:self-end">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="w-9 h-8 bg-slate-200 rounded-lg" />
        </div>
        <div className="w-full flex flex-col items-end space-y-2">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-7 w-28 bg-slate-200 rounded" />
          <div className="h-2.5 w-20 bg-slate-200 rounded" />
          <div className="h-10 w-full bg-slate-200 rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
};
