import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Eye,
} from "../../../../components/common/Icons";
import type { RoomImageItem } from "../../../../types/hotel";

interface RoomGalleryProps {
  roomName: string;
  images: RoomImageItem[];
}

export const RoomGallery: React.FC<RoomGalleryProps> = ({
  roomName,
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const safeImages =
    images && images.length > 0
      ? images
      : [
          {
            url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
            label: "Phòng ngủ chính",
          },
        ];

  const total = safeImages.length;
  const currentImage = safeImages[currentIndex] || safeImages[0];

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    },
    [total]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    },
    [total]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <div className="space-y-3.5">
      {/* ── Main Large Photo ── */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/80 cursor-pointer group select-none"
      >
        <img
          src={currentImage.url}
          alt={currentImage.label || roomName}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />

        {/* 360 Degree Tour Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
          <span>Khám phá 360° góc phòng</span>
        </div>

        {/* Click to zoom hint overlay on hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-lg flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#1677FF]" />
            <span>Xem ảnh phóng to</span>
          </span>
        </div>

        {/* Photo Index Indicator (Bottom Left) */}
        <div className="absolute bottom-3.5 left-3.5 px-3 py-1.5 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-xs font-bold tracking-wider">
          {currentIndex + 1} / {total}
          <span className="text-slate-300 font-normal ml-2 text-[11px] hidden sm:inline">
            • {currentImage.label}
          </span>
        </div>

        {/* Prev / Next Navigation Buttons (Bottom Right) */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Ảnh trước"
            className="w-8 h-8 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Ảnh sau"
            className="w-8 h-8 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Thumbnails Bar with Captions ── */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {safeImages.slice(0, 4).map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex flex-col text-left rounded-xl overflow-hidden border transition-all duration-200 group ${
                isActive
                  ? "ring-2 ring-[#1677FF] border-[#1677FF] shadow-sm"
                  : "border-slate-200 hover:border-blue-300 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span
                className={`p-1.5 text-[11px] font-semibold truncate block w-full text-center ${
                  isActive
                    ? "bg-blue-50 text-[#1677FF]"
                    : "bg-white text-slate-600"
                }`}
              >
                {img.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3">
            <div>
              <p className="text-sm font-bold">{roomName}</p>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentImage.label} ({currentIndex + 1} / {total})
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Main Modal Image */}
          <div
            className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.label}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          <div
            className="flex items-center gap-2 mt-4 max-w-2xl overflow-x-auto py-2 px-1"
            onClick={(e) => e.stopPropagation()}
          >
            {safeImages.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  i === currentIndex
                    ? "border-[#1677FF] scale-105"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
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

export default RoomGallery;