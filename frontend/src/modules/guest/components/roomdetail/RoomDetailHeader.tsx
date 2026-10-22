import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Star, Sparkles } from "../../../../components/common/Icons";

interface RoomDetailHeaderProps {
  hotelId: string;
  hotelName: string;
  roomName: string;
  badge?: string;
  stars?: number;
  rating?: number;
  searchQuery?: string;
}

export const RoomDetailHeader: React.FC<RoomDetailHeaderProps> = ({
  hotelId,
  hotelName,
  roomName,
  badge = "Hạng Sang Biển Trực Diện",
  stars = 5,
  rating = 9.8,
  searchQuery = "",
}) => {
  const backLink = `/hotels/${hotelId}${searchQuery ? `?${searchQuery}` : ""}`;

  return (
    <div className="space-y-3 pb-4 border-b border-slate-200/80">
      {/* Top back breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link
          to={backLink}
          className="inline-flex items-center gap-1 text-[#1677FF] hover:underline hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Quay lại {hotelName}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-[240px] sm:max-w-none">
          {roomName}
        </span>
      </div>

      {/* Main Room Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Blue dot indicator */}
          <span className="w-3 h-3 rounded-full bg-[#1677FF] ring-4 ring-blue-100 shrink-0" />

          {/* Room Name */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {roomName}
          </h1>

          {/* Room Badge */}
          {badge && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-200 shadow-2xs">
              <Sparkles className="w-3 h-3" />
              <span>{badge}</span>
            </span>
          )}
        </div>

        {/* Rating and Stars */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center text-amber-400 gap-0.5">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg shadow-2xs">
            <span className="text-xs font-extrabold">{rating.toFixed(1)}</span>
            <span className="text-[10px] font-medium text-blue-100 hidden sm:inline">
              Xuất sắc
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailHeader;