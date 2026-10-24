import type {
  OfferCategoryTab,
  PlatformVoucherItem,
  DestinationDealItem,
  FinancialPartnerDealItem,
  MeGoClubRedeemOption,
} from "./types";

export const TOP_NOTIFICATION = {
  badge: "Chỉ hôm nay",
  message: "Đại tiệc Du lịch Hè 2026: Tặng thêm voucher 500.000đ cho đơn phòng thứ 2!",
  guarantee: "Cam kết phòng thật - Giá thực tế",
  hotline: "1900 6868",
};

export const HERO_FLASH_SALE = {
  badge: "Đang diễn ra • Sự kiện độc quyền",
  title: "Mùa Hè Rực Rỡ MeGo",
  subtitle: "Giảm tới 40% Khách sạn & Resort Ven Biển Toàn Quốc",
  description:
    "Tận hưởng kỳ nghỉ sang trọng tại các bãi biển trác tuyệt Đà Nẵng, Phú Quốc, Nha Trang với mức trợ giá đặc quyền từ hơn 450+ khách sạn đối tác MeGo.",
  couponCode: "MEGOSUMMER25",
  couponBadge: "Mã toàn sàn VIP",
  couponStatus: "Số lượng có hạn",
  couponDesc: "Giảm ngay 20% tối đa 500.000đ cho đơn phòng biển từ 2.000.000đ",
  showcase: {
    badge: "Resort Biển Hot Nhất Tuần",
    discountBadge: "-40% OFF",
    roomType: "Premier Ocean Sanctuary",
    hotelName: "InterContinental Danang Sun Peninsula Resort",
    hotelId: "grand-sunrise-boutique-hotel-da-nang",
    rating: 9.6,
    ratingText: "Tuyệt hảo",
    originalPrice: 6800000,
    pricePerNight: 4080000,
    policyText: "Hủy miễn phí",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ_h-iRzIMKuPnGuq27rrUXmFIBldvlBpc7m7AO50r0l_-3BBrDL8wdOOgpYfxkZxbgfpUsUW04NftWMGD-GCk-Th6KmkX5UDq9kMv5ugAq7l2DWfcm-VMSiMOVsBrUhhsO0J734b53g9UyIfGL0SkcOPINZ0cxNMY9AMlOZrz77JLVJb2UKFo7kCs5lXJu29OoJVvuMA_37JMRt3xmR-NQWYHyxDRY1C-68-CtI9ZAyghhPxghRI2",
    travelersApplied: "1.420+",
  },
};

export const CATEGORY_TABS: OfferCategoryTab[] = [
  { id: "all", label: "Tất cả ưu đãi", iconName: "verified", badgeCount: 128 },
  { id: "club", label: "Hội viên MeGo Club VIP", iconName: "workspace_premium" },
  { id: "partners", label: "Đối tác Ngân hàng & Ví", iconName: "account_balance_wallet" },
  { id: "combo", label: "Combo Nghỉ dưỡng + Vé máy bay", iconName: "flight_takeoff" },
  { id: "early-bird", label: "Early Bird - Đặt sớm", iconName: "schedule" },
];

