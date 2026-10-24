import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../stores/store";
import {
  RoomDetailHeader,
  RoomGallery,
  RoomQualityGuarantee,
  RoomSpecifications,
  RoomAmenities,
  RoomPolicies,
  RoomBookingBar,
} from "../components/roomdetail";
import { BookingModal } from "../components/detailhotel/BookingModal";
import { HotelsService } from "../../../services/hotels.service";
import { ShieldAlert, ArrowLeft } from "../../../components/common/Icons";

export const RoomDetailPage: React.FC = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Load hotel and room data
  const data = useMemo(() => {
    return HotelsService.getRoomById(hotelId || "", roomId || "");
  }, [hotelId, roomId]);

  // Search parameters for dates and occupancy
  const today = new Date();
  const formatIsoDate = (d: Date) => d.toISOString().split("T")[0];

  const defaultCheckInDate = new Date();
  defaultCheckInDate.setDate(today.getDate() + 2);
  const defaultCheckOutDate = new Date();
  defaultCheckOutDate.setDate(defaultCheckInDate.getDate() + 1);

  const checkIn = searchParams.get("checkIn") || formatIsoDate(defaultCheckInDate);
  const checkOut = searchParams.get("checkOut") || formatIsoDate(defaultCheckOutDate);
  const guests = parseInt(searchParams.get("guests") || "2", 10) || 2;

  // Nights count calculation
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

  // Booking quantity
  const [quantity, setQuantity] = useState<number>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Mandatory Authentication check before booking
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để tiếp tục đặt phòng.", {
        position: "top-right",
      });
      const redirectUrl = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  // Set page document title
  useEffect(() => {
    if (data?.room && data?.hotel) {
      document.title = `${data.room.name} - ${data.hotel.name} | MeGo`;
      window.scrollTo(0, 0);
    }
  }, [data]);

  // Room not found state
  if (!data || !data.room) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Không tìm thấy phòng này
        </h1>
        <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
          Hạng phòng bạn đang tìm kiếm không tồn tại hoặc đã hết phòng trong thời gian đã chọn.
        </p>
        <Link
          to={`/hotels/${hotelId || ""}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1677FF] text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang khách sạn</span>
        </Link>
      </div>
    );
  }

  const { hotel, room } = data;

  return (
    <div className="min-h-screen bg-[#F6F8FC] font-sans pb-28 sm:pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        {/* ── 1. Top Header Bar ── */}
        <RoomDetailHeader
          hotelId={hotel.id}
          hotelName={hotel.name}
          roomName={room.name}
          badge={room.badge}
          stars={hotel.stars}
          rating={room.rating || hotel.rating}
          searchQuery={searchParams.toString()}
        />

        {/* ── 2. Two-Column Main Content (58% Left / 42% Right on Desktop) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          {/* ── Cột trái: Thư viện ảnh + Cam kết chất lượng ── */}
          <div className="space-y-4 sm:space-y-5 min-w-0">
            {/* Gallery with 360 badge, counter, thumbs, and lightbox */}
            <RoomGallery
              roomName={room.name}
              images={room.images || []}
            />

            {/* Quality Guarantee Card */}
            <RoomQualityGuarantee signatureBadge={room.badge} />
          </div>

          {/* ── Cột phải: Thông số + Tiện nghi + Chính sách ── */}
          <div className="space-y-4 sm:space-y-5 min-w-0">
            {/* 4 Room Specifications (2x2 Grid) */}
            <RoomSpecifications
              areaM2={room.areaM2}
              view={room.view}
              bedType={room.bedType}
              maxGuests={room.maxGuests}
            />

            {/* Luxury Amenities by Sub-groups */}
            <RoomAmenities groups={room.amenityGroups || []} />

            {/* Policies and Exclusive Perks */}
            <RoomPolicies
              perks={room.perks || []}
              breakfastIncluded={room.breakfastIncluded}
              freeCancellation={room.freeCancellation}
            />
          </div>
        </div>
      </main>

      {/* ── 3. Fixed Bottom Booking Bar ── */}
      <RoomBookingBar
        originalPrice={room.originalPrice}
        pricePerNight={room.pricePerNight}
        availableRooms={room.availableRooms}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onBookNow={handleBookingClick}
      />

      {/* ── 4. Booking Confirmation Modal ── */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        hotelName={hotel.name}
        room={room}
        quantity={quantity}
        checkIn={checkIn}
        checkOut={checkOut}
        nightsCount={nightsCount}
        guestsCount={guests}
      />
    </div>
  );
};

export default RoomDetailPage;