import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../stores/store";
import { ArrowLeft, ShieldAlert } from "../../../components/common/Icons";
import {
  HotelBreadcrumb,
  HotelHeaderInfo,
  HotelGallery,
  HotelOverview,
  HotelAmenities,
  RoomList,
  BookingSummaryCard,
  HotelReviews,
  HotelPolicies,
  HotelLocation,
} from "../components/detailhotel";
import { HotelsService } from "../../../services/hotels.service";
import type { HotelRoom } from "../../../types/hotel";

export const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // 1. Get Hotel Data
  const hotel = useMemo(() => {
    return HotelsService.getHotelById(id || "");
  }, [id]);

  // 2. State for Dates & Guests
  const today = new Date();
  const formatIsoDate = (d: Date) => d.toISOString().split("T")[0];

  const defaultCheckInDate = new Date();
  defaultCheckInDate.setDate(today.getDate() + 2);
  const defaultCheckOutDate = new Date();
  defaultCheckOutDate.setDate(defaultCheckInDate.getDate() + 1);

  const checkIn = searchParams.get("checkIn") || formatIsoDate(defaultCheckInDate);
  const checkOut = searchParams.get("checkOut") || formatIsoDate(defaultCheckOutDate);
  const guests = parseInt(searchParams.get("guests") || "2", 10) || 2;
  const rooms = parseInt(searchParams.get("rooms") || "1", 10) || 1;

  // Calculate nights
  const nightsCount = useMemo(() => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  // 3. User interaction state
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<string>("overview");

  // Title & Scroll to top
  useEffect(() => {
    if (hotel) {
      document.title = `${hotel.name} - Đặt phòng giá tốt | MeGo`;
      window.scrollTo(0, 0);
    }
  }, [hotel]);

  // Helper to update dates in URL
  const updateDates = (newCheckIn: string, newCheckOut: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("checkIn", newCheckIn);
    nextParams.set("checkOut", newCheckOut);
    setSearchParams(nextParams, { replace: true });
  };

  const handleCheckInChange = (newIn: string) => {
    if (newIn >= checkOut) {
      const nextDay = new Date(newIn);
      nextDay.setDate(nextDay.getDate() + 1);
      updateDates(newIn, formatIsoDate(nextDay));
    } else {
      updateDates(newIn, checkOut);
    }
  };

  const handleCheckOutChange = (newOut: string) => {
    if (newOut > checkIn) {
      updateDates(checkIn, newOut);
    }
  };

  const handleGuestsChange = (val: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("guests", val.toString());
    setSearchParams(nextParams, { replace: true });
  };

  const handleRoomsChange = (val: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("rooms", val.toString());
    setSearchParams(nextParams, { replace: true });
  };

  // Scroll to section helpers
  const scrollToSection = (idStr: string) => {
    setActiveNavTab(idStr);
    const el = document.getElementById(idStr);
    if (el) {
      const yOffset = -140;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Chuyển thông tin khách sạn/phòng đã chọn sang form checkout.
  const handleOpenBooking = (room: HotelRoom, quantity: number) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục đặt phòng.", {
        position: "top-right",
      });
      const redirectUrl = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    navigate("/customer/checkout", {
      state: {
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImageUrl: hotel.coverImage,
        roomTypeId: room.id,
        roomName: room.name,
        roomPricePerNight: room.pricePerNight,
        checkIn,
        checkOut,
        rooms: quantity,
        guests,
      },
    });
  };

  // 4. Hotel Not Found State
  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Không tìm thấy khách sạn
        </h1>
        <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
          Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã ngừng phục vụ trên
          hệ thống MeGo.
        </p>
        <Link
          to="/hotels"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1677FF] text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách khách sạn</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 lg:pb-16">
      {/* ── 1. Top Breadcrumbs Bar with Action Buttons ── */}
      <HotelBreadcrumb
        hotelName={hotel.name}
        city={hotel.city}
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite(!isFavorite)}
      />

      {/* ── 2. Main Page Container (Max 1440px) ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* Hotel Header Info Title, Stars, Address & Review Rating */}
        <HotelHeaderInfo
          hotel={hotel}
          onScrollToLocation={() => scrollToSection("location-section")}
          onScrollToReviews={() => scrollToSection("reviews-section")}
        />

        {/* 5-Photo Gallery Grid + Fullscreen Lightbox */}
        <HotelGallery
          hotelName={hotel.name}
          coverImage={hotel.coverImage}
          images={hotel.images || []}
          discountPercent={hotel.discountPercent}
        />

        {/* Sticky Secondary Navigation Bar */}
        <div className="sticky top-[116px] z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-1 mb-6 shadow-xs flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => scrollToSection("overview-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "overview-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tổng quan
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("amenities-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "amenities-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tiện nghi
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("rooms-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "rooms-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chọn phòng ({hotel.rooms?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("policies-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "policies-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Chính sách
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("reviews-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "reviews-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Đánh giá ({hotel.reviewCount})
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("location-section")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeNavTab === "location-section"
                ? "bg-[#1677FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Vị trí
          </button>
        </div>

        {/* ── 3. Two-Column Main Content Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)] gap-6 lg:gap-8 items-start">
          {/* ── Left Column (~68%): Detailed Sections ── */}
          <div className="space-y-8 min-w-0">
            {/* Overview Section */}
            <div id="overview-section">
              <HotelOverview
                description={hotel.description}
                hotelName={hotel.name}
                city={hotel.city}
              />
            </div>

            {/* Amenities Section */}
            <div id="amenities-section">
              <HotelAmenities amenities={hotel.amenities || []} />
            </div>

            {/* Room List & Room Selection */}
            <RoomList
              hotelId={hotel.id}
              rooms={hotel.rooms || []}
              nightsCount={nightsCount}
              checkInDate={checkIn}
              onBookNow={handleOpenBooking}
            />

            {/* Hotel Policies Section */}
            <div id="policies-section">
              <HotelPolicies
                checkInTime={hotel.policies?.checkInTime || "14:00"}
                checkOutTime={hotel.policies?.checkOutTime || "12:00"}
                payAtHotel={Boolean(hotel.policies?.payAtHotel)}
                freeCancellation={Boolean(hotel.policies?.freeCancellation)}
              />
            </div>

            {/* Customer Reviews Section */}
            <HotelReviews
              rating={hotel.rating}
              ratingText={hotel.ratingText}
              reviewCount={hotel.reviewCount}
            />

            {/* Location & Map Section */}
            <HotelLocation
              hotelName={hotel.name}
              address={hotel.address}
              city={hotel.city}
              district={hotel.district}
              location={hotel.location}
            />
          </div>

          {/* ── Right Column (~32%): Sticky Booking Summary Card ── */}
          <div className="hidden lg:block sticky top-[176px]">
            <BookingSummaryCard
              startingPrice={hotel.pricePerNight}
              originalPrice={hotel.originalPrice}
              discountPercent={hotel.discountPercent}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              rooms={rooms}
              nightsCount={nightsCount}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              onGuestsChange={handleGuestsChange}
              onRoomsChange={handleRoomsChange}
              onScrollToRooms={() => scrollToSection("rooms-section")}
            />
          </div>
        </div>
      </main>

      {/* ── 4. Mobile Fixed Bottom Sticky Action Bar (< lg) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Giá mỗi đêm từ</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#1677FF]">
              {hotel.pricePerNight.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-[11px] text-slate-500">/ đêm</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("rooms-section")}
          className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all text-center"
        >
          Chọn phòng ngay
        </button>
      </div>

    </div>
  );
};

export default HotelDetailPage;