export const PLATFORM_VOUCHERS: PlatformVoucherItem[] = [
  {
    id: "v-megosea",
    code: "MEGOSEA",
    tag: "Biển Miền Trung",
    tagBgClass: "bg-tertiary-fixed",
    tagTextClass: "text-on-tertiary-fixed",
    expiryDate: "HSD: 30/06/2026",
    discountTitle: "Giảm 450.000đ",
    description: "Đơn từ 3.000.000đ áp dụng toàn bộ khách sạn tại Đà Nẵng, Quy Nhơn, Nha Trang.",
    remainingText: "Còn 42 lượt",
    minBookingValue: 3000000,
    category: "all",
  },
  {
    id: "v-welcomevip",
    code: "WELCOMEVIP",
    tag: "Bạn mới MeGo",
    tagBgClass: "bg-secondary-fixed",
    tagTextClass: "text-on-secondary-fixed",
    expiryDate: "Không giới hạn",
    discountTitle: "Giảm thẳng 300K",
    description: "Áp dụng cho đơn đặt phòng đầu tiên của tài khoản mới với hóa đơn từ 1.200.000đ.",
    remainingText: "Ưu tiên kích hoạt",
    minBookingValue: 1200000,
    category: "club",
  },
  {
    id: "v-vnpay100",
    code: "VNPAY100",
    tag: "Đối tác VNPay",
    tagBgClass: "bg-primary-fixed",
    tagTextClass: "text-on-primary-fixed",
    expiryDate: "HSD: 15/07/2026",
    discountTitle: "Giảm 100.000đ",
    description: "Giảm trực tiếp khi quét thanh toán VNPay-QR qua ứng dụng ngân hàng liên kết.",
    remainingText: "Còn 185 lượt",
    minBookingValue: 1000000,
    category: "partners",
  },
  {
    id: "v-weekenddeal",
    code: "WEEKENDDEAL",
    tag: "Cuối tuần chill",
    tagBgClass: "bg-tertiary-fixed",
    tagTextClass: "text-on-tertiary-fixed",
    expiryDate: "Mỗi Thứ 6 - CN",
    discountTitle: "Giảm 200.000đ",
    description: "Dành riêng cho kỳ nghỉ cuối tuần từ Thứ 6 đến Chủ Nhật tại các thành phố du lịch.",
    remainingText: "Tự động làm mới",
    minBookingValue: 1800000,
    category: "all",
  },
];

export const DESTINATION_DEALS: DestinationDealItem[] = [
  {
    id: "dest-danang",
    name: "Đà Nẵng & Hội An",
    tagline: "Thành phố đáng sống",
    discountText: "Giảm đến 40%",
    hotelCountText: "Hơn 120+ Resort đối tác",
    destination: "Đà Nẵng",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrHA7VJn77MisFNxxX1fB7CnTrHF3LOdXvX45b0g8yYsE5KWYDPjQL7F1-b5De8JaL_QnoEoWRuWEKEdOOa-f1o6uRSC7qSDbRGIK5JkI8xNU-DZmmQgHM-UawVFudVJ8JA0eprrTMbSVUg6kcRjziROyHaQeqy403Cps2cY0nZLRk7qORdenNSBXcpPkdFM5HKTA6hOn13VbFU9k6VBF_GvrpQqsxgxLW0TXaYirQVAhw2X782g9o",
  },
  {
    id: "dest-phuquoc",
    name: "Phú Quốc",
    tagline: "Đảo Ngọc Biển Xanh",
    discountText: "Giảm đến 35%",
    hotelCountText: "Hơn 85+ Resort & Villa",
    destination: "Phú Quốc",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_F8o5vzjZMRsrQZTb0eFGnEeLKQSu6XCTL5UsApbnOWcIVjERhZUyylrONx-JhMnbKFUzo05f4hUJ2sbb8v-66eVLBdxT63Cp5ChrZlHl5W0LQoQroID7j1d6HgosNSDyp1-D-uJEVljXk7NyZeJE_FKiraG2gCvII5RFO8PX64gYDZiG9l0B0cXD8IdAFj6xH5efKjG3kxd4NELA3ure6NicAPekMmiFBMYykK66azGFl0EeohDs",
  },
  {
    id: "dest-nhatrang",
    name: "Nha Trang",
    tagline: "Vịnh Biển Thiên Đường",
    discountText: "Giảm đến 30%",
    hotelCountText: "Hơn 95+ Khách sạn biển",
    destination: "Nha Trang",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXJhAkTrl9igVShyla9iad0yu-ABpl02lpk6R_2qHFtlVr_iTv5GjqTrRGFFxwhSceqJW506VBl9t0bwjQZVZuuy992aFH3YA94Vzt1mPr3TRsTnfgocmTNA6TPvZ3NjNLHLn9zRGTWZNILtW_gG2lJqyfELb0pe-zrh-KQh3C0cRhiZV3pWPSh5_roFOY9rH4FlqaJ3EfvQQc3RqZmL-aHszVScRA33tuJYkXP91yj6r8X4uEUakf",
  },
  {
    id: "dest-dalat",
    name: "Đà Lạt",
    tagline: "Cao Nguyên Ngàn Hoa",
    discountText: "Giảm đến 25%",
    hotelCountText: "Hơn 110+ Homestay & Villa",
    destination: "Đà Lạt",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIq6Nm9kdRi3OR5xEXkB63QRzE2NaVWNFEIYcxh1I7PCrb2Dtrt9RKLismOZinO0vUXQ4gXtLpomoI9I0BXPmJaE1gL58sZzk60BugE6NJnN2yX5APBk5Yxbeb7oGzTi34IDLMrY1Cf_kDaZTS-pYFwVyeTUQebZN_WzS7Y1iz7euFqKW-abUsxRDWIYa6yTUSpgKKxA3zfFG0Mol4LZPakFiCxSIkJVarf3GJ3KrOeiqKXi8hdpXW",
  },
];

