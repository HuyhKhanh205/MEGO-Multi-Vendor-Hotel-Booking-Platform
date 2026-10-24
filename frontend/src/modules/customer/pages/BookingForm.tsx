import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@mui/material";
import { customerApiMethods, getPricingConfig, getRoomSelection, saveBookingSelection } from "../services/customerApi";
import type { BookingSelection, CustomerProfile, RoomSelection } from "../types/customer.types";
import { formatVnd } from "../utils/formatters";

type LocationState = Partial<BookingSelection> & { roomId?: string; guests?: number; hotelName?: string; hotelAddress?: string; hotelImageUrl?: string; roomName?: string; roomPricePerNight?: number };
const today = new Date().toISOString().slice(0, 10);
const EMPTY_LOCATION_STATE: LocationState = {};

export default function BookingForm() {
  const location = useLocation(); const navigate = useNavigate(); const [query] = useSearchParams();
  const state = (location.state ?? EMPTY_LOCATION_STATE) as LocationState;
  const routeSelection = useMemo<BookingSelection>(() => ({
    hotelId: String(state.hotelId ?? query.get("hotelId") ?? ""), roomTypeId: String(state.roomTypeId ?? state.roomId ?? query.get("roomTypeId") ?? query.get("roomId") ?? ""),
    checkIn: String(state.checkIn ?? query.get("checkIn") ?? ""), checkOut: String(state.checkOut ?? query.get("checkOut") ?? ""),
    rooms: Number(state.rooms ?? query.get("rooms") ?? 1), adults: Number(state.adults ?? state.guests ?? query.get("adults") ?? query.get("guests") ?? 2), children: Number(state.children ?? query.get("children") ?? 0),
  }), [state, query]);
  const [storedDraft, setStoredDraft] = useState<BookingSelection | null>(null);
  const routeHasSelection = Boolean(routeSelection.hotelId && routeSelection.roomTypeId && routeSelection.checkIn && routeSelection.checkOut);
  useEffect(() => {
    if (routeHasSelection) return;
    let active = true;
    void customerApiMethods.getData().then((data) => {
      const draft = data.bookingDraft;
      if (active && draft?.hotelId && draft.roomTypeId && draft.checkIn && draft.checkOut) setStoredDraft(draft);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [routeHasSelection, routeSelection.hotelId, routeSelection.roomTypeId, routeSelection.checkIn, routeSelection.checkOut]);
  const selection = useMemo(() => routeHasSelection ? routeSelection : storedDraft ?? routeSelection, [routeHasSelection, routeSelection, storedDraft]);
  const [room, setRoom] = useState<RoomSelection | null>(null); const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [taxRate, setTaxRate] = useState(0.1);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [formError, setFormError] = useState("");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [promo, setPromo] = useState(""); const [discount, setDiscount] = useState(0); const [agreed, setAgreed] = useState(false); const [saving, setSaving] = useState(false);
  const invalidSelection = !selection.hotelId || !selection.roomTypeId || !selection.checkIn || !selection.checkOut || !Number.isFinite(Date.parse(selection.checkIn)) || !Number.isFinite(Date.parse(selection.checkOut)) || Date.parse(selection.checkIn) < Date.parse(today) || Date.parse(selection.checkIn) >= Date.parse(selection.checkOut) || selection.rooms < 1 || selection.adults < 1;
  useEffect(() => {
    let active = true;
    if (invalidSelection) return () => { active = false; };
    void Promise.all([getRoomSelection(selection), customerApiMethods.getProfile(), getPricingConfig()]).then(async ([selected, customer, pricing]) => {
      if (!active) return;
      if (!selected) { setError("Không tìm thấy loại phòng bạn đã chọn."); return; }
      setRoom(selected); setProfile(customer); setName(customer.fullName); setEmail(customer.email); setPhone(customer.phone); setTaxRate(pricing.taxRate); await saveBookingSelection(selection);
    }).catch(() => { if (active) setError("Không thể tải thông tin đặt phòng. Vui lòng thử lại."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selection, invalidSelection]);
  const nights = Math.max(0, Math.floor((Date.parse(selection.checkOut) - Date.parse(selection.checkIn)) / 86400000));
  const subtotal = (room?.pricePerNight ?? 0) * nights * selection.rooms; const taxes = Math.round(subtotal * taxRate); const total = subtotal + taxes - discount;
  const date = (value: string) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T00:00:00`));
  const applyPromo = async () => { try { const data = await customerApiMethods.getData(); const item = data.promoCodes.find((entry) => entry.code.toUpperCase() === promo.trim().toUpperCase()); if (!item) throw new Error("Mã khuyến mãi không tồn tại."); if (item.usesLeft < 1) throw new Error("Mã khuyến mãi đã hết lượt."); if (Date.parse(item.expiresAt) < Date.now()) throw new Error("Mã khuyến mãi đã hết hạn."); if (subtotal < item.minValue) throw new Error(`Đơn tối thiểu ${formatVnd(item.minValue)}.`); setDiscount(Math.min(item.discount, subtotal)); setFormError(""); } catch (reason) { setDiscount(0); setFormError(reason instanceof Error ? reason.message : "Không áp dụng được mã."); } };
  const submit = async () => {
    if (!room || !profile) return;
    if (!name.trim() || !email.includes("@") || !/^\+?\d[\d\s.-]{7,14}$/.test(phone)) { setFormError("Vui lòng kiểm tra họ tên, email và số điện thoại."); return; }
    if (!agreed) { setFormError("Vui lòng đồng ý với chính sách đặt và hủy phòng."); return; }
    setSaving(true); setFormError("");
    try { const booking = await customerApiMethods.createBooking({ ...selection, fullName: name.trim(), email: email.trim(), phone, guestName: name.trim(), specialRequest: "", promoCode: discount ? promo.trim() : "" }); navigate(`/customer/payment/${booking.id}`, { state: { bookingId: booking.id } }); }
    catch (reason) { setFormError(reason instanceof Error ? reason.message : "Không thể tạo đơn. Vui lòng thử lại."); }
    finally { setSaving(false); }
  };
  if (invalidSelection || error || (!loading && !room)) return <main className="mx-auto max-w-3xl px-4 py-16 text-center"><section className="rounded-2xl bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Chưa thể tiếp tục đặt phòng</h1><p className="my-4 text-slate-600">{error || "Thông tin phòng hoặc ngày lưu trú chưa hợp lệ. Vui lòng chọn lại phòng."}</p><Link className="font-semibold text-blue-700" to={state.hotelId ? `/hotels/${state.hotelId}` : "/hotels"}>Quay lại chọn khách sạn</Link></section></main>;
  if (loading) return <main className="mx-auto flex min-h-96 max-w-6xl items-center justify-center"><CircularProgress aria-label="Đang tải thông tin đặt phòng" /></main>;
  if (!room || !profile) return null;
  return <main className="mx-auto max-w-6xl px-4 py-8 text-slate-800 sm:px-6">
    <div className="mb-6"><p className="text-xs text-slate-500">Trang chủ / Khách sạn / Đặt phòng</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Thông tin đặt phòng</h1><p className="mt-1 text-sm text-slate-500">Kiểm tra lựa chọn và thông tin liên hệ trước khi thanh toán.</p></div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row"><img src={room.hotelImageUrl} alt={room.hotelName} className="h-44 w-full rounded-xl object-cover sm:w-56"/><div><h2 className="text-lg font-bold">{room.hotelName}</h2><p className="mt-1 text-sm text-slate-500">{room.hotelAddress}</p><p className="mt-4 font-semibold">{room.roomName}</p><p className="mt-1 text-sm text-slate-500">{date(selection.checkIn)} – {date(selection.checkOut)} · {nights} đêm · {selection.rooms} phòng · {selection.adults} người lớn{selection.children ? ` · ${selection.children} trẻ em` : ""}</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><TextField label="Họ và tên người đặt" value={name} onChange={(event) => setName(event.target.value)} required/><TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/><TextField label="Số điện thoại" value={phone} onChange={(event) => setPhone(event.target.value)} required/><TextField label="Yêu cầu đặc biệt" multiline minRows={1}/></div>
        <div className="rounded-xl bg-blue-50 p-4"><h3 className="font-semibold">Chính sách hủy</h3><p className="mt-1 text-sm text-slate-600">{room.freeCancellation ? "Miễn phí hủy trước 3 ngày nhận phòng; sau đó áp dụng phí hủy." : "Áp dụng chính sách hủy của khách sạn."}</p></div>
      </section>
      <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold">Tóm tắt thanh toán</h2><div className="mt-5 flex gap-2"><TextField size="small" label="Mã khuyến mãi" value={promo} onChange={(event) => setPromo(event.target.value)} fullWidth/><Button onClick={() => void applyPromo()} variant="outlined">Áp dụng</Button></div><div className="mt-5 space-y-3 border-b border-slate-100 pb-4 text-sm"><Line label={`${formatVnd(room.pricePerNight)} × ${nights} đêm × ${selection.rooms} phòng`} amount={subtotal}/><Line label="Thuế và phí" amount={taxes}/>{discount > 0 && <Line label="Ưu đãi" amount={-discount}/>}</div><div className="flex justify-between py-4 text-lg font-bold"><span>Tổng cộng</span><span className="text-blue-700">{formatVnd(total)}</span></div><label className="flex items-start gap-2 text-xs text-slate-600"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 accent-blue-600"/>Tôi đồng ý với chính sách đặt phòng và hủy phòng.</label>{formError && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}<Button fullWidth disabled={saving || !agreed} onClick={() => void submit()} variant="contained" sx={{ mt: 2, bgcolor: "#0757d8", borderRadius: 2 }}>{saving ? "Đang tạo đơn…" : "Xác nhận đặt phòng"}</Button><p className="mt-3 text-center text-xs text-slate-500">Đơn được giữ chỗ trong 10 phút sau khi xác nhận.</p></aside>
    </div>
  </main>;
}
function Line({ label, amount }: { label: string; amount: number }) { return <div className="flex justify-between gap-3 text-slate-600"><span>{label}</span><span className="whitespace-nowrap">{formatVnd(amount)}</span></div>; }
