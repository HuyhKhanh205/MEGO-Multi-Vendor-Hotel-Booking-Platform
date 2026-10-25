import type {
  DailyTrendPoint,
  PartnerAccount,
  PartnerNotification,
  RecentBooking,
  RoomStatusSummary,
  UrgentTask,
} from "../types/partner.types";

/** Một hotline duy nhất cho toàn bộ cổng đối tác (Figma đang dùng 2 số khác nhau). */
export const PARTNER_HOTLINE = "1900 8888";
export const PARTNER_HOTLINE_HREF = "tel:19008888";
export const PARTNER_SUPPORT_EMAIL = "partner-support@mego.vn";
export const PARTNER_PORTAL_VERSION = "v4.18.2";

/** Tài khoản demo cho môi trường mock. */
export const PARTNER_DEMO_CREDENTIALS = {
  identifier: "partner@grandsunrise.vn",
  password: "Partner@2026",
} as const;

export const PARTNER_DEMO_ACCOUNT: PartnerAccount = {
  id: "ptn-8942",
  fullName: "Trần Hoàng Sơn",
  title: "Tổng Giám Đốc (GM)",
  email: PARTNER_DEMO_CREDENTIALS.identifier,
  avatarInitials: "HS",
  hotels: [
    { id: "htl-8942", code: "HTL-8942", name: "Grand Sunrise Boutique Hotel", stars: 5, city: "Đà Nẵng" },
  ],
};

/** "Hôm nay" của bộ dữ liệu mẫu. */
export const MOCK_TODAY = "2025-10-15";
export const MOCK_SYNCED_AT = "2025-10-15T10:42:00";

const trendSeed: Array<[day: number, revenueMillion: number, occupancyPct: number]> = [
  [1, 7.2, 78], [2, 6.8, 76], [3, 7.5, 80], [4, 8.6, 83], [5, 9.4, 90],
  [6, 7.9, 82], [7, 6.4, 74], [8, 8.1, 81], [9, 8.7, 84], [10, 10.2, 88],
  [11, 12.0, 92], [12, 11.3, 91], [13, 7.1, 79], [14, 7.65, 82], [15, 9.6, 76],
];

/** Doanh thu & công suất theo ngày từ 01/10 tới hôm nay. */
export const MOCK_TREND: DailyTrendPoint[] = trendSeed.map(([day, revenueMillion, occupancyPct]) => ({
  date: `2025-10-${String(day).padStart(2, "0")}`,
  revenue: Math.round(revenueMillion * 1_000_000),
  occupancyPct,
}));

/** Tổng 37 phòng: 28 + 6 + 2 + 1. Công suất "hôm nay" trong MOCK_TREND = 28/37 ≈ 76%. */
export const MOCK_ROOM_STATUS: RoomStatusSummary = {
  occupied: 28,
  vacantReady: 6,
  cleaning: 2,
  maintenance: 1,
};

export const MOCK_URGENT_TASKS: UrgentTask[] = [
  { id: "early-checkin", label: "Check-in sớm (trước 12:00)", count: 2 },
  { id: "vat-invoice", label: "Yêu cầu xuất hóa đơn VAT (VNPAY)", count: 1 },
];

/** Số liệu so sánh kỳ trước & lượt đặt theo từng kỳ lọc. */
export const MOCK_PERIOD_STATS = {
  TODAY: { revenueChangePct: 6.1, occupancyChangePct: -2.0, bookings: 9 },
  LAST_7_DAYS: { revenueChangePct: 9.3, occupancyChangePct: 3.1, bookings: 61 },
  THIS_MONTH: { revenueChangePct: 14.8, occupancyChangePct: 5.3, bookings: 142 },
} as const;

export const MOCK_DISPATCH_TODAY = { checkIns: 12, checkOuts: 8, newBookings24h: 18 };
export const MOCK_OCCUPANCY_TARGET = 80;

