/**
 * Kiểu dữ liệu khớp entity / enum của Spring backend (module partner, hotel, inventory).
 * Tên trường giữ nguyên như entity Java để khi backend có controller chỉ cần trả DTO cùng tên.
 * BigDecimal → number, LocalTime → "HH:mm" hoặc "HH:mm:ss".
 */

import type { PartnerApprovalStatus } from "../../../services/auth.service";

/** PartnerApprovalStatus (partner) và ApprovalStatus (hotel) ở backend có cùng giá trị. */
export type ApprovalStatus = PartnerApprovalStatus;

export type AmenityScope = "HOTEL" | "ROOM";
export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "CLEANING";

/** partner_profiles */
export interface PartnerProfileDto {
  id: number;
  userId: number;
  businessName: string;
  taxCode: string | null;
  address: string | null;
  contactPhone: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  commissionRate: number;
  approvalStatus: ApprovalStatus;
  rejectReason: string | null;
  legalDocumentUrls: string[];
}

/** hotel_destinations */
export interface DestinationDto {
  id: number;
  name: string;
  slug: string;
  province: string | null;
  country: string | null;
}

/** hotel_catalog_amenities */
export interface AmenityDto {
  id: number;
  name: string;
  icon: string | null;
  scope: AmenityScope;
  category: string | null;
}

/** hotel_images */
export interface HotelImageDto {
  id: number;
  url: string;
  caption: string | null;
  primary: boolean;
  sortOrder: number;
}

/** Bản tóm tắt cho danh sách khách sạn của đối tác (ô chọn khách sạn). */
export interface HotelSummaryDto {
  id: number;
  name: string;
  slug: string;
  starRating: number;
  destinationName: string | null;
  approvalStatus: ApprovalStatus;
  active: boolean;
}

/** hotel_hotels */
export interface HotelDto {
  id: number;
  partnerProfileId: number;
  destinationId: number;
  name: string;
  slug: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  starRating: number;
  description: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  distanceToCenterKm: number | null;
  approvalStatus: ApprovalStatus;
  rejectReason: string | null;
  active: boolean;
  avgRating: number | null;
  reviewCount: number;
  amenityIds: number[];
  images: HotelImageDto[];
}

/** PUT /api/partner/hotels/{id}: tab Thông tin chung */
export type HotelUpdateRequest = Pick<
  HotelDto,
  "name" | "destinationId" | "address" | "latitude" | "longitude" | "starRating" | "description" | "checkInTime" | "checkOutTime" | "distanceToCenterKm"
>;

/** PUT /api/partner/hotels/{id}/images */
export type HotelImageRequest = Omit<HotelImageDto, "id">;

/** hotel_policies */
export interface HotelPolicyDto {
  checkInFrom: string | null;
  checkInUntil: string | null;
  checkOutUntil: string | null;
  freeCancelBeforeHours: number | null;
  cancellationFeePercent: number | null;
  refundable: boolean;
  allowPayAtHotel: boolean;
  requireManualCancelApproval: boolean;
  childPolicy: string | null;
  petPolicy: string | null;
  otherRules: string | null;
}

/** inventory_room_type_images */
export interface RoomTypeImageDto {
  id: number;
  url: string;
  sortOrder: number;
}

/** inventory_room_types */
export interface RoomTypeDto {
  id: number;
  hotelId: number;
  name: string;
  description: string | null;
  areaM2: number | null;
  maxAdults: number;
  maxChildren: number;
  bedType: string | null;
  basePrice: number;
  totalRooms: number;
  active: boolean;
  amenityIds: number[];
  images: RoomTypeImageDto[];
}

/** POST /api/partner/hotels/{hotelId}/room-types, PUT /api/partner/room-types/{id} */
export type RoomTypeRequest = Omit<RoomTypeDto, "id" | "hotelId" | "images"> & { imageUrls: string[] };

/** inventory_rooms */
export interface RoomDto {
  id: number;
  roomTypeId: number;
  roomNumber: string;
  floor: number | null;
  status: RoomStatus;
}

/** POST /api/partner/room-types/{id}/rooms, PUT /api/partner/rooms/{id} */
export type RoomRequest = Pick<RoomDto, "roomNumber" | "floor" | "status">;

// ─── Tồn kho & giá theo ngày (inventory_room_inventories) ───────────────────

export interface RoomInventoryDto {
  id: number;
  roomTypeId: number;
  /** yyyy-MM-dd */
  date: string;
  totalRooms: number;
  availableRooms: number;
  heldRooms: number;
  /** Giá riêng của ngày; null = dùng basePrice của hạng phòng */
  price: number | null;
  closed: boolean;
  /** @Version của entity: gửi kèm khi cập nhật để tránh ghi đè (409 nếu lệch) */
  version: number;
  /** Giá áp dụng thực tế = price ?? basePrice (backend tính sẵn cho tiện hiển thị) */
  effectivePrice: number;
}

/** PATCH /api/partner/inventory/{id} */
export interface InventoryUpdateRequest {
  price?: number | null;
  availableRooms?: number;
  closed?: boolean;
  version: number;
}

export type PriceAdjustMode = "SET" | "PERCENT" | "AMOUNT" | "RESET";
export type AllotmentMode = "SET" | "REDUCE";

/** POST /api/partner/hotels/{hotelId}/inventory/bulk */
export interface InventoryBulkRequest {
  roomTypeIds: number[];
  /** yyyy-MM-dd */
  from: string;
  to: string;
  /** 1 = Thứ Hai … 7 = Chủ nhật (ISO-8601) */
  weekdays: number[];
  price?: { mode: PriceAdjustMode; value: number };
  allotment?: { mode: AllotmentMode; value: number };
  closed?: boolean;
}

export interface InventoryBulkResult {
  updatedCount: number;
}

// ─── Nhân viên & phân quyền (partner_staffs) ─────────────────────────────────

/** Khớp enum UserStatus của backend */
export type UserStatus = "ACTIVE" | "LOCKED" | "PENDING_VERIFICATION";

/** Giá trị lưu vào cột partner_staffs.position */
export type StaffPosition = "FRONT_DESK" | "DUTY_MANAGER" | "ACCOUNTANT" | "HOUSEKEEPING";

/** Đề xuất enum PartnerPermission cho backend (bảng partner_staff_permissions) */
export type PartnerPermission =
  | "BOOKING_VIEW"
  | "BOOKING_CHECKIN_CHECKOUT"
  | "BOOKING_GUEST_NOTES"
  | "BOOKING_SURCHARGE"
  | "BOOKING_CANCEL_NOSHOW"
  | "RATE_VIEW"
  | "RATE_EDIT"
  | "INVENTORY_STOP_SELL"
  | "PROMOTION_MANAGE"
  | "FINANCE_REPORT_VIEW"
  | "FINANCE_PAYOUT"
  | "FINANCE_INVOICE"
  | "REVIEW_VIEW"
  | "REVIEW_REPLY"
  | "REVIEW_REPORT"
  | "HOTEL_INFO_EDIT";

export interface PartnerStaffDto {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  position: StaffPosition;
  /** null = được làm việc ở tất cả khách sạn của đối tác */
  hotelId: number | null;
  status: UserStatus;
  /** ISO datetime */
  lastLoginAt: string | null;
  permissions: PartnerPermission[];
}

/** POST /api/partner/staff, PUT /api/partner/staff/{id} (email không đổi khi sửa) */
export interface StaffRequest {
  fullName: string;
  email: string;
  phone: string | null;
  position: StaffPosition;
  hotelId: number | null;
  permissions?: PartnerPermission[];
}