export const FINANCIAL_PARTNERS: FinancialPartnerDealItem[] = [
  {
    id: "fp-vnpay",
    partnerName: "VNPAY-QR",
    partnerColorClass: "text-primary",
    badge: "Mỗi Thứ 3 & 5",
    badgeBgClass: "bg-primary-fixed text-on-primary-fixed",
    discountTitle: "Giảm 15% tối đa 200k",
    description: "Nhập mã MEGOVNPAY tại cổng thanh toán VNPAY.",
    promoCode: "MEGOVNPAY",
    terms: "Áp dụng cho mọi ngân hàng liên kết qua cổng VNPAY-QR.",
  },
  {
    id: "fp-vcb",
    partnerName: "Vietcombank",
    partnerColorClass: "text-tertiary",
    badge: "Thẻ Visa/Master",
    badgeBgClass: "bg-tertiary-fixed text-on-tertiary-fixed",
    discountTitle: "Giảm 300.000đ",
    description: "Cho hóa đơn đặt resort từ 2.500.000đ khi thanh toán bằng thẻ tín dụng VCB.",
    terms: "Áp dụng từ nay đến 31/08/2026.",
  },
  {
    id: "fp-visa",
    partnerName: "VISA Signature",
    partnerColorClass: "text-on-surface",
    badge: "Khách VIP",
    badgeBgClass: "bg-secondary-fixed text-on-secondary-fixed",
    discountTitle: "Giảm 10% không giới hạn",
    description: "Đặc quyền dành cho chủ thẻ Visa Infinite và Signature trên danh mục Luxury Resorts.",
    terms: "Bao gồm dịch vụ đưa đón sân bay miễn phí.",
  },
  {
    id: "fp-momo",
    partnerName: "Ví MoMo",
    partnerColorClass: "text-error",
    badge: "Ví Trả Sau",
    badgeBgClass: "bg-error-container text-error",
    discountTitle: "Hoàn tiền 120.000đ",
    description: "Khi chọn Ví Trả Sau MoMo hoặc trả góp 0% lãi suất cho mọi kỳ nghỉ dưỡng.",
    terms: "Hoàn xu tích lũy dùng cho đơn phòng kế tiếp.",
  },
];

export const MEGO_CLUB_REDEEM_OPTIONS: MeGoClubRedeemOption[] = [
  {
    id: "opt-100k",
    voucherValue: 100000,
    voucherLabel: "Voucher 100.000đ",
    pointsRequired: 1000,
  },
  {
    id: "opt-250k",
    voucherValue: 250000,
    voucherLabel: "Voucher 250.000đ",
    pointsRequired: 2400,
  },
];
