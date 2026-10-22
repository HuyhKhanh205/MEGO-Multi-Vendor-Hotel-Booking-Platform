import { List, MapPin, SlidersHorizontal } from "../../../../components/common/Icons";
import type { SortCriteria } from "../../../../types/hotel";

interface HotelSortBarProps {
  total: number;
  destination?: string;
  currentSort: SortCriteria;
  onSortChange: (sort: SortCriteria) => void;
  viewMode: "list" | "map";
  onViewModeChange: (mode: "list" | "map") => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export const HotelSortBar = ({
  total,
  destination,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount,
}: HotelSortBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
      {/* ── Left: Result title & description (Exact match to sample image) ── */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Tìm thấy {total} khách sạn tại {destination || "Đà Nẵng"}
          </h1>

          {/* Mobile filter button trigger */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Bộ lọc</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1677FF] text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Giá bao gồm toàn bộ thuế, phí và ưu đãi đặc quyền MeGo
        </p>
      </div>

      {/* ── Right: Sort dropdown & View switcher ─────────────────────────── */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            ⇅ Sắp xếp:
          </span>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortCriteria)}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="recommended">Đề xuất hàng đầu</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating-desc">Đánh giá cao nhất</option>
            <option value="stars-desc">Hạng sao cao nhất</option>
          </select>
        </div>

        {/* View Switcher: [Danh sách] [Bản đồ] */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "list"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Danh sách</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "map"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Bản đồ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
