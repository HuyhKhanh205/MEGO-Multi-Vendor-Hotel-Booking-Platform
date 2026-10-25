import {
  Favorite,
  LocationOnOutlined,
  Star,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import type { WishlistHotel } from "../types/customer.types";
import { formatVnd } from "../utils/formatters";

type WishlistHotelCardProps = {
  hotel: WishlistHotel;
  onRemove: () => void;
  promo?: string;
  amenities?: string[];
  reviewCount?: number;
};

export function WishlistHotelCard({
  hotel,
  onRemove,
  promo = "Ưu đãi thành viên VIP",
  amenities = ["Buffet sáng", "Hồ bơi vô cực"],
  reviewCount = 0,
}: WishlistHotelCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/60">
      <div className="relative h-44 overflow-hidden">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
        {promo && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0F62FE] px-3 py-1 text-[10px] font-bold text-white shadow-md">
            {promo}
          </span>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Bỏ yêu thích ${hotel.name}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <Favorite sx={{ fontSize: 18 }} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-white">
          <Star sx={{ fontSize: 14, color: "#fbbf24" }} />
          {hotel.stars} Sao · Khách sạn nổi bật
        </div>
      </div>

      <div className="flex min-h-60 flex-col p-3.5">
        <p className="flex items-start gap-1 text-[11px] text-slate-500">
          <LocationOnOutlined sx={{ fontSize: 14, color: "#0F62FE" }} />
          <span className="line-clamp-1">{hotel.location}</span>
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-11 text-base font-bold leading-5 text-slate-900">
          {hotel.name}
        </h2>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-[#0F62FE] px-2 py-1 text-xs font-bold text-white">
            {hotel.rating.toFixed(1)}
          </span>
          <span className="text-[11px] font-semibold text-slate-700">
            {hotel.rating >= 9 ? "Xuất sắc" : hotel.rating >= 8 ? "Tuyệt hảo" : "Rất tốt"}
          </span>
          <span className="text-[11px] text-slate-400">
            ({reviewCount || `${Math.round(hotel.rating * 80)}`} đánh giá)
          </span>
        </div>

        <div className="mt-3 flex min-h-10 flex-wrap content-start gap-1.5">
          {amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-[#0F62FE]">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-[10px] text-slate-400 line-through">
              {formatVnd(Math.round(hotel.priceFrom * 1.2))}
            </p>
            <p className="text-xl font-extrabold leading-6 text-[#0F62FE]">
              {formatVnd(hotel.priceFrom)}
              <span className="ml-1 text-[10px] font-medium text-slate-500">/ đêm</span>
            </p>
          </div>
          <Button
            component={Link}
            to={`/hotels/${hotel.hotelId}`}
            variant="contained"
            size="small"
            sx={{
              minWidth: 76,
              borderRadius: "8px",
              backgroundColor: "#0F62FE",
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.2,
              "&:hover": { backgroundColor: "#0052CC" },
            }}
          >
            Đặt
            <br />
            ngay →
          </Button>
        </div>
      </div>
    </article>
  );
}