export const MOCK_RECENT_BOOKINGS: RecentBooking[] = [
  {
    code: "MG-84920", guestName: "Hoàng Nam Hải", guestNote: "+84 912 *** 849",
    roomType: "Deluxe Ocean View", roomNumber: "402", bedInfo: "1 giường King",
    checkIn: "2025-10-15", checkOut: "2025-10-18", guests: 2, totalAmount: 4_650_000,
    paymentMethod: "VNPAY", paymentStatus: "PAID", stayStatus: "ARRIVING", expectedTime: "11:30",
  },
  {
    code: "MG-84918", guestName: "Michael Jenkins", guestNote: "USA · Hộ chiếu 582•••",
    roomType: "Grand Suite Balcony", roomNumber: "501", bedInfo: "Bồn tắm view biển",
    checkIn: "2025-10-14", checkOut: "2025-10-19", guests: 2, totalAmount: 12_800_000,
    paymentMethod: "Visa", paymentStatus: "CARD_GUARANTEE", stayStatus: "IN_HOUSE",
  },
  {
    code: "MG-84905", guestName: "Trịnh Thu Thảo", guestNote: "Khách doanh nghiệp",
    roomType: "Executive City View", roomNumber: "308", bedInfo: "2 giường đơn",
    checkIn: "2025-10-15", checkOut: "2025-10-16", guests: 1, totalAmount: 1_850_000,
    paymentMethod: "Tại khách sạn", paymentStatus: "PAY_AT_HOTEL", stayStatus: "CONFIRMED",
  },
  {
    code: "MG-84882", guestName: "Đỗ Khắc Cường", guestNote: "+84 903 *** 112",
    roomType: "Family Premium Suite", roomNumber: "201", bedInfo: "2 giường Queen",
    checkIn: "2025-10-12", checkOut: "2025-10-15", guests: 4, totalAmount: 7_200_000,
    paymentMethod: "VNPAY", paymentStatus: "PAID", stayStatus: "DEPARTING", expectedTime: "12:00",
  },
  {
    code: "MG-84877", guestName: "Lê Hoàng Long", guestNote: "Hội viên Gold",
    roomType: "Deluxe Ocean View", roomNumber: "405", bedInfo: "1 giường King",
    checkIn: "2025-10-13", checkOut: "2025-10-16", guests: 2, totalAmount: 4_350_000,
    paymentMethod: "MoMo", paymentStatus: "PAID", stayStatus: "IN_HOUSE",
  },
  {
    code: "MG-84870", guestName: "Phạm Thu Thảo", guestNote: "+84 934 *** 905",
    roomType: "Family Ocean Panorama", roomNumber: "210", bedInfo: "2 giường Queen",
    checkIn: "2025-10-18", checkOut: "2025-10-20", guests: 4, totalAmount: 7_300_000,
    paymentMethod: "Tại khách sạn", paymentStatus: "PAY_AT_HOTEL", stayStatus: "CONFIRMED",
  },
  {
    code: "MG-84861", guestName: "Nguyễn Văn An", guestNote: "Hội viên VIP Gold",
    roomType: "Premier Executive Suite", roomNumber: "602", bedInfo: "1 giường King",
    checkIn: "2025-10-15", checkOut: "2025-10-17", guests: 2, totalAmount: 4_700_000,
    paymentMethod: "Visa", paymentStatus: "PAID", stayStatus: "ARRIVING", expectedTime: "14:00",
  },
  {
    code: "MG-84859", guestName: "Takeshi Sato", guestNote: "Japan · Hộ chiếu 771•••",
    roomType: "Executive Penthouse", roomNumber: "901", bedInfo: "1 giường King",
    checkIn: "2025-10-11", checkOut: "2025-10-15", guests: 2, totalAmount: 9_200_000,
    paymentMethod: "Mastercard", paymentStatus: "PAID", stayStatus: "DEPARTING", expectedTime: "11:00",
  },
];

export const MOCK_NOTIFICATIONS: PartnerNotification[] = [
  { id: "n1", title: "Đơn mới #MG-84920", description: "Hoàng Nam Hải · Deluxe Ocean View · 3 đêm", time: "10:38", unread: true },
  { id: "n2", title: "Yêu cầu check-in sớm", description: "#MG-84861 dự kiến đến lúc 11:00", time: "10:15", unread: true },
  { id: "n3", title: "Yêu cầu xuất hóa đơn VAT", description: "#MG-84905 · Công ty TNHH Thiên Phúc", time: "09:52", unread: true },
  { id: "n4", title: "Đánh giá mới 5★", description: "Nguyễn Thảo My · Deluxe Ocean View", time: "08:20", unread: false },
  { id: "n5", title: "Đã đồng bộ giá OTA", description: "Booking.com, Agoda · 4 hạng phòng", time: "07:00", unread: false },
];
