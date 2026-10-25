import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_SUGGESTION_TAGS } from "../../data/homeData";

interface HotelSearchFormProps {
  className?: string;
}

export const HotelSearchForm: React.FC<HotelSearchFormProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();

  // Helper date strings (today and 2 days later)
  const today = new Date();
  const formatIsoDate = (d: Date) => d.toISOString().split("T")[0];

  const defaultCheckIn = formatIsoDate(today);
  const defaultCheckOutDate = new Date();
  defaultCheckOutDate.setDate(today.getDate() + 2);
  const defaultCheckOut = formatIsoDate(defaultCheckOutDate);

  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);
  const [guests, setGuests] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(1);
  const [activeTag, setActiveTag] = useState<string>("");

  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState<boolean>(false);
  const guestPopoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
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
    const params = new URLSearchParams();
    if (destination.trim()) {
      params.append("destination", destination.trim());
      params.append("keyword", destination.trim());
    }
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests.toString());
    params.append("rooms", rooms.toString());
    if (activeTag) {
      params.append("type", activeTag);
    }
    navigate(`/hotels?${params.toString()}`);
  };

  const handleTagClick = (tagQuery: string) => {
    if (activeTag === tagQuery) {
      setActiveTag("");
    } else {
      setActiveTag(tagQuery);
      const params = new URLSearchParams();
      if (destination.trim()) params.append("destination", destination.trim());
      params.append("type", tagQuery);
      params.append("checkIn", checkIn);
      params.append("checkOut", checkOut);
      navigate(`/hotels?${params.toString()}`);
    }
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl p-3 sm:p-3.5 shadow-xl border transition-colors duration-200"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Login notice */}
        <div
          className="mb-3 flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-[10px] sm:text-xs"
          style={{
            backgroundColor: "var(--brand-primary-bg)",
            borderColor: "var(--border-default)",
          }}
        >
          <div className="flex min-w-0 items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            <svg className="h-3.5 w-3.5 shrink-0 text-[#1677FF] dark:text-[var(--brand-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="10" width="16" height="11" rx="2" strokeWidth="2" />
              <path d="M8 10V7a4 4 0 018 0v3" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 14v3" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="truncate">Vui lòng đăng nhập để đặt phòng và nhận ưu đãi độc quyền</span>
          </div>
          <button type="button" onClick={() => navigate("/login")} className="shrink-0 font-semibold text-[#1677FF] dark:text-[var(--brand-primary)] hover:underline">
            Đăng nhập ngay
          </button>
        </div>

        {/* Search fields */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.45fr)_minmax(220px,1.05fr)_minmax(155px,1fr)_104px] lg:items-stretch">
          {/* Destination */}
          <div className="flex min-w-0 items-center gap-2 rounded-xl bg-indigo-50 px-2.5 py-2 border border-indigo-50 transition-all focus-within:ring-2 focus-within:ring-blue-300">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#1677FF]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <label htmlFor="search-destination" className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wide leading-tight text-slate-600">Điểm đến hoặc khách sạn</label>
              <input id="search-destination" type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Bạn muốn đi đâu?" className="mt-0.5 w-full min-w-0 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none" />
            </div>
          </div>

          {/* Dates */}
          <div className="flex min-w-0 items-center gap-2 rounded-xl bg-indigo-50 px-2.5 py-2 border border-indigo-50 focus-within:ring-2 focus-within:ring-blue-300">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#1677FF]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2" />
                <path d="M16 3v4M8 3v4M3 10h18" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
              <div className="min-w-0">
                <label htmlFor="checkin-date" className="block text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-slate-600">Nhận phòng</label>
                <input id="checkin-date" type="date" min={defaultCheckIn} value={checkIn} onChange={(e) => handleCheckInChange(e.target.value)} className="mt-0.5 w-full min-w-0 bg-transparent text-[11px] sm:text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer" />
              </div>
              <div className="min-w-0 border-l border-indigo-200 pl-2">
                <label htmlFor="checkout-date" className="block text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-slate-600">Trả phòng</label>
                <input id="checkout-date" type="date" min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-0.5 w-full min-w-0 bg-transparent text-[11px] sm:text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Guests and rooms */}
          <div className="relative min-w-0" ref={guestPopoverRef}>
            <button type="button" onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)} className="flex h-full w-full min-w-0 items-center gap-2 rounded-xl border border-indigo-50 bg-indigo-50 px-2.5 py-2 text-left transition-all hover:bg-indigo-100/70 focus:ring-2 focus:ring-blue-300">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#1677FF]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-slate-600">Số khách & phòng</span>
                <span className="mt-0.5 block truncate text-xs sm:text-sm font-semibold text-slate-900">{guests} người lớn, {rooms} phòng</span>
              </span>
            </button>

            {isGuestPopoverOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border p-4 shadow-xl animate-in fade-in duration-150"
                style={{
                  backgroundColor: "var(--popover-bg)",
                  borderColor: "var(--popover-border)",
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Số khách</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Từ 1 tuổi trở lên</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={guests <= 1}
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border font-bold disabled:opacity-30 transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-surface-secondary)",
                        }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {guests}
                      </span>
                      <button
                        type="button"
                        disabled={guests >= 20}
                        onClick={() => setGuests(guests + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border font-bold disabled:opacity-30 transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-surface-secondary)",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between border-t pt-3"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Số phòng</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Tối đa 10 phòng</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={rooms <= 1}
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border font-bold disabled:opacity-30 transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-surface-secondary)",
                        }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {rooms}
                      </span>
                      <button
                        type="button"
                        disabled={rooms >= 10}
                        onClick={() => setRooms(rooms + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border font-bold disabled:opacity-30 transition-colors"
                        style={{
                          borderColor: "var(--border-default)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--bg-surface-secondary)",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => setIsGuestPopoverOpen(false)} className="w-full rounded-lg bg-blue-50 py-1.5 text-xs font-bold text-[#1677FF] hover:bg-blue-100">Xong</button>
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <button type="submit" className="flex h-[50px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0754D1] px-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98] lg:h-auto lg:min-h-[50px]">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Tìm kiếm</span>
          </button>
        </div>

        {/* Quick suggestion chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px]">
          <span className="mr-0.5 flex items-center gap-1 font-medium text-slate-600">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h6" /></svg>
            Gợi ý nhanh:
          </span>
          {SEARCH_SUGGESTION_TAGS.map((tag) => {
            const isSelected = activeTag === tag.query;
            return (
              <button key={tag.id} type="button" onClick={() => handleTagClick(tag.query)} className={`rounded-full border px-2.5 py-1 font-medium transition-all cursor-pointer ${isSelected ? "border-blue-300 bg-blue-100 text-blue-800" : "border-blue-100 bg-sky-50 text-slate-700 hover:bg-blue-100"}`}>
                {tag.label}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default HotelSearchForm;