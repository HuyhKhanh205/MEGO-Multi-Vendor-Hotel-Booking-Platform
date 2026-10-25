import axios from "axios";
import { MOCK_HOTELS } from "../../../data/hotels";
import type { BookingSelection, CustomerBooking, CustomerData, CustomerProfile, RoomSelection, SavedPaymentMethod, WishlistHotel } from "../types/customer.types";
import { importCustomerData, readCustomerData, updateCustomerData, exportCustomerData, resetCustomerData as resetStore } from "./customerStore";

const USE_MOCK = true;
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api", headers: { "Content-Type": "application/json" } });
const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, 350));
const read = async <T,>(select: (data: CustomerData) => T): Promise<T> => { if (!USE_MOCK) throw new Error("// TODO: chuyển sang endpoint Customer API."); await delay(); return select(readCustomerData()); };

export interface BookingDraftPayload {
  bookingId: string; guestType: "PRIMARY_GUEST" | "OTHER_GUEST";
  contact: { fullName: string; email: string; phone: string; citizenId: string };
  stayingGuest: { fullName: string; phone: string; citizenId: string } | null;
  checkIn: string; checkOut: string; specialRequests: string[]; note: string;
  promotionCode: string | null; useMeGoPoints: boolean;
}
export interface CheckoutInput extends BookingSelection {
  fullName: string; email: string; phone: string; guestName: string; specialRequest: string; promoCode: string;
  useMeGoPoints?: boolean;
  hotelName?: string; hotelAddress?: string; hotelImageUrl?: string; roomName?: string; roomPricePerNight?: number;
}

export const getRoomSelection = async (selection: Pick<BookingSelection, "hotelId" | "roomTypeId">): Promise<RoomSelection | null> => {
  if (!USE_MOCK) return (await api.post<RoomSelection>("/customer/room-selection", selection)).data;
  await delay();
  const hotel = MOCK_HOTELS.find((item) => item.id === selection.hotelId || item.slug === selection.hotelId);
  const room = hotel?.rooms?.find((item) => item.id === selection.roomTypeId);
  if (!hotel || !room) return null;
  return { hotelId: hotel.id, hotelName: hotel.name, hotelAddress: hotel.address, hotelImageUrl: hotel.coverImage, roomTypeId: room.id, roomName: room.name, pricePerNight: room.pricePerNight, availableRooms: room.availableRooms, freeCancellation: room.freeCancellation, payAtHotel: hotel.policies.payAtHotel };
};

export const fetchBookingDraft = async (bookingId: string): Promise<BookingDraftPayload> => {
  void bookingId;
  const data = await read((value) => value);
  const old = (data as CustomerData & { booking?: { id: string; guestType?: "PRIMARY_GUEST" | "OTHER_GUEST"; contact?: BookingDraftPayload["contact"]; stayingGuest?: BookingDraftPayload["stayingGuest"]; checkIn: string; checkOut: string; specialRequests?: string[]; note?: string; promotionCode?: string | null } }).booking;
  return { bookingId: old?.id ?? "draft", guestType: old?.guestType ?? "PRIMARY_GUEST", contact: old?.contact ?? { fullName: data.customer.fullName, email: data.customer.email, phone: data.customer.phone, citizenId: "" }, stayingGuest: old?.stayingGuest ?? null, checkIn: old?.checkIn ?? "", checkOut: old?.checkOut ?? "", specialRequests: old?.specialRequests ?? [], note: old?.note ?? "", promotionCode: old?.promotionCode ?? null, useMeGoPoints: false };
};
export const updateBookingDraft = async (payload: BookingDraftPayload): Promise<BookingDraftPayload> => { await delay(); updateCustomerData((data) => { data.bookingDraft = { hotelId: "", roomTypeId: "", checkIn: payload.checkIn, checkOut: payload.checkOut, rooms: 1, adults: 1, children: 0 }; }); return payload; };
export const saveBookingSelection = async (selection: BookingSelection): Promise<void> => { updateCustomerData((data) => { data.bookingDraft = selection; }); };
export const getPricingConfig = async () => read((data) => data.pricingConfig ?? { taxRate: 0.1, serviceFeeRate: 0, holdMinutes: 10 });

