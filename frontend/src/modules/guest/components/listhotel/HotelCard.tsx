import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Heart,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "../../../../components/common/Icons";
import type { HotelItem } from "../../../../types/hotel";
import { customerApiMethods } from "../../../customer/services/customerApi";
import type { WishlistHotel } from "../../../customer/types/customer.types";

interface HotelCardProps {
  hotel: HotelItem;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const [searchParams] = useSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let active = true;
    void customerApiMethods.getWishlist().then((wishlist) => {
      if (active) {
        setIsFavorite(wishlist.some((item) => item.hotelId === hotel.id));
      }
    });
    return () => {
      active = false;
    };
  }, [hotel.id]);

  const handleToggleFavorite = async () => {
    const wishlist = await customerApiMethods.getWishlist();
    const existing = wishlist.find((item) => item.hotelId === hotel.id);
    if (existing) {
      await customerApiMethods.removeWishlist(existing.id);
      setIsFavorite(false);
      return;
    }

    const wishlistHotel: WishlistHotel = {
      id: hotel.id,
      hotelId: hotel.id,
      name: hotel.name,
      location: `${hotel.district}, ${hotel.city}`,
      stars: hotel.stars,
      rating: hotel.rating,
      priceFrom: hotel.pricePerNight,
      imageUrl: hotel.coverImage,
      addedAt: new Date().toISOString(),
    };
    await customerApiMethods.addWishlist(wishlistHotel);
    setIsFavorite(true);
  };

  const detailLink = `/hotels/${hotel.id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const ratingLabel =
    hotel.rating >= 9.0
      ? "Xuất sắc"
      : hotel.rating >= 8.0
      ? "Rất tốt"
      : hotel.rating >= 7.0
      ? "Tốt"
      : "Hài lòng";

  // Badge configuration based on hotel data
  const isSale = Boolean(hotel.discountPercent && hotel.discountPercent > 0);
  const isBestSeller = hotel.isPopular && !isSale;
  const isHighRating = hotel.rating >= 9.0 && !isSale && !isBestSeller;

  // Extra thumbnails to show below main photo (3 images)
  const thumbnails = (hotel.images && hotel.images.length > 1 ? hotel.images.slice(1, 4) : [
    hotel.coverImage,
    hotel.coverImage,
    hotel.coverImage,
  ]);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-3 sm:p-4 flex flex-col lg:flex-row gap-4">
      {/* ── 1. LEFT COLUMN: Main Photo + 3 Thumbnails ────────────────────── */}
      <div className="w-full lg:w-[270px] xl:w-[290px] shrink-0 flex flex-col gap-2">
        {/* Main Photo */}
        <div className="relative aspect-[16/10] lg:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
          <Link to={detailLink} className="block w-full h-full">
            <img
              src={hotel.coverImage}
              alt={hotel.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          </Link>

          {/* Top-Left Badge */}
          {isSale && (
            <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-[#1677FF] text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
              % Tiết kiệm {hotel.discountPercent}%
            </span>
          )}
          {isBestSeller && (
            <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-amber-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
              ⚡ Bán chạy nhất
            </span>
          )}
          {isHighRating && (
            <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
              👍 Được đánh giá cao
            </span>
          )}

          {/* Top-Right Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleToggleFavorite();
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${
              isFavorite
                ? "bg-white text-red-500"
                : "bg-white/85 text-slate-600 hover:bg-white hover:text-red-500"
            }`}
            aria-label={isFavorite ? "Bỏ lưu" : "Lưu yêu thích"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          {/* Bottom-Left Photo Count */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-medium flex items-center gap-1">
            <span>📷</span>
            <span>{hotel.images?.length || 18} ảnh</span>
          </div>
        </div>

        {/* 3 Thumbnails Strip */}
        <div className="grid grid-cols-3 gap-1.5">
          {thumbnails.map((img, idx) => (
            <div key={idx} className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
              <img
                src={img}
                alt={`${hotel.name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === 2 && hotel.images && hotel.images.length > 4 && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-[11px] font-bold">
                  +{hotel.images.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. CENTER COLUMN: Hotel Information & Highlights ─────────────── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {/* Top Row: Stars + Category */}
          <div className="flex items-center gap-1.5 mb-1 text-amber-400">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs text-slate-600 font-medium ml-1">
              {hotel.stars} sao {hotel.stars === 5 ? "cao cấp" : ""}
            </span>
          </div>

          {/* Hotel Name */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors line-clamp-1 mb-1.5">
            <Link to={detailLink}>{hotel.name}</Link>
          </h3>

          {/* Location & Beach / Center distance */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{hotel.address}</span>
            {hotel.distanceToBeach && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">cách biển {hotel.distanceToBeach}</span>
              </>
            )}
            <Link
              to={`/hotels?view=map&destination=${encodeURIComponent(hotel.city)}`}
              className="text-[#1677FF] font-semibold hover:underline ml-1"
            >
              xem bản đồ
            </Link>
          </div>

          {/* Amenity Pills with Soft Blue / Gray Styling */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 4).map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F0F6FF] text-[#1677FF] text-xs font-medium"
              >
                <span>✓</span>
                <span>{a}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Urgency / Offer Note */}
        <div className="pt-2">
          {hotel.isPopular ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50/70 px-2.5 py-1 rounded-md border border-red-100">
              <span>🔥</span>
              <span>Chỉ còn 2 phòng giá này!</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/70 px-2.5 py-1 rounded-md border border-blue-100">
              <Sparkles className="w-3 h-3 text-[#1677FF]" />
              <span>Được đề xuất nhiều nhất trên MeGo</span>
            </span>
          )}
        </div>
      </div>

      {/* ── 3. RIGHT COLUMN: Rating Badge + Pricing + CTA ─────────────────── */}
      <div className="w-full lg:w-[220px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4 flex flex-row lg:flex-col justify-between items-end lg:items-end gap-3">
        {/* Top: Review Rating Block */}
        <div className="flex items-center gap-2 self-start lg:self-end">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {hotel.ratingText || ratingLabel}
            </p>
            <p className="text-[11px] text-slate-400">
              {hotel.reviewCount} đánh giá
            </p>
          </div>
          <span className="w-9 h-8 rounded-lg bg-[#1677FF] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
            {hotel.rating.toFixed(1)}
          </span>
        </div>

        {/* Middle: Policy Benefit Badge */}
        <div className="text-right hidden sm:block">
          {hotel.policies.freeCancellation ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              Miễn phí hủy phòng trước 24h
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              ⚡ Xác nhận tức thì
            </span>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Giá ưu đãi độc quyền
          </p>
        </div>

        {/* Bottom: Pricing & CTA Button */}
        <div className="text-right w-full flex flex-col items-end">
          {hotel.originalPrice && (
            <p className="text-xs text-slate-400 line-through leading-tight">
              {hotel.originalPrice.toLocaleString("vi-VN")}₫
            </p>
          )}
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#1677FF] leading-tight">
              {hotel.pricePerNight.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-xs text-slate-500 font-normal">/ đêm</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 mb-3">
            Đã bao gồm thuế & phí
          </p>

          {/* Primary CTA Button */}
          <Link
            to={detailLink}
            className="w-full sm:w-auto lg:w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all duration-200"
          >
            <span>Xem phòng</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};
