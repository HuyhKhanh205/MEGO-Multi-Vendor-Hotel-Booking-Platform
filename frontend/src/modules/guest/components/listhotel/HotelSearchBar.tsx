import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface HotelSearchBarProps {
  className?: string;
  onSearch?: (params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
  }) => void;
}

export const HotelSearchBar: React.FC<HotelSearchBarProps> = ({
  className = "",
  onSearch,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const today = new Date();
  const formatIsoDate = (d: Date) => d.toISOString().split("T")[0];

  const defaultCheckIn = searchParams.get("checkIn") || formatIsoDate(today);
  const defaultCheckOutDate = new Date();
  defaultCheckOutDate.setDate(today.getDate() + 2);
  const defaultCheckOut =
    searchParams.get("checkOut") || formatIsoDate(defaultCheckOutDate);

  const [destination, setDestination] = useState<string>(
    searchParams.get("destination") || searchParams.get("keyword") || ""
  );
  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [guests, setGuests] = useState<number>(
    parseInt(searchParams.get("guests") || "2", 10) || 2
  );
  const [rooms, setRooms] = useState<number>(
    parseInt(searchParams.get("rooms") || "1", 10) || 1
  );

  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState<boolean>(false);
  const guestPopoverRef = useRef<HTMLDivElement>(null);

  // Close guest popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestPopoverRef.current &&
        !guestPopoverRef.current.contains(event.target as Node)
      ) {
        setIsGuestPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn);
    if (newCheckIn >= checkOut) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(formatIsoDate(nextDay));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newParams = new URLSearchParams(searchParams);
    if (destination.trim()) {
      newParams.set("destination", destination.trim());
      newParams.set("keyword", destination.trim());
    } else {
      newParams.delete("destination");
      newParams.delete("keyword");
    }

    newParams.set("checkIn", checkIn);
    newParams.set("checkOut", checkOut);
    newParams.set("guests", guests.toString());
    newParams.set("rooms", rooms.toString());
    newParams.set("page", "1"); // Reset to page 1 on new search

    setSearchParams(newParams);

    if (onSearch) {
      onSearch({
        destination: destination.trim(),
        checkIn,
        checkOut,
        guests,
        rooms,
      });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-center">
          {/* Destination */}
          <div className="md:col-span-4 p-2 sm:p-2.5 bg-gray-50/80 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 rounded-xl border border-gray-200/80 transition-all">
            <label
              htmlFor="hotels-search-dest"
              className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5 flex items-center gap-1"
            >
              <svg
                className="w-3.5 h-3.5 text-[#1677FF]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Điểm đến / Khách sạn
            </label>
            <input
              id="hotels-search-dest"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Đà Nẵng, Nha Trang, Phú Quốc..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Date range */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2 p-2 sm:p-2.5 bg-gray-50/80 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 rounded-xl border border-gray-200/80 transition-all">
            <div>
              <label
                htmlFor="hotels-checkin"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5"
              >
                Nhận phòng
              </label>
              <input
                id="hotels-checkin"
                type="date"
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer"
              />
            </div>
            <div className="border-l border-gray-200 pl-2">
              <label
                htmlFor="hotels-checkout"
                className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5"
              >
                Trả phòng
              </label>
              <input
                id="hotels-checkout"
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="md:col-span-2.5 relative" ref={guestPopoverRef}>
            <button
              type="button"
              onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)}
              className="w-full text-left p-2 sm:p-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl border border-gray-200/80 transition-all cursor-pointer"
            >
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                Khách & Phòng
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {guests} khách • {rooms} phòng
              </span>
            </button>

            {/* Popover */}
            {isGuestPopoverOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 z-50 animate-in fade-in duration-150">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Số khách</p>
                      <p className="text-[10px] text-gray-400">Từ 1 tuổi trở lên</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={guests <= 1}
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-900">
                        {guests}
                      </span>
                      <button
                        type="button"
                        disabled={guests >= 20}
                        onClick={() => setGuests(guests + 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Số phòng</p>
                      <p className="text-[10px] text-gray-400">Tối đa 10 phòng</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={rooms <= 1}
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-gray-900">
                        {rooms}
                      </span>
                      <button
                        type="button"
                        disabled={rooms >= 10}
                        onClick={() => setRooms(rooms + 1)}
                        className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center font-bold text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGuestPopoverOpen(false)}
                    className="w-full py-1.5 bg-blue-50 text-[#1677FF] hover:bg-blue-100 text-xs font-bold rounded-lg transition-colors"
                  >
                    Xong
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-1.5 flex items-center">
            <button
              type="submit"
              className="w-full h-[46px] sm:h-[48px] bg-[#1677FF] hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Tìm</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HotelSearchBar;
