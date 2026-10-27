import type { PartnerPermission, StaffPosition, UserStatus } from "../../types/backend.types";

export interface PermissionDefinition {
  key: PartnerPermission;
  label: string;
  description: string;
  /** Vai trò được phép bật quyền này; không khai báo = mọi vai trò. Mảng rỗng = chỉ chủ cơ sở. */
  allowedPositions?: StaffPosition[];
}

export interface PermissionGroup {
  id: string;
  title: string;
  permissions: PermissionDefinition[];
}

export const POSITION_LABELS: Record<StaffPosition, string> = {
  FRONT_DESK: "Lễ tân",
  DUTY_MANAGER: "Quản lý ca",
  ACCOUNTANT: "Kế toán",
  HOUSEKEEPING: "Buồng phòng",
};

export const POSITION_OPTIONS = (Object.keys(POSITION_LABELS) as StaffPosition[]).map((value) => ({ value, label: POSITION_LABELS[value] }));

export const POSITION_PILL_CLASS: Record<StaffPosition, string> = {
  FRONT_DESK: "bg-blue-50 text-blue-700",
  DUTY_MANAGER: "bg-violet-50 text-violet-700",
  ACCOUNTANT: "bg-amber-50 text-amber-700",
  HOUSEKEEPING: "bg-teal-50 text-teal-700",
};

export const STAFF_STATUS_META: Record<UserStatus, { label: string; className: string; dot: string }> = {
  ACTIVE: { label: "Đang hoạt động", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  PENDING_VERIFICATION: { label: "Chờ kích hoạt", className: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  LOCKED: { label: "Đã khóa", className: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "booking",
    title: "Đơn đặt phòng & buồng phòng",
    permissions: [
      { key: "BOOKING_VIEW", label: "Xem danh sách đặt phòng", description: "Xem thông tin đơn, lịch nhận/trả phòng của khách." },
      { key: "BOOKING_CHECKIN_CHECKOUT", label: "Nhận phòng / Trả phòng", description: "Xác nhận khách đã đến, gán số phòng và hoàn tất trả phòng." },
      { key: "BOOKING_GUEST_NOTES", label: "Ghi chú yêu cầu của khách", description: "Thêm ghi chú (giường phụ, đón sân bay…) cho bộ phận vận hành." },
      { key: "BOOKING_SURCHARGE", label: "Thêm phụ thu dịch vụ", description: "Ghi nhận minibar, giặt là, trả phòng muộn vào hóa đơn của khách." },
      { key: "BOOKING_CANCEL_NOSHOW", label: "Hủy đơn & đánh dấu No-show", description: "Xử lý hủy đơn, áp phí hủy và ghi nhận khách không đến.", allowedPositions: ["DUTY_MANAGER"] },
    ],
  },
  {
    id: "rates",
    title: "Giá phòng & tồn kho",
    permissions: [
      { key: "RATE_VIEW", label: "Xem lịch giá & tồn kho", description: "Xem giá theo ngày và số phòng còn trống." },
      { key: "RATE_EDIT", label: "Chỉnh giá phòng", description: "Đổi giá theo ngày hoặc cập nhật giá hàng loạt." },
      { key: "INVENTORY_STOP_SELL", label: "Đóng/mở bán & tồn kho", description: "Khóa bán, mở bán lại và chỉnh số phòng mở bán." },
      { key: "PROMOTION_MANAGE", label: "Quản lý khuyến mãi", description: "Tạo, sửa, tạm dừng chương trình khuyến mãi và voucher." },
    ],
  },
  {
    id: "finance",
    title: "Tài chính & báo cáo",
    permissions: [
      { key: "FINANCE_REPORT_VIEW", label: "Xem báo cáo doanh thu", description: "Xem doanh thu, công suất và đối soát theo kỳ.", allowedPositions: ["ACCOUNTANT", "DUTY_MANAGER"] },
      { key: "FINANCE_INVOICE", label: "Xuất hóa đơn VAT", description: "Lập và gửi hóa đơn điện tử cho khách/doanh nghiệp.", allowedPositions: ["ACCOUNTANT"] },
      { key: "FINANCE_PAYOUT", label: "Yêu cầu rút tiền", description: "Rút tiền về tài khoản ngân hàng của đối tác.", allowedPositions: [] },
    ],
  },
  {
    id: "operations",
    title: "Đánh giá & vận hành",
    permissions: [
      { key: "REVIEW_VIEW", label: "Xem đánh giá của khách", description: "Xem điểm và nội dung đánh giá sau lưu trú." },
      { key: "REVIEW_REPLY", label: "Phản hồi đánh giá", description: "Trả lời công khai đánh giá thay mặt khách sạn." },
      { key: "REVIEW_REPORT", label: "Báo cáo đánh giá vi phạm", description: "Gửi yêu cầu MeGo xem xét đánh giá sai sự thật." },
      { key: "HOTEL_INFO_EDIT", label: "Sửa thông tin khách sạn", description: "Cập nhật mô tả, tiện ích, chính sách và hình ảnh." },
    ],
  },
];

export const ALL_PERMISSIONS: PermissionDefinition[] = PERMISSION_GROUPS.flatMap((group) => group.permissions);

/** Bộ quyền mặc định theo vai trò (mẫu áp nhanh ở màn Phân quyền và khi tạo nhân viên mới). */
export const POSITION_TEMPLATES: Record<StaffPosition, PartnerPermission[]> = {
  FRONT_DESK: ["BOOKING_VIEW", "BOOKING_CHECKIN_CHECKOUT", "BOOKING_GUEST_NOTES", "BOOKING_SURCHARGE", "RATE_VIEW", "REVIEW_VIEW"],
  DUTY_MANAGER: [
    "BOOKING_VIEW", "BOOKING_CHECKIN_CHECKOUT", "BOOKING_GUEST_NOTES", "BOOKING_SURCHARGE", "BOOKING_CANCEL_NOSHOW",
    "RATE_VIEW", "RATE_EDIT", "INVENTORY_STOP_SELL", "FINANCE_REPORT_VIEW", "REVIEW_VIEW", "REVIEW_REPLY", "REVIEW_REPORT",
  ],
  ACCOUNTANT: ["BOOKING_VIEW", "RATE_VIEW", "FINANCE_REPORT_VIEW", "FINANCE_INVOICE"],
  HOUSEKEEPING: ["BOOKING_VIEW", "BOOKING_GUEST_NOTES"],
};

/** Lý do quyền bị khóa với vai trò này; null = được phép bật. */
export const permissionLockReason = (permission: PermissionDefinition, position: StaffPosition): string | null => {
  const allowed = permission.allowedPositions;
  if (!allowed || allowed.includes(position)) return null;
  if (allowed.length === 0) return "Chỉ chủ cơ sở được thực hiện";
  return `Chỉ dành cho ${allowed.map((item) => POSITION_LABELS[item]).join(" / ")}`;
};

export const isPermissionAllowed = (key: PartnerPermission, position: StaffPosition): boolean => {
  const definition = ALL_PERMISSIONS.find((item) => item.key === key);
  return !!definition && permissionLockReason(definition, position) === null;
};

/** Thứ tự ổn định theo catalog để so sánh "có thay đổi" và gửi lên backend. */
export const sortPermissions = (permissions: PartnerPermission[]): PartnerPermission[] => {
  const order = new Map(ALL_PERMISSIONS.map((item, index) => [item.key, index]));
  return [...new Set(permissions)].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
};