export const customerApiMethods = {
  getData: () => read((data) => data), getProfile: () => read((data) => data.customer),
  updateProfile: async (profile: CustomerProfile) => { await delay(); return updateCustomerData((data) => { data.customer = { ...data.customer, ...profile }; return data.customer; }); },
  changePassword: async (current: string, next: string) => { await delay(); if (current !== "Mego@2026") throw new Error("Mật khẩu hiện tại chưa chính xác."); if (!next) throw new Error("Mật khẩu mới không hợp lệ."); },
  getBookings: () => read((data) => data.bookings),
  getBooking: async (id: string) => read((data) => data.bookings.find((item) => item.id === id || item.bookingCode === id)),
  createBooking: async (input: CheckoutInput): Promise<CustomerBooking> => {
    await delay();
    const room = await getRoomSelection({ hotelId: input.hotelId, roomTypeId: input.roomTypeId });
    if (!room) throw new Error("Không tìm thấy loại phòng đã chọn.");
    const nights = Math.floor((Date.parse(input.checkOut) - Date.parse(input.checkIn)) / 86400000);
    if (nights < 1 || input.rooms > room.availableRooms) throw new Error("Phòng đã hết trong ngày bạn chọn. Vui lòng đổi ngày hoặc loại phòng.");
    return updateCustomerData((data) => {
      const occupied = data.bookings.filter((item) => item.hotelId === room.hotelId && item.roomName === room.roomName
        && (item.status === "CONFIRMED" || item.status === "CHECKED_IN" || item.status === "PENDING_PAYMENT" && Boolean(item.holdUntil) && Date.parse(item.holdUntil ?? "") > Date.now())
        && item.checkOut > input.checkIn && item.checkIn < input.checkOut).reduce((sum, item) => sum + item.numberOfRooms, 0);
      if (occupied + input.rooms > room.availableRooms) throw new Error("Phòng đã hết trong ngày bạn chọn. Vui lòng đổi ngày hoặc loại phòng.");
      const code = `MEGO-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const subtotal = room.pricePerNight * nights * input.rooms;
      const tax = Math.round(subtotal * (data.pricingConfig?.taxRate ?? 0.1));
      const promoCode = input.promoCode.trim().toUpperCase();
      const promo = promoCode
        ? data.promoCodes.find((item) => item.code.toUpperCase() === promoCode)
        : undefined;
      if (promoCode && !promo) throw new Error("Mã khuyến mãi không tồn tại.");
      if (promo && promo.usesLeft < 1) throw new Error("Mã khuyến mãi đã hết lượt.");
      if (promo && Date.parse(promo.expiresAt) < Date.now()) throw new Error("Mã khuyến mãi đã hết hạn.");
      if (promo && subtotal < promo.minValue) throw new Error(`Đơn tối thiểu ${promo.minValue.toLocaleString("vi-VN")}₫.`);
      if (input.useMeGoPoints && data.loyalty.points < 500) throw new Error("Bạn không đủ 500 điểm MeGo Club.");
      if (promo) promo.usesLeft -= 1;
      const promoDiscount = Math.min(promo?.discount ?? 0, subtotal);
      const pointsDiscount = input.useMeGoPoints ? 50000 : 0;
      if (input.useMeGoPoints) {
        data.loyalty.points -= 500;
        data.loyalty.pointHistory.unshift({
          id: crypto.randomUUID(),
          date: new Date().toISOString().slice(0, 10),
          reason: "Sử dụng MeGo Club Points khi đặt phòng",
          points: -500,
          bookingCode: code,
        });
      }
      const totalDiscount = promoDiscount + pointsDiscount;
      const requestedHoldUntil = input.holdUntil ? Date.parse(input.holdUntil) : NaN;
      const holdUntil = Number.isFinite(requestedHoldUntil) && requestedHoldUntil > Date.now()
        ? input.holdUntil!
        : new Date(Date.now() + (data.pricingConfig?.holdMinutes ?? 10) * 60000).toISOString();
      const booking: CustomerBooking = { id: crypto.randomUUID(), bookingCode: code, status: "PENDING_PAYMENT", createdAt: new Date().toISOString(), checkIn: input.checkIn, checkOut: input.checkOut, numberOfNights: nights, numberOfRooms: input.rooms, numberOfGuests: input.adults + input.children, hotelId: room.hotelId, hotelName: room.hotelName, hotelAddress: room.hotelAddress, hotelImageUrl: room.hotelImageUrl, roomName: room.roomName, pricePerNight: room.pricePerNight, taxes: tax, discount: totalDiscount, total: Math.max(0, subtotal + tax - totalDiscount), paymentMethod: "Chưa chọn", paymentStatus: "UNPAID", cancellationPolicy: room.freeCancellation ? "Miễn phí hủy trước 3 ngày nhận phòng; sau đó áp dụng phí hủy." : "Áp dụng chính sách hủy của khách sạn.", holdUntil, reviewed: false, contactName: input.fullName, contactEmail: input.email, contactPhone: input.phone, guestName: input.guestName || input.fullName, specialRequest: input.specialRequest, payAtHotel: room.payAtHotel };
      data.bookings.unshift(booking); data.bookingDraft = input; return booking;
    });
  },
  cancelBooking: async (id: string) => { await delay(); return updateCustomerData((data) => { const item = data.bookings.find((booking) => booking.id === id || booking.bookingCode === id); if (!item) throw new Error("Không tìm thấy đơn đặt phòng."); if (!["PENDING_PAYMENT", "CONFIRMED"].includes(item.status)) throw new Error("Trạng thái đơn đã thay đổi, không thể hủy."); item.status = "CANCELLED"; if (item.paymentStatus === "PAID") item.paymentStatus = "REFUNDED"; return item; }); },
  confirmPayment: async (id: string, method: string) => {
    await delay();
    const result = updateCustomerData((data) => {
      const item = data.bookings.find((booking) => booking.id === id || booking.bookingCode === id);
      if (!item) throw new Error("Booking not found.");
      if (item.holdUntil && Date.parse(item.holdUntil) < Date.now()) {
        item.status = "CANCELLED";
        return { item, expired: true };
      }
      item.paymentMethod = method;
      const isPayAtHotel = method.toLowerCase().includes("kh");
      const isBankTransfer = method.toLowerCase().includes("chuy");
      item.paymentStatus = isPayAtHotel || isBankTransfer ? "PENDING" : "PAID";
      item.status = isPayAtHotel || item.paymentStatus === "PAID" ? "CONFIRMED" : "PENDING_PAYMENT";
      return { item, expired: false };
    });
    if (result.expired) throw new Error("Booking hold has expired.");
    return result.item;
  },
  getPaymentMethods: () => read((data) => data.savedPaymentMethods),
  addPaymentMethod: async (method: SavedPaymentMethod) => { await delay(); updateCustomerData((data) => { data.savedPaymentMethods.push(method); }); },
  setDefaultPaymentMethod: async (id: string) => { await delay(); updateCustomerData((data) => { data.savedPaymentMethods = data.savedPaymentMethods.map((item) => ({ ...item, isDefault: item.id === id })); }); },
  removePaymentMethod: async (id: string) => { await delay(); updateCustomerData((data) => { const item = data.savedPaymentMethods.find((method) => method.id === id); if (item?.pendingBookingId) throw new Error("Phương thức đang được gắn với đơn chờ xử lý."); data.savedPaymentMethods = data.savedPaymentMethods.filter((method) => method.id !== id); }); },
  getWishlist: () => read((data) => data.wishlist),
  removeWishlist: async (id: string) => { await delay(); return updateCustomerData((data) => { const removed = data.wishlist.find((item) => item.id === id); data.wishlist = data.wishlist.filter((item) => item.id !== id); return removed; }); },
  restoreWishlist: async (hotel: WishlistHotel) => { await delay(); updateCustomerData((data) => { if (!data.wishlist.some((item) => item.id === hotel.id)) data.wishlist.push(hotel); }); },
  redeemVoucher: async (id: string) => { await delay(); updateCustomerData((data) => { const voucher = data.vouchers.find((item) => item.id === id); if (!voucher || data.loyalty.points < voucher.points) throw new Error("Số điểm hiện tại không đủ."); data.loyalty.points -= voucher.points; data.myVouchers.unshift({ code: `MEGO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`, name: voucher.name, expiresAt: voucher.expiresAt, status: "ACTIVE" }); data.loyalty.pointHistory.unshift({ id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), reason: `Đổi ${voucher.name}`, points: -voucher.points, bookingCode: "—" }); }); },
  exportCustomerData: () => exportCustomerData(), importCustomerData: (value: unknown) => importCustomerData(value), resetCustomerData: () => resetStore(),
};
