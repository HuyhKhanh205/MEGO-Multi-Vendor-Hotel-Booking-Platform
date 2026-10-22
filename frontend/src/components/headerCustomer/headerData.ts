import type { NavItem, NotificationItem, SupportContact } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { id: "explore", label: "Khám phá", path: "/explore" },
  { id: "hotels", label: "Khách sạn", path: "/hotels" },
  { id: "offers", label: "Ưu đãi", path: "/offers" },
  { id: "my-bookings", label: "Đặt chỗ của tôi", path: "/my-bookings" },
];

export const LANGUAGES = [
  { code: "VI", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", name: "English", flag: "🇬🇧" },
];

export const SUPPORT_INFO: SupportContact = {
  hotline: "1900 6868",
  hotlineTime: "24/7 (Cước phí 1.000đ/phút)",
  email: "support@mego.vn",
  onlineStaff: 3,
};

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Chào mừng bạn đến với MeGo! 🎉",
    content: "Đăng ký thành viên để nhận voucher giảm 15% cho lần đặt phòng đầu tiên.",
    time: "5 phút trước",
    isRead: false,
    type: "promo",
  },
  {
    id: "notif-2",
    title: "Cập nhật đơn đặt phòng",
    content: "Đơn đặt phòng #MG8923 tại Đà Lạt của bạn đang chờ xác nhận.",
    time: "2 giờ trước",
    isRead: false,
    type: "booking",
  },
  {
    id: "notif-3",
    title: "Ưu đãi mùa hè rực rỡ",
    content: "Giảm tới 30% cho các khu nghỉ dưỡng ven biển Nha Trang & Phú Quốc.",
    time: "1 ngày trước",
    isRead: true,
    type: "promo",
  },
];
