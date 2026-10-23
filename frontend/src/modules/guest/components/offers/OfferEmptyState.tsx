import React from "react";
import { SearchX, RotateCcw } from "../../../../components/common/Icons";

interface OfferEmptyStateProps {
  onResetFilters: () => void;
}

export const OfferEmptyState: React.FC<OfferEmptyStateProps> = ({
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">
        Không tìm thấy ưu đãi phù hợp
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
        Rất tiếc, hiện chưa có chương trình hoặc khách sạn giảm giá nào phù hợp với các tiêu chí tìm kiếm của bạn. Hãy thử thay đổi điểm đến hoặc đặt lại bộ lọc.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#1677FF] hover:bg-[#0039B3] transition-all shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại tất cả bộ lọc</span>
        </button>
      </div>
    </div>
  );
};

export default OfferEmptyState;
