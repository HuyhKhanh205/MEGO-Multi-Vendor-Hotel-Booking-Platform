import { isPermissionAllowed, POSITION_TEMPLATES, sortPermissions } from "../components/staff/permissionCatalog";
import type { MockStaffRecord } from "../data/partnerOpsSeedMock";
import type { PartnerPermission, PartnerStaffDto, StaffRequest, UserStatus } from "../types/backend.types";
import { mockDelay, PARTNER_USE_MOCK, PartnerApiError, partnerRequest } from "./partnerHttp";
import { assertOwnsHotel, currentUserEmail, nextMockId, readMockDb, updateMockDb, type PartnerMockDb } from "./partnerMockDb";

/** Tài khoản có sẵn trong ChatDataSeeder: tạo nhân viên trùng email phải báo lỗi như backend (users.email unique) */
const SEEDED_ACCOUNT_EMAILS = [
  "admin@mego.vn", "customer@mego.vn", "partner@mego.vn", "partner@sunrise-danang.vn", "partner.pending@mego.vn", "partner.rejected@mego.vn",
];

/** Lỗi gắn với một trường của form (backend trả 400 với message nhắc tới "email"). */
export class StaffFieldError extends PartnerApiError {
  field: keyof StaffRequest;

  constructor(field: keyof StaffRequest, message: string) {
    super(message, 400);
    this.name = "StaffFieldError";
    this.field = field;
  }
}

const toDto = ({ ownerEmail: _owner, ...staff }: MockStaffRecord): PartnerStaffDto => {
  void _owner;
  return structuredClone(staff);
};

const findOwnStaff = (db: PartnerMockDb, staffId: number): MockStaffRecord => {
  const staff = db.staff.find((item) => item.id === staffId && item.ownerEmail === currentUserEmail());
  if (!staff) throw new PartnerApiError("Không tìm thấy nhân viên.", 404);
  return staff;
};

/** Bỏ quyền không hợp với vai trò (backend nên làm tương tự để không lưu quyền vượt phạm vi). */
const allowedOnly = (permissions: PartnerPermission[], position: StaffRequest["position"]) =>
  sortPermissions(permissions.filter((key) => isPermissionAllowed(key, position)));

const validateRequest = (db: PartnerMockDb, request: StaffRequest, ignoreId?: number) => {
  if (request.hotelId !== null) assertOwnsHotel(request.hotelId);
  const email = request.email.trim().toLowerCase();
  const taken = email === currentUserEmail()
    || SEEDED_ACCOUNT_EMAILS.includes(email)
    || db.staff.some((item) => item.id !== ignoreId && item.email.toLowerCase() === email);
  if (taken) throw new StaffFieldError("email", "Email này đã được dùng cho một tài khoản khác.");
};

/** Chuyển lỗi 400 nhắc tới email của API thật thành lỗi gắn trường email. */
const mapEmailError = (error: unknown): never => {
  if (error instanceof PartnerApiError && error.status === 400 && /email/i.test(error.message)) {
    throw new StaffFieldError("email", error.message);
  }
  throw error;
};

