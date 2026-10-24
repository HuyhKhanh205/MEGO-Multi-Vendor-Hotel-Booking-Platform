import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import BookingProgress from "../components/BookingProgress";
import BookingSummary from "../components/BookingSummary";
import customerData from "../data/dataCustomer.json";
import {
  fetchBookingDraft,
  updateBookingDraft,
  type BookingDraftPayload,
} from "../services/customerApi";
import { saveBookingCheckoutSession } from "../services/bookingSession";

type GuestType = "myself" | "other";

const selectedBooking = customerData.booking;
const selectedRoom = selectedBooking.room;
const holdExpiryStorageKey = `mego-booking-hold-expiry-${selectedBooking.id}`;
const holdDurationSeconds = customerData.paymentPage.holdDurationSeconds;

const getRemainingHoldSeconds = () => {
  const storedExpiry = window.sessionStorage.getItem(holdExpiryStorageKey);
  const expiry = storedExpiry ? Number(storedExpiry) : Date.now() + holdDurationSeconds * 1000;

  if (!storedExpiry || !Number.isFinite(expiry)) {
    window.sessionStorage.setItem(holdExpiryStorageKey, String(Date.now() + holdDurationSeconds * 1000));
    return holdDurationSeconds;
  }

  return Math.max(Math.ceil((expiry - Date.now()) / 1000), 0);
};

