import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BedDouble,
  Users,
  Maximize2,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Eye,
} from "../../../../components/common/Icons";
import type { HotelRoom } from "../../../../types/hotel";

interface RoomCardProps {
  hotelId?: string;
  room: HotelRoom;
  nightsCount: number;
  onBookNow: (room: HotelRoom, quantity: number) => void;
}

export const RoomCard = ({
  hotelId,
  room,
  nightsCount,
  onBookNow,
}: RoomCardProps) => {
  const [searchParams] = useSearchParams();
  const [quantity, setQuantity] = useState<number>(1);
  const maxAvailable = room.availableRooms || 3;
  const isSoldOut = maxAvailable <= 0;

  const roomDetailLink = hotelId
    ? `/hotels/${hotelId}/rooms/${room.id}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`
    : "#";

  const totalPrice = room.pricePerNight * nightsCount * quantity;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxAvailable, prev + 1));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 p-5 sm:p-6 transition-all duration-300 shadow-xs flex flex-col md:flex-row gap-5 group">
      {/* ── 1. Room Image & Status ── */}
      <div className="w-full md:w-64 lg:w-72 shrink-0 rounded-2xl overflow-hidden aspect-[16/11] md:aspect-auto h-52 bg-slate-100 relative">
        {hotelId ? (
          <Link to={roomDetailLink} className="block w-full h-full">
            <img
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        ) : (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Availability Badge */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          {isSoldOut ? (
            <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow-xs">
              Hết phòng
            </span>
          ) : maxAvailable <= 3 ? (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold shadow-xs">
              Chỉ còn {maxAvailable} phòng trống!
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-medium">
              Còn {maxAvailable} phòng
            </span>
          )}
        </div>
      </div>

      {/* ── 2. Room Details & Specs ── */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#1677FF] transition-colors">
              {hotelId ? (
                <Link to={roomDetailLink} className="hover:underline">
                  {room.name}
                </Link>
              ) : (
                room.name
              )}
            </h3>
            {hotelId && (
              <Link
                to={roomDetailLink}
                className="text-xs font-bold text-[#1677FF] hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
              >
                <span>Chi tiết phòng</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Specifications Pills */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 mb-3.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <BedDouble className="w-4 h-4 text-slate-400" />
              {room.bedType}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <Users className="w-4 h-4 text-slate-400" />
              Tối đa {room.maxGuests} khách
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              {room.areaM2} m²
            </span>
            <span className="inline-flex items-center gap-1.5 text-blue-600 font-medium">
              <Eye className="w-4 h-4 text-blue-400" />
              Hướng nhìn thoáng đãng
            </span>
          </div>

          {/* Included Policies Checklist */}
          <div className="space-y-1.5 text-xs mb-3">
            {room.breakfastIncluded ? (
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <Coffee className="w-3.5 h-3.5 shrink-0" />
                <span>Bao gồm bữa sáng buffet miễn phí mỗi ngày</span>
              </div>
            ) : (
              <div className="text-slate-400">
                • Bữa sáng có phụ thu tại nhà hàng
              </div>
            )}

            {room.freeCancellation ? (
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hủy phòng miễn phí trước 24h</span>
              </div>
            ) : (
              <div className="text-slate-500">
                • Chính sách hủy phòng có điều kiện
              </div>
            )}
          </div>

          {/* Room Amenities Chips */}
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3. Bottom Price, Room Quantity Selector & CTA ── */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          {/* Price Calculation */}
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              Giá 1 đêm / 1 phòng
            </span>
            <div className="flex items-baseline gap-2">
              {room.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {room.originalPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
              <span className="text-xl sm:text-2xl font-extrabold text-[#1677FF]">
                {room.pricePerNight.toLocaleString("vi-VN")}₫
              </span>
            </div>
            {nightsCount > 1 && (
              <span className="text-xs text-slate-500 block font-medium mt-0.5">
                Tạm tính cho {nightsCount} đêm (x{quantity} phòng):{" "}
                <span className="font-bold text-slate-900">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </span>
              </span>
            )}
            <span className="text-[10px] text-slate-400 block">
              Đã bao gồm thuế GTGT & phí dịch vụ
            </span>
          </div>

          {/* Quantity Selector + CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => onBookNow(room, quantity)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all text-center"
            >
              <span>{isSoldOut ? "Hết phòng" : "Đặt ngay"}</span>
              {!isSoldOut && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
