/**
 * "Cơ sở dữ liệu" mock cho cổng Partner, lưu localStorage để thay đổi còn sau khi tải lại trang.
 * Chỉ dùng khi PARTNER_USE_MOCK = true. Khởi tạo từ dữ liệu chép theo seeder backend.
 */

import store from "../../../stores/store";
import {
  MOCK_HOTEL_OWNERSHIP,
  SEED_HOTELS,
  SEED_POLICIES,
  SEED_ROOM_TYPES,
  SEED_ROOMS,
} from "../data/backendSeedMock";
import { createSeedStaff, type MockStaffRecord } from "../data/partnerOpsSeedMock";
import type { HotelDto, HotelPolicyDto, RoomDto, RoomInventoryDto, RoomTypeDto } from "../types/backend.types";
import { PartnerApiError } from "./partnerHttp";

const STORAGE_KEY = "mego_partner_mock_db_v1";

export interface PartnerMockDb {
  hotels: HotelDto[];
  policies: Record<number, HotelPolicyDto>;
  roomTypes: RoomTypeDto[];
  rooms: RoomDto[];
  /** Chỉ chứa ô tồn kho đã bị sửa, khóa "roomTypeId:yyyy-MM-dd"; ô khác sinh tự động */
  inventory: Record<string, RoomInventoryDto>;
  staff: MockStaffRecord[];
  nextId: number;
}

const createSeedDb = (): PartnerMockDb => ({
  hotels: structuredClone(SEED_HOTELS),
  policies: structuredClone(SEED_POLICIES),
  roomTypes: structuredClone(SEED_ROOM_TYPES),
  rooms: structuredClone(SEED_ROOMS),
  inventory: {},
  staff: createSeedStaff(),
  nextId: 10_000,
});

export const readMockDb = (): PartnerMockDb => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      // DB tạo từ phiên bản trước chưa có tồn kho / nhân viên → bổ sung, giữ nguyên dữ liệu đã sửa
      const db = JSON.parse(raw) as Partial<PartnerMockDb>;
      return { ...createSeedDb(), ...db, inventory: db.inventory ?? {}, staff: db.staff ?? createSeedStaff() } as PartnerMockDb;
    }
  } catch {
    // Dữ liệu hỏng hoặc storage không khả dụng → dùng seed
  }
  return createSeedDb();
};

/** Đọc → sửa → ghi lại; trả về giá trị do hàm cập nhật trả về. */
export const updateMockDb = <T,>(mutate: (db: PartnerMockDb) => T): T => {
  const db = readMockDb();
  const result = mutate(db);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage không khả dụng: thay đổi chỉ tồn tại trong phiên
  }
  return result;
};

export const nextMockId = (db: PartnerMockDb): number => {
  db.nextId += 1;
  return db.nextId;
};

export const currentUserEmail = (): string => store.getState().auth.user?.email?.toLowerCase() ?? "";

/** Khách sạn mà tài khoản đang đăng nhập được quản lý (backend sẽ lọc theo partner_profile của JWT). */
export const ownedHotelIds = (): number[] => {
  return MOCK_HOTEL_OWNERSHIP[currentUserEmail()] ?? [];
};

/** Giả lập kiểm tra quyền sở hữu như backend: không phải của mình → 404. */
export const assertOwnsHotel = (hotelId: number) => {
  if (!ownedHotelIds().includes(hotelId)) {
    throw new PartnerApiError("Không tìm thấy khách sạn hoặc bạn không có quyền quản lý.", 404);
  }
};
