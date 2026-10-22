import { useEffect } from "react";
import { X, RotateCcw } from "../../../../components/common/Icons";
import { HotelFilters } from "./HotelFilters";
import type { HotelFilterState } from "../../../../types/hotel";

interface HotelFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: HotelFilterState;
  onFiltersChange: (next: HotelFilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export const HotelFiltersDrawer = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
  totalCount,
}: HotelFiltersDrawerProps) => {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            Bộ lọc tìm kiếm
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Đóng bộ lọc"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <HotelFilters
            filters={filters}
            onChange={onFiltersChange}
            onReset={onReset}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Thiết lập lại</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-center"
          >
            Áp dụng ({totalCount})
          </button>
        </div>
      </div>
    </div>
  );
};
