import type {
  BenefitItem,
  FeaturedHotel,
  DestinationItem,
  TestimonialItem,
} from "../types/homeTypes";

export const SEARCH_SUGGESTION_TAGS = [
  { id: "beach-resort", label: "Resort sát biển", query: "resort" },
  { id: "5-star", label: "Khách sạn 5 sao", query: "5-star" },
  { id: "infinity-pool", label: "Hồ bơi vô cực", query: "pool" },
  { id: "city-center", label: "Gần trung tâm", query: "center" },
  { id: "hot-deals", label: "Ưu đãi hot", query: "deals" },
];

export const BENEFITS_DATA: BenefitItem[] = [
  {
    id: "benefit-price",
    title: "Giá tốt nhất",
    description: "Kết nối trực tiếp đối tác khách sạn, cam kết mức giá tối ưu không qua phí trung gian.",
    iconName: "tag",
    badge: "Tiết kiệm đến 25%",
  },
  {
    id: "benefit-support",
    title: "Hỗ trợ chuyên nghiệp 24/7",
    description: "Đội ngũ tư vấn viên bản địa đồng hành cùng bạn trước, trong và sau kỳ nghỉ.",
    iconName: "clock",
    badge: "Hotline 1900 1234",
  },
  {
    id: "benefit-cancel",
    title: "Hủy linh hoạt",
    description: "Dễ dàng thay đổi kế hoạch du lịch với chính sách hủy phòng miễn phí minh bạch.",
    iconName: "refresh",
    badge: "An tâm đặt chỗ",
  },
  {
    id: "benefit-security",
    title: "Bảo mật thanh toán",
    description: "Giao dịch mã hóa an toàn qua cổng VNPay, thẻ quốc tế và mã QR tiện lợi.",
    iconName: "shield",
    badge: "Mã hóa 256-bit",
  },
];

export const FEATURED_HOTELS_DATA: FeaturedHotel[] = [
  {
    id: "furama-resort-da-nang",
    name: "Furama Resort Đà Nẵng",
    city: "Đà Nẵng",
    area: "Bãi biển Bắc Mỹ An",
    rating: 4.9,
    reviewCount: 1240,
    ratingText: "Xuất sắc",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    amenities: ["Hồ bơi vô cực", "Bãi biển riêng", "Bữa sáng buffet", "Spa & Gym"],
    originalPrice: 3800000,
    salePrice: 2850000,
    discountPercent: 25,
    isPopular: true,
    badge: "Bán chạy nhất",
    distanceToBeach: "Cách biển 50m",
  },
  {
    id: "vinpearl-resort-spa-nha-trang",
    name: "Vinpearl Resort & Spa Nha Trang",
    city: "Nha Trang",
    area: "Đảo Hòn Tre",
    rating: 4.8,
    reviewCount: 980,
    ratingText: "Tuyệt vời",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    amenities: ["Công viên nước", "Cáp treo vượt biển", "Nhà hàng 5 sao", "Đưa đón sân bay"],
    originalPrice: 3500000,
    salePrice: 2690000,
    discountPercent: 23,
    isPopular: true,
    badge: "Ưu đãi hè",
    distanceToBeach: "Mặt biển",
  },
  {
    id: "jw-marriott-phu-quoc",
    name: "JW Marriott Emerald Bay Phú Quốc",
    city: "Phú Quốc",
    area: "Bãi Khem",
    rating: 4.9,
    reviewCount: 1560,
    ratingText: "Đẳng cấp quốc tế",
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    amenities: ["Thiết kế Bill Bensley", "Bãi Khem tuyệt đẹp", "Hồ bơi vỏ sò", "Bar bãi biển"],
    originalPrice: 6200000,
    salePrice: 4890000,
    discountPercent: 21,
    isPopular: true,
    badge: "Hạng sang",
    distanceToBeach: "Sát bờ cát trắng",
  },
  {
    id: "the-imperial-hotel-vung-tau",
    name: "The Imperial Hotel Vũng Tàu",
    city: "Vũng Tàu",
    area: "Bãi Sau",
    rating: 4.7,
    reviewCount: 840,
    ratingText: "Rất tốt",
    imageUrl:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    amenities: ["Kiến trúc cổ điển", "Beach Club riêng", "Hồ bơi ngoài trời", "Hải sản tươi sống"],
    originalPrice: 2400000,
    salePrice: 1850000,
    discountPercent: 23,
    badge: "Giá hấp dẫn",
    distanceToBeach: "Cách biển 100m",
  },
  {
    id: "dalat-edensee-lake-resort",
    name: "Dalat Edensee Lake Resort & Spa",
    city: "Đà Lạt",
    area: "Hồ Tuyền Lâm",
    rating: 4.8,
    reviewCount: 720,
    ratingText: "Tuyệt vời",
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    amenities: ["View rừng thông", "Du thuyền hồ", "Lò sưởi phòng ngủ", "Sân Tennis"],
    originalPrice: 2800000,
    salePrice: 2190000,
    discountPercent: 22,
    badge: "Khí hậu mát mẻ",
    distanceToBeach: "Ven hồ Tuyền Lâm",
  },
  {
    id: "intercontinental-danang-sun-peninsula",
    name: "InterContinental Danang Sun Peninsula",
    city: "Đà Nẵng",
    area: "Bán đảo Sơn Trà",
    rating: 5.0,
    reviewCount: 2100,
    ratingText: "Hoàn hảo",
    imageUrl:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    amenities: ["Đầu bếp Michelin", "Tàu điện sườn núi", "Bãi biển tư nhân", "Miễn phí cocktail"],
    originalPrice: 9500000,
    salePrice: 7800000,
    discountPercent: 18,
    badge: "Top 1 Châu Á",
    distanceToBeach: "Vịnh biển biệt lập",
  },
];