export const partnerStaffApi = {
  /** GET /api/partner/staff : nhân viên thuộc partner_profile của tài khoản đăng nhập */
  async list(): Promise<PartnerStaffDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", "/partner/staff", "Không tải được danh sách nhân viên.");
    await mockDelay(350);
    const email = currentUserEmail();
    return readMockDb().staff.filter((item) => item.ownerEmail === email).map(toDto);
  },

  /** GET /api/partner/staff/{id} */
  async get(staffId: number): Promise<PartnerStaffDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/staff/${staffId}`, "Không tải được thông tin nhân viên.");
    await mockDelay(300);
    return toDto(findOwnStaff(readMockDb(), staffId));
  },

  /**
   * POST /api/partner/staff : tạo User role PARTNER_STAFF (PENDING_VERIFICATION) + PartnerStaff,
   * gửi email mời đặt mật khẩu. Không truyền mật khẩu từ frontend.
   */
  async create(request: StaffRequest): Promise<PartnerStaffDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest<PartnerStaffDto>("post", "/partner/staff", "Không thêm được nhân viên.", request).catch(mapEmailError);
    await mockDelay(600);
    return updateMockDb((db) => {
      validateRequest(db, request);
      const staff: MockStaffRecord = {
        id: nextMockId(db),
        userId: nextMockId(db),
        ownerEmail: currentUserEmail(),
        fullName: request.fullName.trim(),
        email: request.email.trim().toLowerCase(),
        phone: request.phone,
        position: request.position,
        hotelId: request.hotelId,
        status: "PENDING_VERIFICATION",
        lastLoginAt: null,
        permissions: allowedOnly(request.permissions ?? POSITION_TEMPLATES[request.position], request.position),
      };
      db.staff.push(staff);
      return toDto(staff);
    });
  },

  /** PUT /api/partner/staff/{id} : email không đổi; đổi vai trò thì bỏ các quyền không còn hợp lệ */
  async update(staffId: number, request: StaffRequest): Promise<PartnerStaffDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest<PartnerStaffDto>("put", `/partner/staff/${staffId}`, "Không lưu được nhân viên.", request).catch(mapEmailError);
    await mockDelay(500);
    return updateMockDb((db) => {
      const staff = findOwnStaff(db, staffId);
      if (request.hotelId !== null) assertOwnsHotel(request.hotelId);
      Object.assign(staff, {
        fullName: request.fullName.trim(),
        phone: request.phone,
        position: request.position,
        hotelId: request.hotelId,
        permissions: allowedOnly(staff.permissions, request.position),
      });
      return toDto(staff);
    });
  },

  /** PATCH /api/partner/staff/{id}/status  body: { status: "ACTIVE" | "LOCKED" } */
  async setStatus(staffId: number, status: Extract<UserStatus, "ACTIVE" | "LOCKED">): Promise<PartnerStaffDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("patch", `/partner/staff/${staffId}/status`, "Không cập nhật được trạng thái.", { status });
    await mockDelay(350);
    return updateMockDb((db) => {
      const staff = findOwnStaff(db, staffId);
      if (staff.status === "PENDING_VERIFICATION" && status === "ACTIVE") {
        throw new PartnerApiError("Nhân viên chưa kích hoạt tài khoản qua email mời.", 400);
      }
      staff.status = status;
      return toDto(staff);
    });
  },

  /** POST /api/partner/staff/{id}/invite : gửi lại email mời (chỉ khi chưa kích hoạt) */
  async resendInvite(staffId: number): Promise<void> {
    if (!PARTNER_USE_MOCK) return partnerRequest("post", `/partner/staff/${staffId}/invite`, "Không gửi lại được lời mời.");
    await mockDelay(400);
    const staff = findOwnStaff(readMockDb(), staffId);
    if (staff.status !== "PENDING_VERIFICATION") throw new PartnerApiError("Tài khoản đã được kích hoạt.", 400);
  },

  /** DELETE /api/partner/staff/{id} : xóa PartnerStaff và vô hiệu hóa User */
  async remove(staffId: number): Promise<void> {
    if (!PARTNER_USE_MOCK) return partnerRequest("delete", `/partner/staff/${staffId}`, "Không xóa được nhân viên.");
    await mockDelay(400);
    updateMockDb((db) => {
      findOwnStaff(db, staffId);
      db.staff = db.staff.filter((item) => item.id !== staffId);
    });
  },

  /** PUT /api/partner/staff/{id}/permissions  body: { permissions: PartnerPermission[] } */
  async updatePermissions(staffId: number, permissions: PartnerPermission[]): Promise<PartnerStaffDto> {
    if (!PARTNER_USE_MOCK) {
      return partnerRequest("put", `/partner/staff/${staffId}/permissions`, "Không lưu được phân quyền.", { permissions: sortPermissions(permissions) });
    }
    await mockDelay(500);
    return updateMockDb((db) => {
      const staff = findOwnStaff(db, staffId);
      const invalid = permissions.filter((key) => !isPermissionAllowed(key, staff.position));
      if (invalid.length) throw new PartnerApiError("Có quyền không phù hợp với vai trò của nhân viên.", 400);
      staff.permissions = sortPermissions(permissions);
      return toDto(staff);
    });
  },
};

export default partnerStaffApi;
