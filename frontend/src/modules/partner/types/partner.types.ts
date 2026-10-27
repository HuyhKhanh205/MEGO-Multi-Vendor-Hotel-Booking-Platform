export type DashboardPeriod = "TODAY" | "LAST_7_DAYS" | "THIS_MONTH";

export interface PartnerKpis {
  revenue: number;
  revenueChangePct: number;
  occupancyPct: number;
  occupancyChangePct: number;
  occupancyTargetPct: number;
  bookings: number;
  newBookings24h: number;
  checkInsToday: number;
  checkOutsToday: number;
}

export interface DailyTrendPoint {
  /** ISO date yyyy-MM-dd */
  date: string;
  /** Doanh thu theo ngày (VND) */
  revenue: number;
  occupancyPct: number;
}

/** Nguồn duy nhất cho mọi con số về tình trạng phòng trên dashboard. */
export interface RoomStatusSummary {
  occupied: number;
  vacantReady: number;
  cleaning: number;
  maintenance: number;
}

export type PaymentStatus = "PAID" | "CARD_GUARANTEE" | "PAY_AT_HOTEL";
export type StayStatus = "ARRIVING" | "IN_HOUSE" | "CONFIRMED" | "DEPARTING";

export interface RecentBooking {
  code: string;
  guestName: string;
  guestNote: string;
  roomType: string;
  roomNumber: string;
  bedInfo: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  stayStatus: StayStatus;
  /** Giờ dự kiến (HH:mm) cho khách sắp đến / sắp trả phòng */
  expectedTime?: string;
}

export interface UrgentTask {
  id: string;
  label: string;
  count: number;
}

export interface PartnerNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export interface PartnerDashboardData {
  /** ISO datetime của lần đồng bộ OTA gần nhất */
  syncedAt: string;
  /** ISO date của "hôm nay" trong dữ liệu */
  today: string;
  kpis: PartnerKpis;
  trend: DailyTrendPoint[];
  roomStatus: RoomStatusSummary;
  urgentTasks: UrgentTask[];
  recentBookings: RecentBooking[];
  totalBookings: number;
}

// ─── Onboarding đối tác (P20 / P21) ─────────────────────────────────────────

export type HotelCategory = "RESORT" | "HOTEL_4_5_STAR" | "VILLA" | "BOUTIQUE";
export type PayoutCycle = "WEEKLY" | "MONTHLY";
export type DocumentCategory = "ID_FRONT" | "ID_BACK" | "BUSINESS_LICENSE" | "FIRE_SAFETY";

export interface OnboardingForm {
  representativeName: string;
  phone: string;
  email: string;
  password: string;
  propertyName: string;
  starRating: string;
  hotelCategory: HotelCategory | "";
  address: string;
  totalRooms: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  bankBranch: string;
  payoutCycle: PayoutCycle;
  acceptedTerms: boolean;
}

/** Bản nháp không lưu mật khẩu. */
export type OnboardingDraft = Omit<OnboardingForm, "password">;

export interface ApplicationDocument {
  category: DocumentCategory;
  fileName: string;
  size: number;
  mimeType: string;
}

/** Khớp enum PartnerApprovalStatus của backend. REJECTED kèm rejectReason = hồ sơ cần bổ sung / bị từ chối. */
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface PartnerApplication {
  code: string;
  representativeName: string;
  email: string;
  propertyName: string;
  hotelCategory: HotelCategory;
  totalRooms: number;
  documents: ApplicationDocument[];
  /** ISO datetime */
  submittedAt: string;
  /** ISO datetime: hạn SLA 24h */
  slaDueAt: string;
  status: ApplicationStatus;
  /** partner_profiles.reject_reason; mỗi dòng là một yêu cầu bổ sung */
  rejectReason: string | null;
  /** Dữ liệu form đã gửi (không gồm mật khẩu) để bổ sung khi bị yêu cầu */
  formSnapshot: OnboardingDraft;
}