export const POPULAR_DESTINATIONS: DestinationItem[] = [
  {
    id: "dest-danang",
    name: "Đà Nẵng",
    cityKey: "Da Nang",
    tagline: "Thành phố đáng sống với biển xanh & cầu Rồng",
    badgeLabel: "THÀNH PHỐ ĐÁNG SỐNG",
    accommodationBadge: "1.240 khách sạn",
    hotelCount: 340,
    startingPrice: "650.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dest-phuquoc",
    name: "Phú Quốc",
    cityKey: "Phu Quoc",
    tagline: "Thiên đường hoàng hôn & resort đẳng cấp",
    badgeLabel: "ĐẢO NGỌC THIÊN ĐƯỜNG",
    accommodationBadge: "880 resort & villa",
    hotelCount: 280,
    startingPrice: "890.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dest-nhatrang",
    name: "Nha Trang",
    cityKey: "Nha Trang",
    tagline: "Vịnh biển ngọc ngà & thể thao biển sôi động",
    badgeLabel: "VỊNH BIỂN QUYẾN RŨ",
    accommodationBadge: "950 khách sạn",
    hotelCount: 310,
    startingPrice: "720.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dest-dalat",
    name: "Đà Lạt",
    cityKey: "Da Lat",
    tagline: "Xứ sở ngàn hoa giữa sương mờ thông reo",
    badgeLabel: "THÀNH PHỐ NGÀN HOA",
    accommodationBadge: "1.420 homestay & resort",
    hotelCount: 260,
    startingPrice: "550.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dest-vungtau",
    name: "Vũng Tàu",
    cityKey: "Vung Tau",
    tagline: "Điểm hẹn cuối tuần tuyệt vời ven biển miền Nam",
    badgeLabel: "BÃI BIỂN MIỀN NAM",
    accommodationBadge: "620 khách sạn",
    hotelCount: 220,
    startingPrice: "480.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dest-hanoi",
    name: "Hà Nội",
    cityKey: "Ha Noi",
    tagline: "Nét trầm mặc ngàn năm văn hiến và ẩm thực tinh hoa",
    badgeLabel: "THỦ ĐÔ NGÀN NĂM",
    accommodationBadge: "1.180 khách sạn",
    hotelCount: 420,
    startingPrice: "700.000đ/đêm",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  },
];

/** Cấu hình cho TopDestinationsSection — dễ cập nhật nội dung */
export const TOP_DESTINATIONS_CONFIG = {
  /** Số tỉnh thành hiển thị trong link "Khám phá tất cả" */
  totalProvinces: 63,
  /** Số card hiển thị trên trang chủ */
  displayCount: 4,
} as const;

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testi-1",
    author: "Hoàng Minh Trí",
    location: "Hà Nội",
    stayedAt: "Furama Resort Đà Nẵng",
    content:
      "Đặt phòng qua MeGo cực kỳ nhanh, xác nhận phòng ngay lập tức và khi nhận phòng còn được nâng hạng phòng nhìn ra hồ bơi. Dịch vụ chăm sóc khách hàng 24/7 rất chu đáo!",
    rating: 5,
    avatarText: "HT",
  },
  {
    id: "testi-2",
    author: "Trần Mai Phương",
    location: "TP. Hồ Chí Minh",
    stayedAt: "Vinpearl Resort Nha Trang",
    content:
      "Gia đình mình đi 6 người, combo phòng và vé vui chơi trên MeGo tiết kiệm được gần 3 triệu so với đặt lẻ. Rất hài lòng với sự tiện lợi và chính sách giá minh bạch.",
    rating: 5,
    avatarText: "MP",
  },
  {
    id: "testi-3",
    author: "Lê Quốc Bảo",
    location: "Đà Nẵng",
    stayedAt: "JW Marriott Phú Quốc",
    content:
      "Tính năng MeGo Radar giúp mình lọc được các resort sát biển chỉ cách vài bước chân mà không cần tìm kiếm phức tạp. Chắc chắn sẽ tiếp tục ủng hộ nền tảng cho các chuyến đi tới.",
    rating: 5,
    avatarText: "QB",
  },
];