const BookingForm = () => {
  const navigate = useNavigate();
  const [guestType, setGuestType] = useState<GuestType>("myself");
  const [promoCode, setPromoCode] = useState(selectedBooking.price.promotion.code);
  const [promoApplied, setPromoApplied] = useState(false);
  const [clubMember, setClubMember] = useState(false);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState(selectedBooking.checkIn);
  const [checkOut, setCheckOut] = useState(selectedBooking.checkOut);
  const [fullName, setFullName] = useState(selectedBooking.contact.fullName);
  const [email, setEmail] = useState(selectedBooking.contact.email);
  const [phone, setPhone] = useState(selectedBooking.contact.phone);
  const [citizenId, setCitizenId] = useState(selectedBooking.contact.citizenId);
  const [accompanyingGuest, setAccompanyingGuest] = useState("");
  const [accompanyingPhone, setAccompanyingPhone] = useState("");
  const [accompanyingCitizenId, setAccompanyingCitizenId] = useState("");
  const [note, setNote] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(getRemainingHoldSeconds);
  const [formError, setFormError] = useState("");
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "offline">("loading");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (remainingSeconds === 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds(getRemainingHoldSeconds());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  useEffect(() => {
    let isMounted = true;

    const loadBookingDraft = async () => {
      try {
        const draft = await fetchBookingDraft(customerData.booking.id);
        if (!isMounted) return;

        setGuestType(draft.guestType === "OTHER_GUEST" ? "other" : "myself");
        setFullName(draft.contact.fullName);
        setEmail(draft.contact.email);
        setPhone(draft.contact.phone);
        setCitizenId(draft.contact.citizenId);
        setAccompanyingGuest(draft.stayingGuest?.fullName ?? "");
        setAccompanyingPhone(draft.stayingGuest?.phone ?? "");
        setAccompanyingCitizenId(draft.stayingGuest?.citizenId ?? "");
        setCheckIn(draft.checkIn);
        setCheckOut(draft.checkOut);
        setSpecialRequests(draft.specialRequests);
        setNote(draft.note);
        setPromoCode(draft.promotionCode ?? "");
        setClubMember(false);
        setApiStatus("connected");
      } catch {
        if (isMounted) setApiStatus("offline");
      }
    };

    void loadBookingDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  const requests = [
    "Phòng tầng cao yên tĩnh",
    "1 giường đôi lớn (King Bed)",
    "Phòng không hút thuốc",
    "Check-in muộn (sau 18:00)",
  ];

  const toggleRequest = (request: string) => {
    setSpecialRequests((current) =>
      current.includes(request)
        ? current.filter((item) => item !== request)
        : [...current, request],
    );
  };

  const discount = promoApplied ? selectedBooking.price.promotion.discountAmount : 0;
  const clubDiscount = clubMember
    ? Math.min(selectedBooking.price.pointsDiscount.discountAmount, 50_000)
    : 0;
  const roomTotal = selectedBooking.price.roomPricePerNight * selectedBooking.numberOfNights;
  const total = roomTotal + selectedBooking.price.serviceFee + selectedBooking.price.vat - discount - clubDiscount;
  const isExpired = remainingSeconds === 0;
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  const handleContinue = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !citizenId.trim()) {
      setFormError("Vui lòng điền đầy đủ họ tên, email, số điện thoại và CCCD của người đặt.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Email chưa đúng định dạng.");
      return;
    }

    if (!/^\d{9}(\d{3})?$/.test(citizenId.replace(/\s/g, ""))) {
      setFormError("CCCD phải gồm 9 hoặc 12 chữ số.");
      return;
    }

    if (
      guestType === "other" &&
      (!accompanyingGuest.trim() ||
        !accompanyingPhone.trim() ||
        !accompanyingCitizenId.trim())
    ) {
      setFormError("Vui lòng điền đầy đủ họ tên, số điện thoại và CCCD của khách lưu trú.");
      return;
    }

    if (guestType === "other" && !/^\d{9}(\d{3})?$/.test(accompanyingCitizenId.replace(/\s/g, ""))) {
      setFormError("CCCD của khách lưu trú phải gồm 9 hoặc 12 chữ số.");
      return;
    }

    const payload: BookingDraftPayload = {
      bookingId: customerData.booking.id,
      guestType: guestType === "other" ? "OTHER_GUEST" : "PRIMARY_GUEST",
      contact: { fullName, email, phone, citizenId },
      stayingGuest: guestType === "other"
        ? { fullName: accompanyingGuest, phone: accompanyingPhone, citizenId: accompanyingCitizenId }
        : null,
      checkIn,
      checkOut,
      specialRequests,
      note,
      promotionCode: promoApplied ? promoCode.toUpperCase() : null,
      useMeGoPoints: clubMember,
    };

    saveBookingCheckoutSession({
      ...payload,
      promotionDiscount: discount,
      pointsDiscount: clubDiscount,
      total,
      paymentMethodId: customerData.paymentOptions[0].id,
    });
    setIsSaving(true);
    navigate("/customer/payment");
    try {
      await updateBookingDraft(payload);
      setFormError("Đã lưu thông tin đặt phòng. Có thể chuyển sang bước thanh toán.");
      setApiStatus("connected");
    } catch {
      setFormError("Không thể lưu thông tin lên máy chủ. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#17233c]">
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <BookingProgress activeStep={1} />

        <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#eaf2ff] px-4 py-3 text-xs text-[#31527f] shadow-sm">
          <InfoOutlinedIcon className="mt-0.5 shrink-0 text-[#1677ff]" sx={{ fontSize: 15 }} />
          <p>
            <strong>Giữ đơn đặt phòng trong</strong>{" "}
            <strong className="text-[#ed4d65]">{minutes}:{seconds}</strong> phút.
          </p>
          <span className="ml-auto hidden items-center gap-1 whitespace-nowrap sm:flex">
          <ShieldOutlinedIcon sx={{ fontSize: 14 }} /> Cam kết giữ phòng yên tâm
          </span>
        </div>
        <p className="mb-4 text-[11px] text-[#71809c]">
          {apiStatus === "loading" && "Đang tải thông tin đặt phòng..."}
          {apiStatus === "connected" && "Đã đồng bộ thông tin với máy chủ."}
          {apiStatus === "offline" && "Đang dùng dữ liệu tạm thời. Máy chủ chưa kết nối, bạn vẫn có thể hoàn thiện biểu mẫu."}
        </p>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <div className="space-y-5">
            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="1" title="Thông tin người đặt & liên hệ" badge="BẮT BUỘC" />
              <p className="mb-4 text-[11px] text-[#8b94a7]">
                Xác nhận để đảm bảo thông tin chính xác cho việc đặt phòng.
              </p>

              <div className="mb-4 rounded-lg border border-[#8adfd0] bg-[#e9fbf7] px-3 py-3 text-xs">
                <div>
                  <p className="font-semibold text-[#176b61]">Đã liên kết tài khoản</p>
                  <p className="mt-1 text-[10px] text-[#43847d]">{email || "chưa cập nhật email"}</p>
                </div>
              </div>

              <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Họ và Tên đầy đủ <span className="text-[#ed4d65]">*</span></label>
              <input aria-label="Họ và tên" className="mb-4 w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none focus:ring-2 focus:ring-[#b9d2ff]" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Email và xác nhận <span className="text-[#ed4d65]">*</span></label>
                  <input type="email" aria-label="Email" className="w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none focus:ring-2 focus:ring-[#b9d2ff]" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Số điện thoại liên hệ <span className="text-[#ed4d65]">*</span></label>
                  <input type="tel" aria-label="Số điện thoại" className="w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none focus:ring-2 focus:ring-[#b9d2ff]" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Số CCCD/Hộ chiếu <span className="text-[#ed4d65]">*</span></label>
                  <input inputMode="numeric" aria-label="Số CCCD hoặc hộ chiếu" className="w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none focus:ring-2 focus:ring-[#b9d2ff]" value={citizenId} onChange={(event) => setCitizenId(event.target.value)} placeholder="Nhập 9 hoặc 12 chữ số" />
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="2" title="Thông tin khách lưu trú" />
              <p className="mb-4 text-[11px] text-[#8b94a7]">Xác định danh tính người đi cùng để thuận tiện quản lý đặt phòng tại khách sạn.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <GuestChoice active={guestType === "myself"} onClick={() => setGuestType("myself")} title="Tôi là người lưu trú chính" description="Thông tin phòng sẽ gửi đến email của bạn" />
                <GuestChoice active={guestType === "other"} onClick={() => setGuestType("other")} title="Đặt phòng hộ người khác" description="Cần điền thêm thông tin khách" />
              </div>
              {guestType === "other" && (
                <div className="mt-3 rounded-lg border border-[#d8e3f8] bg-[#f7f9ff] p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#263b68]">
                    Thông tin người lưu trú
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Họ và tên <span className="text-[#ed4d65]">*</span></label>
                      <input aria-label="Họ và tên người lưu trú" className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-xs text-[#58647c] outline-none ring-1 ring-[#e4eaf5] focus:ring-2 focus:ring-[#b9d2ff]" value={accompanyingGuest} onChange={(event) => setAccompanyingGuest(event.target.value)} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Số điện thoại <span className="text-[#ed4d65]">*</span></label>
                      <input type="tel" aria-label="Số điện thoại người lưu trú" className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-xs text-[#58647c] outline-none ring-1 ring-[#e4eaf5] focus:ring-2 focus:ring-[#b9d2ff]" value={accompanyingPhone} onChange={(event) => setAccompanyingPhone(event.target.value)} placeholder="Nhập số điện thoại" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Số CCCD/Hộ chiếu <span className="text-[#ed4d65]">*</span></label>
                      <input inputMode="numeric" aria-label="CCCD người lưu trú" className="w-full rounded-lg border-0 bg-white px-3 py-2.5 text-xs text-[#58647c] outline-none ring-1 ring-[#e4eaf5] focus:ring-2 focus:ring-[#b9d2ff]" value={accompanyingCitizenId} onChange={(event) => setAccompanyingCitizenId(event.target.value)} placeholder="Nhập 9 hoặc 12 chữ số" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="3" title="Yêu cầu đặc biệt cho chỗ nghỉ" badge="Không bắt buộc" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {requests.map((request) => (
                  <button key={request} onClick={() => toggleRequest(request)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition ${specialRequests.includes(request) ? "border-[#1677ff] bg-[#eaf2ff] text-[#1677ff]" : "border-transparent bg-[#eef2fc] text-[#56627c]"}`}>
                    <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${specialRequests.includes(request) ? "border-[#1677ff] bg-[#1677ff]" : "border-[#b8c2d9]"}`}>{specialRequests.includes(request) && <CheckIcon className="text-white" sx={{ fontSize: 12 }} />}</span>
                    {request}
                  </button>
                ))}
              </div>
              <button onClick={() => toggleRequest("Nhận phòng sớm")} className={`mt-2 w-full rounded-lg px-3 py-2.5 text-left text-xs ${specialRequests.includes("Nhận phòng sớm") ? "bg-[#eaf2ff] text-[#1677ff]" : "bg-[#eef2fc] text-[#56627c]"}`}>
                <span className="mr-2 inline-block h-3.5 w-3.5 rounded-sm border border-[#b8c2d9] align-middle" /> Nhận phòng sớm (nếu khách sạn có phòng trống sẵn)
              </button>
              <label className="mt-4 block text-xs font-semibold text-[#56627c]">Ghi chú hoặc lời nhắn đặc biệt cho quản gia:</label>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-20 w-full resize-y rounded-lg border-0 bg-[#eef2fc] p-3 text-xs outline-none placeholder:text-[#aab3c7] focus:ring-2 focus:ring-[#b9d2ff]" placeholder="Ví dụ: Phòng có view biển, chuẩn bị giúp tôi khi nhận ngày cưới, cần thêm gối..." />
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="4" title="Mã giảm giá & Điểm thưởng MeGo Points" />
              <label className="mb-1 mt-4 block text-xs font-semibold text-[#56627c]">Mã ưu đãi đặc quyền</label>
              <div className="flex rounded-lg bg-[#eef2fc] p-1">
                <LocalOfferOutlinedIcon className="m-2 text-[#7381a2]" sx={{ fontSize: 15 }} />
                <input value={promoCode} onChange={(event) => { setPromoCode(event.target.value); setPromoApplied(false); }} placeholder="MEGOSEA" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#516995]" />
                <button type="button" onClick={() => setPromoApplied(promoCode.trim().length > 0)} className="rounded-md bg-[#1677ff] px-4 text-xs font-semibold text-white">{promoApplied ? "Đã áp dụng" : "Áp dụng"}</button>
              </div>
              {promoApplied && <div className="mt-2 flex items-center justify-between rounded-lg bg-[#dce9ff] px-3 py-2 text-[11px] text-[#5070ad]">
                <span>◉ {promoCode.toUpperCase()} đã áp dụng - 450.000</span><button onClick={() => setPromoApplied(false)} className="font-semibold">Gỡ bỏ</button>
              </div>}
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#e0f7f4] px-3 py-3">
                <span><strong className="block text-xs text-[#3f596d]">MeGo Club Points {clubMember && <small className="rounded bg-white px-1 text-[9px] text-[#00a389]">Đang dùng</small>}</strong><small className="text-[10px] text-[#527a7b]">Sử dụng 500 MeGo Points bạn được giảm trực tiếp <b className="text-[#00a389]">50.000 VND</b></small></span>
                <button type="button" onClick={() => setClubMember((current) => !current)} className={`rounded-md px-3 py-1.5 text-[11px] font-semibold ${clubMember ? "bg-white text-[#008f7b]" : "bg-[#00a389] text-white"}`}>
                  {clubMember ? "Bỏ áp dụng" : "Áp dụng"}
                </button>
              </div>
            </section>
          </div>

          <BookingSummary
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            numberOfNights={selectedBooking.numberOfNights}
            numberOfGuests={selectedBooking.numberOfGuests}
            total={total}
            roomTotal={roomTotal}
            serviceFee={selectedBooking.price.serviceFee}
            vat={selectedBooking.price.vat}
            promotionDiscount={discount}
            pointsDiscount={clubDiscount}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onContinue={handleContinue}
            isExpired={isExpired}
            isSaving={isSaving}
          />
        </div>
        {formError && <p role="status" className={`mt-4 rounded-lg px-4 py-3 text-xs font-semibold ${isExpired ? "bg-[#fff1f0] text-[#d9475d]" : "bg-[#eaf2ff] text-[#31527f]"}`}>{isExpired ? "Đã hết thời gian giữ phòng. Vui lòng thực hiện lại thao tác đặt phòng." : formError}</p>}
      </main>
    </div>
  );
};

const SectionTitle = ({ number, title, badge }: { number: string; title: string; badge?: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1677ff] text-xs font-bold text-white">{number}</span>
    <h2 className="text-sm font-bold text-[#26344f]">{title}</h2>
    {badge && <span className="rounded bg-[#fff1f0] px-1.5 py-0.5 text-[9px] font-semibold text-[#ed4d65]">{badge}</span>}
  </div>
);

const GuestChoice = ({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) => (
  <button onClick={onClick} className={`rounded-lg border p-3 text-left ${active ? "border-[#b8d1ff] bg-[#eef3ff]" : "border-transparent bg-[#f3f5fb]"}`}>
    <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border align-middle ${active ? "border-[#1677ff] bg-[#1677ff]" : "border-[#aeb8ca]"}`}>{active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
    <strong className="text-xs text-[#53617b]">{title}</strong>
    <small className="mt-1 block pl-6 text-[10px] text-[#8d98ad]">{description}</small>
  </button>
);

export default BookingForm;
