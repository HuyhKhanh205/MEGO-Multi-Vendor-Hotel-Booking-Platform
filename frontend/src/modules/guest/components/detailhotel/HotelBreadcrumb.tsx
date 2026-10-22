import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Heart,
  Share2,
} from "../../../../components/common/Icons";
import { toast } from "react-toastify";

interface HotelBreadcrumbProps {
  hotelName: string;
  city: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const HotelBreadcrumb = ({
  hotelName,
  city,
  isFavorite,
  onToggleFavorite,
}: HotelBreadcrumbProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${hotelName} - MeGo`,
          text: `Đặt phòng khách sạn ${hotelName} tại ${city} với giá tốt nhất trên MeGo`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết khách sạn vào bộ nhớ tạm!");
    }
  };

  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-[68px] z-30 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Breadcrumb Path */}
        <nav
          className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap min-w-0"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#1677FF] transition-colors shrink-0"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link
            to="/hotels"
            className="hover:text-[#1677FF] transition-colors shrink-0 font-medium text-slate-700"
          >
            Khách sạn
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <Link
            to={`/hotels?destination=${encodeURIComponent(city)}`}
            className="hover:text-[#1677FF] transition-colors shrink-0 hidden sm:inline"
          >
            {city}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 hidden sm:inline" />
          <span className="font-semibold text-slate-900 truncate">
            {hotelName}
          </span>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
            title="Chia sẻ khách sạn này"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all active:scale-95 ${
              isFavorite
                ? "bg-red-50 border-red-200 text-red-600"
                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-red-500"
            }`}
            title={isFavorite ? "Bỏ lưu khỏi yêu thích" : "Lưu vào yêu thích"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {isFavorite ? "Đã lưu" : "Lưu yêu thích"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
