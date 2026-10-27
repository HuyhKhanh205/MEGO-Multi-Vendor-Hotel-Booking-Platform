/**
 * Dữ liệu mock cho tồn kho theo ngày (inventory_room_inventories) và nhân viên (partner_staffs).
 * Seeder backend chưa sinh 2 bảng này nên frontend tự tạo:
 *  - Tồn kho sinh cố định theo (hạng phòng, ngày) tính từ hôm nay, chỉ lưu vào mock DB khi bị sửa.
 *  - 6 nhân viên của partner@sunrise-danang.vn (tên theo Figma) + 2 của partner@mego.vn.
 */

import { POSITION_TEMPLATES } from "../components/staff/permissionCatalog";
import type { PartnerStaffDto, RoomInventoryDto, RoomTypeDto, StaffPosition, UserStatus } from "../types/backend.types";
import { isoWeekday, todayIso } from "../utils/formatters";

const DAY_MS = 86_400_000;

/** Số ngày kể từ 1970-01-01 (giờ địa phương) → dùng làm phần id ổn định của ô tồn kho */
const dayNumber = (iso: string): number => {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
};

const fromDayNumber = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);

/** id ô tồn kho = roomTypeId * 100000 + số ngày → giải ngược được khi PATCH theo id */
export const inventoryId = (roomTypeId: number, date: string): number => roomTypeId * 100_000 + dayNumber(date);

export const parseInventoryId = (id: number): { roomTypeId: number; date: string } => ({
  roomTypeId: Math.floor(id / 100_000),
  date: fromDayNumber(id % 100_000),
});

/** Hash nhỏ cho số giả ngẫu nhiên nhưng cố định */
const noise = (a: number, b: number): number => {
  let x = (a * 374761393 + b * 668265263) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4_294_967_296;
};

const roundPrice = (value: number) => Math.round(value / 10_000) * 10_000;

/** Ô tồn kho mặc định khi chưa có bản ghi: càng gần ngày và cuối tuần càng ít phòng trống. */
export const generateInventory = (roomType: RoomTypeDto, date: string): RoomInventoryDto => {
  const day = dayNumber(date);
  const daysAhead = day - dayNumber(todayIso());
  const weekday = isoWeekday(date);
  const r = noise(roomType.id, day);
  const total = roomType.totalRooms;

  const weekendLoad = weekday >= 5 ? 0.25 : 0;
  const nearLoad = daysAhead < 0 ? 0.35 : Math.max(0, 0.35 - daysAhead * 0.012);
  const occupancy = Math.min(1, 0.25 + weekendLoad + nearLoad + r * 0.3);
  const booked = Math.min(total, Math.round(total * occupancy));
  const held = daysAhead >= 0 && booked < total && r > 0.7 ? 1 : 0;

  const closed = daysAhead > 3 && noise(day, roomType.id * 7) > 0.97;
  const override = noise(roomType.id * 13, day) > 0.9 || (weekday === 6 && roomType.id % 3 === 0);
  const price = override ? roundPrice(roomType.basePrice * (weekday >= 5 ? 1.15 : 0.9)) : null;

  return {
    id: inventoryId(roomType.id, date),
    roomTypeId: roomType.id,
    date,
    totalRooms: total,
    availableRooms: total - booked,
    heldRooms: held,
    price,
    closed,
    version: 0,
    effectivePrice: price ?? roomType.basePrice,
  };
};

/** Bản ghi nhân viên trong mock DB: thêm email chủ cơ sở để lọc như backend lọc theo partner_profile */
export interface MockStaffRecord extends PartnerStaffDto {
  ownerEmail: string;
}

type StaffSeed = [ownerEmail: string, fullName: string, email: string, phone: string, position: StaffPosition, hotelId: number | null, status: UserStatus, lastLoginHoursAgo: number | null];

const STAFF_SEEDS: StaffSeed[] = [
  ["partner@sunrise-danang.vn", "Nguyễn Văn An", "an.nguyen@sunrise-danang.vn", "0905123456", "DUTY_MANAGER", null, "ACTIVE", 2],
  ["partner@sunrise-danang.vn", "Lê Thị Bích", "bich.le@sunrise-danang.vn", "0935456789", "FRONT_DESK", 1, "ACTIVE", 5],
  ["partner@sunrise-danang.vn", "Trần Đình Trọng", "trong.tran@sunrise-danang.vn", "0912345678", "ACCOUNTANT", null, "ACTIVE", 26],
  ["partner@sunrise-danang.vn", "Hoàng Minh Quân", "quan.hoang@sunrise-danang.vn", "0978111222", "FRONT_DESK", 2, "LOCKED", 24 * 12],
  ["partner@sunrise-danang.vn", "Phạm Thu Trang", "trang.pham@sunrise-danang.vn", "0383999888", "HOUSEKEEPING", 1, "ACTIVE", 9],
  ["partner@sunrise-danang.vn", "Đặng Quốc Huy", "huy.dang@sunrise-danang.vn", "0868777666", "FRONT_DESK", 3, "PENDING_VERIFICATION", null],
  ["partner@mego.vn", "Vũ Thị Hạnh", "hanh.vu@mego.vn", "0904555666", "DUTY_MANAGER", 4, "ACTIVE", 3],
  ["partner@mego.vn", "Bùi Văn Long", "long.bui@mego.vn", "0947222333", "ACCOUNTANT", null, "ACTIVE", 48],
];

export const createSeedStaff = (): MockStaffRecord[] => {
  const now = Date.now();
  return STAFF_SEEDS.map(([ownerEmail, fullName, email, phone, position, hotelId, status, hoursAgo], index) => ({
    id: index + 1,
    userId: 100 + index,
    ownerEmail,
    fullName,
    email,
    phone,
    position,
    hotelId,
    status,
    lastLoginAt: hoursAgo === null ? null : new Date(now - hoursAgo * 3_600_000).toISOString(),
    permissions: [...POSITION_TEMPLATES[position]],
  }));
};
