import { useState, useEffect, useCallback } from "react";
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "../../../../components/common/Icons";

interface HotelGalleryProps {
  hotelName: string;
  coverImage: string;
  images: string[];
  discountPercent?: number;
}

// Fallback high-res hotel images in case the hotel dataset has fewer than 5 photos
const FALLBACK_HOTEL_PHOTOS = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
];

export const HotelGallery = ({
  hotelName,
  coverImage,
  images,
  discountPercent,
}: HotelGalleryProps) => {
  // Combine all images into a rich gallery
  const fullGallery = [
    coverImage,
    ...images.filter((img) => img !== coverImage),
    ...FALLBACK_HOTEL_PHOTOS,
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  const top5 = fullGallery.slice(0, 5);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(
    null
  );

  const isLightboxOpen = activeLightboxIndex !== null;

  const handleNext = useCallback(() => {
    setActiveLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % fullGallery.length
    );
  }, [fullGallery.length]);

  const handlePrev = useCallback(() => {
    setActiveLightboxIndex((prev) =>
      prev === null
        ? 0
        : (prev - 1 + fullGallery.length) % fullGallery.length
    );
  }, [fullGallery.length]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <div className="relative mb-8">
      {/* ── 5-Photo Responsive Grid (Matching HTML Sample) ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-2.5 rounded-3xl overflow-hidden shadow-sm bg-slate-200">
        {/* Main Big Photo (Left 2 cols, row-span 2) */}
        <div
          className="md:col-span-2 md:row-span-2 relative aspect-[16/10] md:aspect-auto md:h-[420px] overflow-hidden group cursor-pointer"
          onClick={() => setActiveLightboxIndex(0)}
        >
          <img
            src={top5[0]}
            alt={`${hotelName} - Ảnh đại diện`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Special discount badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tiết kiệm {discountPercent}% hôm nay
            </span>
          )}
        </div>

        {/* 4 Small Photos (Right 2x2 grid) */}
        {top5.slice(1, 5).map((imgUrl, idx) => {
          const actualIndex = idx + 1;
          const isLastSmall = idx === 3;

          return (
            <div
              key={idx}
              className="relative aspect-[16/10] h-[150px] sm:h-[180px] md:h-[206px] overflow-hidden group cursor-pointer bg-slate-100 hidden sm:block"
              onClick={() => setActiveLightboxIndex(actualIndex)}
            >
              <img
                src={imgUrl}
                alt={`${hotelName} - Góc nhìn ${actualIndex}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />

              {/* View all photos overlay on the last small photo */}
              {isLastSmall && (
                <div className="absolute inset-0 bg-slate-900/60 hover:bg-slate-900/70 transition-colors flex items-center justify-center text-white text-center p-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                    <Camera className="w-4 h-4" />
                    <span>+{fullGallery.length - 4} ảnh khác</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating "Xem tất cả ảnh" button */}
      <button
        type="button"
        onClick={() => setActiveLightboxIndex(0)}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md active:scale-95 transition-all border border-slate-200"
      >
        <Camera className="w-4 h-4 text-[#1677FF]" />
        <span>Xem tất cả {fullGallery.length} ảnh</span>
      </button>

      {/* ── Lightbox Modal ── */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in">
          {/* Lightbox Header */}
          <div className="w-full max-w-6xl flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <h4 className="text-sm sm:text-base font-bold truncate max-w-md">
                {hotelName}
              </h4>
              <p className="text-xs text-slate-400">
                Ảnh {(activeLightboxIndex ?? 0) + 1} trên {fullGallery.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90"
              aria-label="Đóng thư viện ảnh"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Image + Controls */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={fullGallery[activeLightboxIndex ?? 0]}
              alt={`${hotelName} - Ảnh phóng to`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all select-none"
            />

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all active:scale-90 border border-white/20 shadow-lg"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all active:scale-90 border border-white/20 shadow-lg"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Thumbnail Strip */}
          <div className="w-full max-w-4xl overflow-x-auto flex items-center gap-2 py-2 px-2">
            {fullGallery.map((thumb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveLightboxIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                  idx === activeLightboxIndex
                    ? "border-[#1677FF] scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={thumb}
                  alt={`thumb ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
