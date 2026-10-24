import { useEffect, useMemo, useState, type ReactNode } from "react";
import {  Link, useLocation, useNavigate, useSearchParams,} from "react-router-dom";
import { CircularProgress, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Switch from "@mui/material/Switch";
import { customerApiMethods, getPricingConfig, getRoomSelection, saveBookingSelection,} from "../services/customerApi";
import type { BookingSelection, CustomerProfile, PromoCode, RoomSelection,} from "../types/customer.types";
import { formatVnd } from "../utils/formatters";
import BookingSummary from "../components/BookingSummary";
import BookingHoldTimer from "../components/BookingHoldTimer";
import { useBookingHold } from "../components/useBookingHold";

type LocationState = Partial<BookingSelection> & {
  roomId?: string;
  guests?: number;
  hotelName?: string;
  hotelAddress?: string;
  hotelImageUrl?: string;
  roomName?: string;
  roomPricePerNight?: number;
};
const today = new Date().toISOString().slice(0, 10);
const EMPTY_LOCATION_STATE: LocationState = {};

export default function BookingForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const state = (location.state ?? EMPTY_LOCATION_STATE) as LocationState;
  const routeSelection = useMemo<BookingSelection>(
    () => ({
      hotelId: String(state.hotelId ?? query.get("hotelId") ?? ""),
      roomTypeId: String(
        state.roomTypeId ??
          state.roomId ??
          query.get("roomTypeId") ??
          query.get("roomId") ??
          "",
      ),
      checkIn: String(state.checkIn ?? query.get("checkIn") ?? ""),
      checkOut: String(state.checkOut ?? query.get("checkOut") ?? ""),
      rooms: Number(state.rooms ?? query.get("rooms") ?? 1),
      adults: Number(
        state.adults ??
          state.guests ??
          query.get("adults") ??
          query.get("guests") ??
          2,
      ),
      children: Number(state.children ?? query.get("children") ?? 0),
    }),
    [state, query],
  );
  const [storedDraft, setStoredDraft] = useState<BookingSelection | null>(null);
  const routeHasSelection = Boolean(
    routeSelection.hotelId &&
    routeSelection.roomTypeId &&
    routeSelection.checkIn &&
    routeSelection.checkOut,
  );
  useEffect(() => {
    if (routeHasSelection) return;
    let active = true;
    void customerApiMethods
      .getData()
      .then((data) => {
        const draft = data.bookingDraft;
        if (
          active &&
          draft?.hotelId &&
          draft.roomTypeId &&
          draft.checkIn &&
          draft.checkOut
        )
          setStoredDraft(draft);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [
    routeHasSelection,
    routeSelection.hotelId,
    routeSelection.roomTypeId,
    routeSelection.checkIn,
    routeSelection.checkOut,
  ]);
  const selection = useMemo(
    () =>
      routeHasSelection ? routeSelection : (storedDraft ?? routeSelection),
    [routeHasSelection, routeSelection, storedDraft],
  );
  const [room, setRoom] = useState<RoomSelection | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [taxRate, setTaxRate] = useState(0.1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [accompanyingGuest, setAccompanyingGuest] = useState("");
  const [accompanyingPhone, setAccompanyingPhone] = useState("");
  const [accompanyingCitizenId, setAccompanyingCitizenId] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [guestType, setGuestType] = useState<"myself" | "other">("myself");
  const [clubMember, setClubMember] = useState(false);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [availablePromos, setAvailablePromos] = useState<PromoCode[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [holdUntil, setHoldUntil] = useState<string | null>(null);
  const { remainingSeconds } = useBookingHold(holdUntil);
  const invalidSelection =
    !selection.hotelId ||
    !selection.roomTypeId ||
    !selection.checkIn ||
    !selection.checkOut ||
    !Number.isFinite(Date.parse(selection.checkIn)) ||
    !Number.isFinite(Date.parse(selection.checkOut)) ||
    Date.parse(selection.checkIn) < Date.parse(today) ||
    Date.parse(selection.checkIn) >= Date.parse(selection.checkOut) ||
    selection.rooms < 1 ||
    selection.adults < 1;
  useEffect(() => {
    let active = true;
    if (invalidSelection)
      return () => {
        active = false;
      };
    void Promise.all([
      getRoomSelection(selection),
      customerApiMethods.getProfile(),
      getPricingConfig(),
    ])
      .then(async ([selected, customer, pricing]) => {
        if (!active) return;
        if (!selected) {
          setError("Không tìm thấy loại phòng bạn đã chọn.");
          return;
        }
        setRoom(selected);
        setProfile(customer);
        setName(customer.fullName);
        setEmail(customer.email);
        setPhone(customer.phone);
        setTaxRate(pricing.taxRate);
        const customerData = await customerApiMethods.getData();
        const savedHoldUntil = selection.holdUntil;
        const savedHoldTime = savedHoldUntil ? Date.parse(savedHoldUntil) : NaN;
        const nextHoldUntil: string =
          Number.isFinite(savedHoldTime) && savedHoldTime > Date.now()
            ? savedHoldUntil!
            : new Date(
                Date.now() + (pricing.holdMinutes ?? 10) * 60000,
              ).toISOString();
        setHoldUntil(nextHoldUntil);
        setAvailablePoints(customerData.loyalty.points);
        setAvailablePromos(
          customerData.promoCodes.filter(
            (item) =>
              item.usesLeft > 0 && Date.parse(item.expiresAt) >= Date.now(),
          ),
        );
        await saveBookingSelection({ ...selection, holdUntil: nextHoldUntil });
      })
      .catch(() => {
        if (active)
          setError("Không thể tải thông tin đặt phòng. Vui lòng thử lại.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selection, invalidSelection]);
  const nights = Math.max(
    0,
    Math.floor(
      (Date.parse(selection.checkOut) - Date.parse(selection.checkIn)) /
        86400000,
    ),
  );
  const subtotal = (room?.pricePerNight ?? 0) * nights * selection.rooms;
  const taxes = Math.round(subtotal * taxRate);
  const pointsDiscount = clubMember ? 50000 : 0;
  const total = Math.max(0, subtotal + taxes - discount - pointsDiscount);
  const date = (value: string) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  const applyPromo = async () => {
    try {
      const data = await customerApiMethods.getData();
      const item = data.promoCodes.find(
        (entry) => entry.code.toUpperCase() === promo.trim().toUpperCase(),
      );
      if (!item) throw new Error("Mã khuyến mãi không tồn tại.");
      if (item.usesLeft < 1) throw new Error("Mã khuyến mãi đã hết lượt.");
      if (Date.parse(item.expiresAt) < Date.now())
        throw new Error("Mã khuyến mãi đã hết hạn.");
      if (subtotal < item.minValue)
        throw new Error(`Đơn tối thiểu ${formatVnd(item.minValue)}.`);
      setDiscount(Math.min(item.discount, subtotal));
      setAppliedPromoCode(item.code);
      setFormError("");
    } catch (reason) {
      setDiscount(0);
      setAppliedPromoCode("");
      setFormError(
        reason instanceof Error ? reason.message : "Không áp dụng được mã.",
      );
    }
  };
  const selectPromo = (code: string) => {
    setPromo(code);
    setDiscount(0);
    setAppliedPromoCode("");
    setFormError("");
  };
  const submit = async () => {
    if (!room || !profile) return;
    if (
      !name.trim() ||
      !email.includes("@") ||
      !/^\+?\d[\d\s.-]{7,14}$/.test(phone) ||
      !/^\d{9}(\d{3})?$/.test(citizenId.replace(/\s/g, ""))
    ) {
      setFormError(
        "Vui lòng kiểm tra họ tên, email, số điện thoại và CCCD/hộ chiếu.",
      );
      return;
    }
    if (
      guestType === "other" &&
      (!accompanyingGuest.trim() ||
        !/^\+?\d[\d\s.-]{7,14}$/.test(accompanyingPhone) ||
        !/^\d{9}(\d{3})?$/.test(accompanyingCitizenId.replace(/\s/g, "")))
    ) {
      setFormError("Vui lòng điền đúng thông tin khách lưu trú.");
      return;
    }
    if (!agreed) {
      setFormError("Vui lòng đồng ý với chính sách đặt và hủy phòng.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const booking = await customerApiMethods.createBooking({
        ...selection,
        fullName: name.trim(),
        email: email.trim(),
        phone,
        guestName:
          guestType === "other" ? accompanyingGuest.trim() : name.trim(),
        specialRequest: [...selectedRequests, specialRequest]
          .filter(Boolean)
          .join(", "),
        promoCode: appliedPromoCode,
        useMeGoPoints: clubMember,
        holdUntil: holdUntil ?? undefined,
      });
      navigate(`/customer/payment/${booking.id}`, {
        state: { bookingId: booking.id },
      });
    } catch (reason) {
      setFormError(
        reason instanceof Error
          ? reason.message
          : "Không thể tạo đơn. Vui lòng thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };
  if (invalidSelection || error || (!loading && !room))
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <section className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Chưa thể tiếp tục đặt phòng
          </h1>
          <p className="my-4 text-slate-600">
            {error ||
              "Thông tin phòng hoặc ngày lưu trú chưa hợp lệ. Vui lòng chọn lại phòng."}
          </p>
          <Link
            className="font-semibold text-blue-700"
            to={state.hotelId ? `/hotels/${state.hotelId}` : "/hotels"}
          >
            Quay lại chọn khách sạn
          </Link>
        </section>
      </main>
    );
  if (loading)
    return (
      <main className="mx-auto flex min-h-96 max-w-6xl items-center justify-center">
        <CircularProgress aria-label="Đang tải thông tin đặt phòng" />
      </main>
    );
  if (!room || !profile) return null;
  const requests = [
    "Phòng tầng cao yên tĩnh",
    "1 giường đôi lớn (King Bed)",
    "Phòng không hút thuốc",
    "Check-in muộn (sau 18:00)",
  ];
  const toggleRequest = (request: string) =>
    setSelectedRequests((current) =>
      current.includes(request)
        ? current.filter((item) => item !== request)
        : [...current, request],
    );
  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#17233c]">
      <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-full bg-[#1677ff] px-3 py-1 font-semibold text-white">
            1. Thông tin đặt phòng
          </span>
          <span>›</span>
          <span>2. Thanh toán bảo mật</span>
          <span>›</span>
          <span>3. Kết quả và vé điện tử</span>
        </div>
        <BookingHoldTimer holdUntil={holdUntil} variant="booking-form" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <div className="space-y-5">
            <BookingSection
              number="1"
              title="Thông tin người đặt & liên hệ"
              hint="BẮT BUỘC"
            >
              <div className="mb-4 rounded-lg border border-[#8adfd0] bg-[#e9fbf7] px-3 py-3 text-xs">
                <p className="font-semibold text-[#176b61]">
                  Đã liên kết tài khoản
                </p>
                <p className="mt-1 text-[10px] text-[#43847d]">
                  {email || "chưa cập nhật email"}
                </p>
              </div>
              <TextField
                size="small"
                label="Họ và tên đầy đủ"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <TextField
                  size="small"
                  label="Email xác nhận"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Số điện thoại liên hệ"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Số CCCD/Hộ chiếu"
                  value={citizenId}
                  onChange={(event) => setCitizenId(event.target.value)}
                  slotProps={{ htmlInput: { inputMode: "numeric" } }}
                  placeholder="Nhập 9 hoặc 12 chữ số"
                  required
                  fullWidth
                />
              </div>
            </BookingSection>
            <BookingSection
              number="2"
              title="Thông tin khách lưu trú"
              hint="BẮT BUỘC"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  active={guestType === "myself"}
                  onClick={() => setGuestType("myself")}
                  title="Tôi là người lưu trú chính"
                  description="Thông tin phòng sẽ gửi đến email của bạn"
                />
                <ChoiceCard
                  active={guestType === "other"}
                  onClick={() => setGuestType("other")}
                  title="Đặt phòng hộ người khác"
                  description="Cần điền thêm thông tin khách"
                />
              </div>
              {guestType === "other" && (
                <div className="mt-3 rounded-lg border border-[#d8e3f8] bg-[#f7f9ff] p-3">
                  <p className="mb-3 text-xs font-bold text-[#263b68]">
                    Thông tin người lưu trú
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                      size="small"
                      label="Họ và tên"
                      value={accompanyingGuest}
                      onChange={(event) =>
                        setAccompanyingGuest(event.target.value)
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="Số điện thoại"
                      value={accompanyingPhone}
                      onChange={(event) =>
                        setAccompanyingPhone(event.target.value)
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      className="sm:col-span-2"
                      size="small"
                      label="Số CCCD/Hộ chiếu"
                      value={accompanyingCitizenId}
                      onChange={(event) =>
                        setAccompanyingCitizenId(event.target.value)
                      }
                      slotProps={{ htmlInput: { inputMode: "numeric" } }}
                      required
                      fullWidth
                    />
                  </div>
                </div>
              )}
            </BookingSection>
            <BookingSection
              number="3"
              title="Yêu cầu đặc biệt cho chỗ nghỉ"
              hint="Không bắt buộc"
            >
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {requests.map((request) => (
                  <button
                    type="button"
                    key={request}
                    onClick={() => toggleRequest(request)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition ${selectedRequests.includes(request) ? "border-[#1677ff] bg-[#eaf2ff] text-[#1677ff]" : "border-transparent bg-[#eef2fc] text-[#56627c]"}`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${selectedRequests.includes(request) ? "border-[#1677ff] bg-[#1677ff]" : "border-[#b8c2d9]"}`}
                    >
                      {selectedRequests.includes(request) && (
                        <CheckIcon
                          className="text-white"
                          sx={{ fontSize: 12 }}
                        />
                      )}
                    </span>
                    {request}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => toggleRequest("Nhận phòng sớm")}
                className={`mt-2 w-full rounded-lg px-3 py-2.5 text-left text-xs ${selectedRequests.includes("Nhận phòng sớm") ? "bg-[#eaf2ff] text-[#1677ff]" : "bg-[#eef2fc] text-[#56627c]"}`}
              >
                <span className="mr-2 inline-block h-3.5 w-3.5 rounded-sm border border-[#b8c2d9] align-middle" />
                Nhận phòng sớm (nếu khách sạn có phòng trống sẵn)
              </button>
              <TextField
                sx={{ mt: "10px" }}
                size="small"
                label="Ghi chú hoặc lời nhắn đặc biệt cho quản gia"
                value={specialRequest}
                onChange={(event) => setSpecialRequest(event.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
            </BookingSection>
            <BookingSection
              number="4"
              title="Mã giảm giá & Điểm thưởng MeGo Points"
              hint="Tiết kiệm hơn"
            >
              <label className="mb-1 mt-4 block text-xs font-semibold text-[#56627c]">
                Mã ưu đãi đặc quyền
              </label>
              <div className="flex rounded-lg bg-[#eef2fc] p-1">
                <LocalOfferOutlinedIcon
                  className="m-2 text-[#7381a2]"
                  sx={{ fontSize: 15 }}
                />
                <input
                  value={promo}
                  onChange={(event) => {
                    setPromo(event.target.value);
                    setDiscount(0);
                    setAppliedPromoCode("");
                  }}
                  placeholder="Nhập mã ưu đãi"
                  className="min-w-0 flex-1 bg-transparent px-1 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  className="rounded-md bg-[#1677ff] px-4 text-xs font-semibold text-white"
                >
                  Áp dụng
                </button>
              </div>
              {discount > 0 && (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#dce9ff] px-3 py-2 text-[11px] text-[#5070ad]">
                  <span>
                    Mã {appliedPromoCode} đã áp dụng - {formatVnd(discount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPromo("");
                      setDiscount(0);
                      setAppliedPromoCode("");
                      setFormError("");
                    }}
                    aria-label="Hủy áp dụng mã khuyến mãi"
                    className="shrink-0 text-lg font-bold leading-none text-[#ed4d65] hover:text-[#c93650]"
                  >
                    ×
                  </button>
                </div>
              )}
              {availablePromos.length > 0 && (
                  <div className="mt-3 rounded-lg border border-[#e5eaf5] bg-[#fafbff] p-2.5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11px] font-semibold text-[#56627c]">
                        Ưu đãi bạn đang có
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Chọn 1 mã
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-0.5">
                      {availablePromos.slice(0, 4).map((item) => {
                        const isSelected = appliedPromoCode === item.code;
                        const hasSelectedPromo = Boolean(appliedPromoCode);
                        return (
                          <button
                            key={item.code}
                            type="button"
                            disabled={hasSelectedPromo && !isSelected}
                            onClick={() => selectPromo(item.code)}
                            className={`min-w-[132px] rounded-md border px-2.5 py-2 text-left transition ${
                              isSelected
                                ? "border-[#1677ff] bg-[#eaf2ff] text-[#1769ed]"
                                : hasSelectedPromo
                                  ? "cursor-not-allowed border-transparent bg-slate-100 text-slate-400 opacity-60"
                                  : "border-transparent bg-[#f3f5fb] text-slate-600 hover:border-[#b8d1ff] hover:bg-white"
                            }`}
                          >
                            <span className="block truncate text-[10px] font-bold">
                              {item.code}
                            </span>
                            <span className="mt-1 block truncate text-[9px]">
                              {item.description}
                            </span>
                            <span className="mt-1 block text-[10px] font-semibold text-[#ed4d65]">
                              -{formatVnd(item.discount)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
              )}
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#e0f7f4] px-3 py-3">
                <span>
                  <strong className="block text-xs text-[#3f596d]">
                    MeGo Club Points{" "}
                    {clubMember && (
                      <small className="rounded bg-white px-1 text-[9px] text-[#00a389]">
                        Đang dùng
                      </small>
                    )}
                  </strong>
                  <small className="text-[10px] text-[#527a7b]">
                    Dùng 500 điểm để giảm trực tiếp{" "}
                    <b className="text-[#00a389]">50.000 VND</b>
                  </small>
                </span>
                <Switch
                  checked={clubMember}
                  onChange={(event) => setClubMember(event.target.checked)}
                  disabled={availablePoints < 500}
                  slotProps={{
                    input: { "aria-label": "Sử dụng 500 MeGo Club Points" },
                  }}
                  color="success"
                />
              </div>
              {availablePoints < 500 && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Bạn cần ít nhất 500 điểm để áp dụng.
                </p>
              )}
            </BookingSection>
          </div>
          <BookingSummary
            room={room}
            checkIn={date(selection.checkIn)}
            checkOut={date(selection.checkOut)}
            numberOfNights={nights}
            numberOfRooms={selection.rooms}
            numberOfGuests={selection.adults + selection.children}
            roomTotal={subtotal}
            vat={taxes}
            promotionDiscount={discount}
            pointsDiscount={pointsDiscount}
            total={total}
            agreed={agreed}
            onAgreeChange={setAgreed}
            formError={formError}
            isSaving={saving}
            isExpired={remainingSeconds === 0}
            onContinue={() => void submit()}
          />
        </div>
      </main>
    </div>
  );
}
function BookingSection({
  number,
  title,
  hint,
  children,
}: {
  number: string;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  const isRequired = hint.toUpperCase() === "BẮT BUỘC";
  const isOptional = hint.toLowerCase().includes("không bắt buộc");
  const isSavings = hint.toLowerCase().includes("tiết kiệm hơn");
  const hintClassName = isRequired
    ? "bg-red-100 text-red-700"
    : isOptional
      ? "bg-gray-100 text-gray-600"
      : isSavings
        ? "bg-[#dff8f5] text-[#007d70]"
      : "bg-[#eaf2ff] text-[#31527f]";

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1769ed] text-xs font-bold text-white">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-bold">
            {title}{" "}
            <span
              className={`ml-1 rounded px-1.5 py-0.5 text-[9px] font-medium ${hintClassName}`}
            >
              {hint}
            </span>
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}
function ChoiceCard({
  title,
  description,
  active = false,
  onClick,
}: {
  title: string;
  description?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${active ? "border-[#1769ed] bg-[#edf3ff]" : "border-transparent bg-[#f0f4ff]"}`}
    >
      <span
        className={`mr-2 inline-block h-3 w-3 rounded-full border-2 align-[-1px] ${active ? "border-[#1769ed] bg-[#1769ed]" : "border-slate-400"}`}
      />
      {title}
      {description && (
        <p className="mt-1 pl-5 text-[10px] text-slate-500">{description}</p>
      )}
    </button>
  );
}
