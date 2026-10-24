export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "REFUNDED";
export type MemberTier = "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";

export interface CustomerProfile { id: string; fullName: string; email: string; phone: string; birthDate: string; avatarUrl: string; }
export interface CustomerBooking {
  id: string; bookingCode: string; status: BookingStatus; createdAt: string; checkIn: string; checkOut: string;
  numberOfNights: number; numberOfRooms: number; numberOfGuests: number; hotelId: string; hotelName: string;
  hotelAddress: string; hotelImageUrl: string; roomName: string; pricePerNight: number; taxes: number;
  discount: number; total: number; paymentMethod: string; paymentStatus: PaymentStatus; cancellationPolicy: string;
  holdUntil: string | null; reviewed: boolean; contactName: string; contactEmail: string; contactPhone: string;
  guestName: string; specialRequest: string; payAtHotel: boolean;
}
export interface WishlistHotel { id: string; hotelId: string; name: string; location: string; stars: number; rating: number; priceFrom: number; imageUrl: string; addedAt: string; }
export interface PromoCode { code: string; description: string; minValue: number; discount: number; expiresAt: string; usesLeft: number; }
export interface SavedPaymentMethod { id: string; brand: string; last4: string; holderName: string; expiry: string; isDefault: boolean; pendingBookingId: string | null; }
export interface RewardVoucher { id: string; name: string; condition: string; points: number; expiresAt: string; discount: number; }
export interface MyVoucher { code: string; name: string; expiresAt: string; status: "ACTIVE" | "USED" | "EXPIRED"; }
export interface PointHistory { id: string; date: string; reason: string; points: number; bookingCode: string; }
export interface TierBenefit { tier: MemberTier; name: string; minPoints: number; benefits: string[]; }
export interface LoyaltyData { points: number; tier: MemberTier; nextTierPoints: number; tierBenefits: TierBenefit[]; pointHistory: PointHistory[]; }
export interface BankTransferInfo { bankName: string; accountName: string; accountNumber: string; branch: string; }
export interface CustomerData {
  customer: CustomerProfile; bookings: CustomerBooking[]; wishlist: WishlistHotel[]; promoCodes: PromoCode[];
  savedPaymentMethods: SavedPaymentMethod[]; vouchers: RewardVoucher[]; myVouchers: MyVoucher[];
  loyalty: LoyaltyData; bankTransferInfo: BankTransferInfo;
  bookingDraft?: BookingSelection | null;
  pricingConfig?: { taxRate: number; serviceFeeRate: number; holdMinutes: number };
}

export interface BookingSelection {
  hotelId: string; roomTypeId: string; checkIn: string; checkOut: string;
  rooms: number; adults: number; children: number;
}

export interface RoomSelection {
  hotelId: string; hotelName: string; hotelAddress: string; hotelImageUrl: string;
  roomTypeId: string; roomName: string; pricePerNight: number; availableRooms: number;
  freeCancellation: boolean; payAtHotel: boolean;
}
