import type {
  BrandSectionData,
  FooterColumnData,
  PaymentSectionData,
  FooterLink,
} from "./types";

export const BRAND_DATA: BrandSectionData = {
  description:
    "Nền tảng đặt phòng khách sạn, resort ven biển và căn hộ nghỉ dưỡng hàng đầu Đông Nam Á. Cam kết giá tốt nhất, xác nhận tức thì và hỗ trợ chuyên nghiệp 24/7 trên toàn quốc.",
  hotlineTitle: "HOTLINE HỖ TRỢ KHÁCH HÀNG & ĐỐI TÁC",
  hotline: "1900 1234",
  hotlineTel: "19001234",
};

export const SERVICES_DESTINATIONS_DATA: FooterColumnData = {
  title: "DỊCH VỤ & ĐIỂM ĐẾN",
  links: [
    {
      id: "hotel-danang",
      label: "Khách sạn Đà Nẵng",
      path: "/hotels?destination=Da%20Nang",
    },
    {
      id: "resort-phuquoc",
      label: "Resort Phú Quốc cao cấp",
      path: "/hotels?destination=Phu%20Quoc&type=resort",
    },
    {
      id: "hotel-nhatrang",
      label: "Khách sạn Nha Trang",
      path: "/hotels?destination=Nha%20Trang",
    },
    {
      id: "combo-flight-hotel",
      label: "Combo vé máy bay & khách sạn",
      path: "/offers?category=combo",
    },
    {
      id: "villa-vungtau",
      label: "Biệt thự nghỉ dưỡng Vũng Tàu",
      path: "/hotels?destination=Vung%20Tau&type=villa",
    },
  ],
};

export const POLICIES_ASSURANCE_DATA: FooterColumnData = {
  title: "CHÍNH SÁCH & AN TÂM",
  links: [
    {
      id: "policy-refund",
      label: "Chính sách hoàn tiền nhanh",
      path: "/policies/refund",
      isPlaceholder: true,
    },
    {
      id: "policy-best-price",
      label: "Đảm bảo giá tốt nhất",
      path: "/policies/best-price",
      isPlaceholder: true,
    },
    {
      id: "policy-terms",
      label: "Điều khoản & Điều kiện đặt phòng",
      path: "/policies/terms",
      isPlaceholder: true,
    },
    {
      id: "policy-privacy",
      label: "Bảo mật thông tin thanh toán",
      path: "/policies/privacy",
      isPlaceholder: true,
    },
    {
      id: "policy-operating",
      label: "Quy chế hoạt động MeGo",
      path: "/policies/operating-regulations",
      isPlaceholder: true,
    },
  ],
};

export const PAYMENT_SECURITY_DATA: PaymentSectionData = {
  title: "CỔNG THANH TOÁN BẢO MẬT",
  description: "Mã hóa 256-bit chuẩn PCI-DSS quốc tế.",
  rows: [
    [
      { id: "vnpay-qr", label: "VNPAY-QR" },
      { id: "visa", label: "VISA" },
    ],
    [
      { id: "mastercard", label: "MASTERCARD" },
      { id: "momo", label: "MOMO" },
    ],
    [{ id: "vietqr", label: "VIETQR" }],
  ],
  disclaimer:
    "Mô tả bảo mật và cổng thanh toán cần được xác nhận với thông tin chính thức của hệ thống trước khi đưa lên production.",
};

export const BOTTOM_UTILITY_LINKS: FooterLink[] = [
  {
    id: "bottom-support",
    label: "Trung tâm trợ giúp",
    path: "/support",
  },
  {
    id: "bottom-cookie",
    label: "Chính sách Cookie",
    path: "/policies/cookies",
    isPlaceholder: true,
  },
  {
    id: "bottom-sitemap",
    label: "Sitemap",
    path: "/sitemap",
    isPlaceholder: true,
  },
];
