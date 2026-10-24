export interface ProvinceItem {
  id: string;
  name: string;
  slug: string;
  region: "Miền Bắc" | "Miền Trung" | "Miền Nam";
  imageUrl?: string;
  hotelCount?: number;
  discountText?: string;
  highlight?: boolean; // provinces that appear in DESTINATION_DEALS
}

export const ALL_63_PROVINCES: ProvinceItem[] = [
  // ─── MIỀN BẮC ────────────────────────────────────────────────────────────────
  {
    id: "ha-noi",
    name: "Hà Nội",
    slug: "ha-noi",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&auto=format&fit=crop&q=80",
    hotelCount: 320,
    discountText: "Giảm 20%",
  },
  {
    id: "ha-long",
    name: "Quảng Ninh (Hạ Long)",
    slug: "ha-long",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80",
    hotelCount: 180,
    discountText: "Giảm 25%",
    highlight: true,
  },
  {
    id: "sapa",
    name: "Lào Cai (Sa Pa)",
    slug: "sapa",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?w=600&auto=format&fit=crop&q=80",
    hotelCount: 95,
    discountText: "Giảm 15%",
  },
  {
    id: "ninh-binh",
    name: "Ninh Bình",
    slug: "ninh-binh",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1519430044529-9fd9c5b3a39b?w=600&auto=format&fit=crop&q=80",
    hotelCount: 72,
  },
  {
    id: "hai-phong",
    name: "Hải Phòng",
    slug: "hai-phong",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&auto=format&fit=crop&q=80",
    hotelCount: 88,
  },
  {
    id: "hoa-binh",
    name: "Hoà Bình",
    slug: "hoa-binh",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1602491674275-316d95560fb1?w=600&auto=format&fit=crop&q=80",
    hotelCount: 34,
  },
  {
    id: "hai-duong",
    name: "Hải Dương",
    slug: "hai-duong",
    region: "Miền Bắc",
    hotelCount: 28,
  },
  {
    id: "hung-yen",
    name: "Hưng Yên",
    slug: "hung-yen",
    region: "Miền Bắc",
    hotelCount: 18,
  },
  {
    id: "bac-ninh",
    name: "Bắc Ninh",
    slug: "bac-ninh",
    region: "Miền Bắc",
    hotelCount: 22,
  },
  {
    id: "vinh-phuc",
    name: "Vĩnh Phúc",
    slug: "vinh-phuc",
    region: "Miền Bắc",
    hotelCount: 20,
  },
  {
    id: "phu-tho",
    name: "Phú Thọ",
    slug: "phu-tho",
    region: "Miền Bắc",
    hotelCount: 25,
  },
  {
    id: "tuyen-quang",
    name: "Tuyên Quang",
    slug: "tuyen-quang",
    region: "Miền Bắc",
    hotelCount: 14,
  },
  {
    id: "yen-bai",
    name: "Yên Bái",
    slug: "yen-bai",
    region: "Miền Bắc",
    hotelCount: 16,
  },
  {
    id: "thai-nguyen",
    name: "Thái Nguyên",
    slug: "thai-nguyen",
    region: "Miền Bắc",
    hotelCount: 30,
  },
  {
    id: "lang-son",
    name: "Lạng Sơn",
    slug: "lang-son",
    region: "Miền Bắc",
    hotelCount: 20,
  },
  {
    id: "bac-giang",
    name: "Bắc Giang",
    slug: "bac-giang",
    region: "Miền Bắc",
    hotelCount: 18,
  },
  {
    id: "ha-giang",
    name: "Hà Giang",
    slug: "ha-giang",
    region: "Miền Bắc",
    imageUrl:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&auto=format&fit=crop&q=80",
    hotelCount: 40,
    discountText: "Giảm 10%",
  },
  {
    id: "cao-bang",
    name: "Cao Bằng",
    slug: "cao-bang",
    region: "Miền Bắc",
    hotelCount: 12,
  },
  {
    id: "bac-kan",
    name: "Bắc Kạn",
    slug: "bac-kan",
    region: "Miền Bắc",
    hotelCount: 10,
  },
  {
    id: "son-la",
    name: "Sơn La",
    slug: "son-la",
    region: "Miền Bắc",
    hotelCount: 22,
  },
  {
    id: "dien-bien",
    name: "Điện Biên",
    slug: "dien-bien",
    region: "Miền Bắc",
    hotelCount: 15,
  },
  {
    id: "lai-chau",
    name: "Lai Châu",
    slug: "lai-chau",
    region: "Miền Bắc",
    hotelCount: 12,
  },
  {
    id: "nam-dinh",
    name: "Nam Định",
    slug: "nam-dinh",
    region: "Miền Bắc",
    hotelCount: 20,
  },
  {
    id: "ha-nam",
    name: "Hà Nam",
    slug: "ha-nam",
    region: "Miền Bắc",
    hotelCount: 16,
  },
  {
    id: "thai-binh",
    name: "Thái Bình",
    slug: "thai-binh",
    region: "Miền Bắc",
    hotelCount: 14,
  },

  // ─── MIỀN TRUNG ──────────────────────────────────────────────────────────────
  {
    id: "da-nang",
    name: "Đà Nẵng",
    slug: "da-nang",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80",
    hotelCount: 250,
    discountText: "Giảm 40%",
    highlight: true,
  },
  {
    id: "nha-trang",
    name: "Khánh Hoà (Nha Trang)",
    slug: "nha-trang",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&auto=format&fit=crop&q=80",
    hotelCount: 210,
    discountText: "Giảm 35%",
    highlight: true,
  },
  {
    id: "hoi-an",
    name: "Quảng Nam (Hội An)",
    slug: "hoi-an",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600&auto=format&fit=crop&q=80",
    hotelCount: 150,
    discountText: "Giảm 20%",
  },
  {
    id: "hue",
    name: "Thừa Thiên Huế",
    slug: "hue",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    hotelCount: 120,
    discountText: "Giảm 15%",
  },
  {
    id: "quy-nhon",
    name: "Bình Định (Quy Nhơn)",
    slug: "quy-nhon",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80",
    hotelCount: 90,
    discountText: "Giảm 30%",
  },
  {
    id: "phan-thiet",
    name: "Bình Thuận (Phan Thiết)",
    slug: "phan-thiet",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=80",
    hotelCount: 110,
    discountText: "Giảm 25%",
  },
  {
    id: "thanh-hoa",
    name: "Thanh Hoá",
    slug: "thanh-hoa",
    region: "Miền Trung",
    hotelCount: 55,
  },
  {
    id: "nghe-an",
    name: "Nghệ An",
    slug: "nghe-an",
    region: "Miền Trung",
    hotelCount: 48,
  },
  {
    id: "ha-tinh",
    name: "Hà Tĩnh",
    slug: "ha-tinh",
    region: "Miền Trung",
    hotelCount: 32,
  },
  {
    id: "quang-binh",
    name: "Quảng Bình",
    slug: "quang-binh",
    region: "Miền Trung",
    hotelCount: 38,
  },
  {
    id: "quang-tri",
    name: "Quảng Trị",
    slug: "quang-tri",
    region: "Miền Trung",
    hotelCount: 25,
  },
  {
    id: "quang-ngai",
    name: "Quảng Ngãi",
    slug: "quang-ngai",
    region: "Miền Trung",
    hotelCount: 30,
  },
  {
    id: "phu-yen",
    name: "Phú Yên",
    slug: "phu-yen",
    region: "Miền Trung",
    hotelCount: 42,
  },
  {
    id: "ninh-thuan",
    name: "Ninh Thuận",
    slug: "ninh-thuan",
    region: "Miền Trung",
    hotelCount: 35,
  },
  {
    id: "gia-lai",
    name: "Gia Lai",
    slug: "gia-lai",
    region: "Miền Trung",
    hotelCount: 28,
  },
  {
    id: "kon-tum",
    name: "Kon Tum",
    slug: "kon-tum",
    region: "Miền Trung",
    hotelCount: 18,
  },
  {
    id: "dak-lak",
    name: "Đắk Lắk",
    slug: "dak-lak",
    region: "Miền Trung",
    hotelCount: 32,
  },
  {
    id: "dak-nong",
    name: "Đắk Nông",
    slug: "dak-nong",
    region: "Miền Trung",
    hotelCount: 16,
  },
  {
    id: "lam-dong",
    name: "Lâm Đồng (Đà Lạt)",
    slug: "da-lat",
    region: "Miền Trung",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    hotelCount: 130,
    discountText: "Giảm 30%",
    highlight: true,
  },

  // ─── MIỀN NAM ────────────────────────────────────────────────────────────────
  {
    id: "ho-chi-minh",
    name: "TP. Hồ Chí Minh",
    slug: "ho-chi-minh",
    region: "Miền Nam",
    imageUrl:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&auto=format&fit=crop&q=80",
    hotelCount: 480,
    discountText: "Giảm 15%",
  },
  {
    id: "phu-quoc",
    name: "Kiên Giang (Phú Quốc)",
    slug: "phu-quoc",
    region: "Miền Nam",
    imageUrl:
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&auto=format&fit=crop&q=80",
    hotelCount: 200,
    discountText: "Giảm 40%",
    highlight: true,
  },
  {
    id: "can-tho",
    name: "Cần Thơ",
    slug: "can-tho",
    region: "Miền Nam",
    imageUrl:
      "https://images.unsplash.com/photo-1598887142432-e58ed7c19a2b?w=600&auto=format&fit=crop&q=80",
    hotelCount: 85,
    discountText: "Giảm 10%",
  },
  {
    id: "vung-tau",
    name: "Bà Rịa - Vũng Tàu",
    slug: "vung-tau",
    region: "Miền Nam",
    imageUrl:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&auto=format&fit=crop&q=80",
    hotelCount: 160,
    discountText: "Giảm 20%",
  },
  {
    id: "ben-tre",
    name: "Bến Tre",
    slug: "ben-tre",
    region: "Miền Nam",
    hotelCount: 28,
  },
  {
    id: "tien-giang",
    name: "Tiền Giang",
    slug: "tien-giang",
    region: "Miền Nam",
    hotelCount: 24,
  },
  {
    id: "long-an",
    name: "Long An",
    slug: "long-an",
    region: "Miền Nam",
    hotelCount: 20,
  },
  {
    id: "tay-ninh",
    name: "Tây Ninh",
    slug: "tay-ninh",
    region: "Miền Nam",
    hotelCount: 18,
  },
  {
    id: "binh-duong",
    name: "Bình Dương",
    slug: "binh-duong",
    region: "Miền Nam",
    hotelCount: 45,
  },
  {
    id: "dong-nai",
    name: "Đồng Nai",
    slug: "dong-nai",
    region: "Miền Nam",
    hotelCount: 38,
  },
  {
    id: "binh-phuoc",
    name: "Bình Phước",
    slug: "binh-phuoc",
    region: "Miền Nam",
    hotelCount: 16,
  },
  {
    id: "dong-thap",
    name: "Đồng Tháp",
    slug: "dong-thap",
    region: "Miền Nam",
    hotelCount: 22,
  },
  {
    id: "an-giang",
    name: "An Giang",
    slug: "an-giang",
    region: "Miền Nam",
    hotelCount: 30,
  },
  {
    id: "hau-giang",
    name: "Hậu Giang",
    slug: "hau-giang",
    region: "Miền Nam",
    hotelCount: 14,
  },
  {
    id: "soc-trang",
    name: "Sóc Trăng",
    slug: "soc-trang",
    region: "Miền Nam",
    hotelCount: 18,
  },
  {
    id: "bac-lieu",
    name: "Bạc Liêu",
    slug: "bac-lieu",
    region: "Miền Nam",
    hotelCount: 16,
  },
  {
    id: "ca-mau",
    name: "Cà Mau",
    slug: "ca-mau",
    region: "Miền Nam",
    hotelCount: 20,
  },
  {
    id: "kien-giang",
    name: "Kiên Giang",
    slug: "kien-giang",
    region: "Miền Nam",
    hotelCount: 25,
  },
  {
    id: "tra-vinh",
    name: "Trà Vinh",
    slug: "tra-vinh",
    region: "Miền Nam",
    hotelCount: 14,
  },
  {
    id: "vinh-long",
    name: "Vĩnh Long",
    slug: "vinh-long",
    region: "Miền Nam",
    hotelCount: 18,
  },
];

export const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_META: Record<
  Region,
  { icon: string; color: string; bgColor: string }
> = {
  "Miền Bắc": {
    icon: "filter_drama",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  "Miền Trung": {
    icon: "wb_sunny",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  "Miền Nam": {
    icon: "local_florist",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
};
