import { ChevronLeft, ChevronRight } from "../../../../components/common/Icons";

interface HotelPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}

export const HotelPagination = ({
  currentPage,
  totalPages,
  totalItems = 328,
  limit = 4,
  onPageChange,
}: HotelPaginationProps) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4);
      if (totalPages > 5) {
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-4"
      aria-label="Pagination"
    >
      {/* Left text matching image: Hiển thị 1 - 4 trong số 328 nơi lưu trú */}
      <div className="text-xs text-slate-500 font-medium">
        Hiển thị <span className="font-bold text-slate-800">{startItem} - {endItem}</span> trong
        số <span className="font-bold text-slate-800">{totalItems}</span> nơi lưu trú
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Trang trước</span>
        </button>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs">
                  ...
                </span>
              );
            }
            const pageNum = p as number;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#1677FF] text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span>Trang sau</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};
