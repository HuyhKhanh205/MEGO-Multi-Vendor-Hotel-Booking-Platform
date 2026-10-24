import { useState, useMemo } from "react";
import { RoomCard } from "./RoomCard";
import { BedDouble, Check } from "../../../../components/common/Icons";
import type { HotelRoom } from "../../../../types/hotel";

interface RoomListProps {
  hotelId?: string;
  rooms?: HotelRoom[];
  nightsCount: number;
  checkInDate: string;
  onBookNow: (room: HotelRoom, quantity: number) => void;
}

type RoomFilterTab = "all" | "breakfast" | "cancellation" | "family";

export const RoomList = ({
  hotelId,
  rooms = [],
  nightsCount,
  checkInDate,
  onBookNow,
}: RoomListProps) => {
  const [activeTab, setActiveTab] = useState<RoomFilterTab>("all");

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (activeTab === "breakfast") return room.breakfastIncluded;
      if (activeTab === "cancellation") return room.freeCancellation;
      if (activeTab === "family") return room.maxGuests >= 3;
      return true;
    });
  }, [rooms, activeTab]);

  return (
    <section id="rooms-section" className="space-y-5">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Chọn phòng còn trống
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ngày nhận phòng: <span className="font-semibold text-slate-800">{checkInDate}</span> ({nightsCount} đêm)
          </p>
        </div>

        {/* Room Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-[#1677FF] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tất cả ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("breakfast")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === "breakfast"
                ? "bg-white text-[#1677FF] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {activeTab === "breakfast" && <Check className="w-3 h-3 text-[#1677FF]" />}
            Bao gồm bữa sáng
          </button>
      
          <button
            type="button"
            onClick={() => setActiveTab("family")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === "family"
                ? "bg-white text-[#1677FF] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {activeTab === "family" && <Check className="w-3 h-3 text-[#1677FF]" />}
            Gia đình (3+)
          </button>
        </div>
      </div>

      {/* ── Rooms Stack ── */}
      {filteredRooms.length > 0 ? (
        <div className="space-y-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              hotelId={hotelId}
              room={room}
              nightsCount={nightsCount}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 text-center text-slate-500 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BedDouble className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Không có phòng nào phù hợp với bộ lọc đã chọn
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="text-xs text-[#1677FF] font-bold hover:underline"
          >
            Xem lại tất cả các phòng
          </button>
        </div>
      )}
    </section>
  );
};
