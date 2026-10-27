/**
 * Dữ liệu mock chép theo backend `ChatDataSeeder.java` (8 khách sạn, 16 hạng phòng, 6 điểm đến,
 * 8 tiện ích, 8 chính sách) để khi bật API thật dữ liệu hiển thị không thay đổi.
 *
 * Khác với seeder (đang gán cứng partner_profile_id = 1/2/3), mock phân quyền sở hữu theo email
 * đối tác cho đúng ý đồ: Grand Sunrise thuộc partner@sunrise-danang.vn.
 * Seeder chưa tạo phòng vật lý (inventory_rooms) nên mock tự sinh vài phòng cho mỗi hạng.
 */

import type {
  AmenityDto,
  DestinationDto,
  HotelDto,
  HotelPolicyDto,
  RoomDto,
  RoomStatus,
  RoomTypeDto,
} from "../types/backend.types";

/** Email đối tác đã APPROVED trong seeder → id khách sạn sở hữu. */
export const MOCK_HOTEL_OWNERSHIP: Record<string, number[]> = {
  "partner@sunrise-danang.vn": [1, 2, 3],
  "partner@mego.vn": [4, 5, 6, 7, 8],
};

export const SEED_DESTINATIONS: DestinationDto[] = [
  { id: 1, name: "Đà Nẵng", slug: "da-nang", province: "Đà Nẵng", country: "Việt Nam" },
  { id: 2, name: "Phú Quốc", slug: "phu-quoc", province: "Kiên Giang", country: "Việt Nam" },
  { id: 3, name: "Nha Trang", slug: "nha-trang", province: "Khánh Hòa", country: "Việt Nam" },
  { id: 4, name: "Đà Lạt", slug: "da-lat", province: "Lâm Đồng", country: "Việt Nam" },
  { id: 5, name: "Vũng Tàu", slug: "vung-tau", province: "Bà Rịa - Vũng Tàu", country: "Việt Nam" },
  { id: 6, name: "Hồ Chí Minh", slug: "ho-chi-minh", province: "TP. Hồ Chí Minh", country: "Việt Nam" },
];

export const SEED_AMENITIES: AmenityDto[] = [
  { id: 1, name: "Hồ bơi vô cực", icon: "waves", scope: "HOTEL", category: "Giải trí & Thư giãn" },
  { id: 2, name: "WiFi tốc độ cao 500Mbps", icon: "wifi", scope: "HOTEL", category: "Tiện ích chung" },
  { id: 3, name: "Buffet sáng Á - Âu", icon: "utensils", scope: "HOTEL", category: "Ẩm thực" },
  { id: 4, name: "Spa & Massage trị liệu", icon: "sparkles", scope: "HOTEL", category: "Giải trí & Thư giãn" },
  { id: 5, name: "Phòng Gym 24/7", icon: "dumbbell", scope: "HOTEL", category: "Thể thao" },
  { id: 6, name: "Đưa đón sân bay", icon: "car", scope: "HOTEL", category: "Di chuyển" },
  { id: 7, name: "Bồn tắm nằm hướng biển", icon: "bath", scope: "ROOM", category: "Tiện nghi phòng" },
  { id: 8, name: "Smart TV 65 inch 4K", icon: "tv", scope: "ROOM", category: "Giải trí trong phòng" },
];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const HOTEL_PHOTOS = [
  "photo-1566073771259-6a8506099945",
  "photo-1582719478250-c89cae4dc85b",
  "photo-1540555700478-4be289fbecef",
  "photo-1571896349842-33c89424de2d",
];

type HotelSeed = Pick<HotelDto, "id" | "destinationId" | "name" | "slug" | "address" | "starRating" | "description" | "checkInTime" | "checkOutTime" | "distanceToCenterKm" | "avgRating" | "reviewCount" | "latitude" | "longitude">;

const HOTEL_SEEDS: HotelSeed[] = [
  { id: 1, destinationId: 1, name: "Grand Sunrise Boutique Hotel Da Nang", slug: "grand-sunrise-boutique-hotel-da-nang", address: "28 Võ Nguyên Giáp, Bãi biển Mỹ Khê, Quận Sơn Trà, Đà Nẵng", starRating: 5, description: "Khách sạn 5 sao mặt biển Mỹ Khê với hồ bơi chân mây tầng thượng và buffet sáng miễn phí.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 2.5, avgRating: 4.85, reviewCount: 842, latitude: 16.0626, longitude: 108.2453 },
  { id: 2, destinationId: 1, name: "Furama Resort Danang Luxury & Villas", slug: "furama-resort-da-nang", address: "105 Võ Nguyên Giáp, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng", starRating: 5, description: "Resort 5 sao biểu tượng tại bãi biển Bắc Mỹ An với hồ bơi nhiệt đới, bãi biển riêng tư và ẩm thực quốc tế.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 4.5, avgRating: 4.92, reviewCount: 1290, latitude: 16.0399, longitude: 108.2497 },
  { id: 3, destinationId: 1, name: "InterContinental Danang Sun Peninsula Resort", slug: "intercontinental-danang-sun-peninsula", address: "Bãi Bắc, Bán đảo Sơn Trà, Quận Sơn Trà, Đà Nẵng", starRating: 5, description: "Khu nghỉ dưỡng 5 sao huyền thoại trên bán đảo Sơn Trà với nhà hàng Michelin La Maison 1888 và vịnh biển biệt lập.", checkInTime: "15:00", checkOutTime: "12:00", distanceToCenterKm: 14, avgRating: 4.98, reviewCount: 2100, latitude: 16.1194, longitude: 108.3069 },
  { id: 4, destinationId: 2, name: "JW Marriott Emerald Bay Phú Quốc", slug: "jw-marriott-phu-quoc", address: "Bãi Khem, Phường An Thới, Thành phố Phú Quốc, Kiên Giang", starRating: 5, description: "Kiệt tác nghỉ dưỡng 5 sao tại Bãi Khem do kiến trúc sư Bill Bensley thiết kế.", checkInTime: "15:00", checkOutTime: "12:00", distanceToCenterKm: 18, avgRating: 4.95, reviewCount: 1560, latitude: 10.0236, longitude: 104.0353 },
  { id: 5, destinationId: 3, name: "Vinpearl Resort & Spa Nha Trang", slug: "vinpearl-resort-spa-nha-trang", address: "Đảo Hòn Tre, Phường Vĩnh Nguyên, Nha Trang, Khánh Hòa", starRating: 5, description: "Khu nghỉ dưỡng 5 sao trên đảo Hòn Tre với bãi biển riêng, hồ bơi lớn và công viên giải trí VinWonders kề bên.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 3.5, avgRating: 4.88, reviewCount: 980, latitude: 12.2165, longitude: 109.2489 },
  { id: 6, destinationId: 4, name: "Dalat Edensee Lake Resort & Spa", slug: "dalat-edensee-lake-resort", address: "Khu du lịch Hồ Tuyền Lâm, Phường 4, Thành phố Đà Lạt, Lâm Đồng", starRating: 5, description: "Khu nghỉ dưỡng 5 sao phong cách Châu Âu lãng mạn ẩn mình giữa rừng thông ven hồ Tuyền Lâm.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 10, avgRating: 4.82, reviewCount: 720, latitude: 11.8962, longitude: 108.4316 },
  { id: 7, destinationId: 5, name: "The Imperial Hotel Vũng Tàu", slug: "the-imperial-hotel-vung-tau", address: "159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu", starRating: 5, description: "Khách sạn 5 sao phong cách hoàng gia Anh cổ điển tại Bãi Sau Vũng Tàu với bãi biển riêng.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 2, avgRating: 4.78, reviewCount: 840, latitude: 10.3459, longitude: 107.0954 },
  { id: 8, destinationId: 6, name: "Khách sạn Sài Gòn Luxury Suites", slug: "saigon-luxury-hotel-center", address: "88 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh", starRating: 4, description: "Khách sạn 4 sao cao cấp ngay trung tâm Quận 1, kề cận phố đi bộ Nguyễn Huệ và chợ Bến Thành.", checkInTime: "14:00", checkOutTime: "12:00", distanceToCenterKm: 0.3, avgRating: 4.7, reviewCount: 650, latitude: 10.7731, longitude: 106.7003 },
];

export const SEED_HOTELS: HotelDto[] = HOTEL_SEEDS.map((seed) => {
  const ownerEmail = Object.entries(MOCK_HOTEL_OWNERSHIP).find(([, ids]) => ids.includes(seed.id))?.[0];
  return {
    ...seed,
    partnerProfileId: ownerEmail === "partner@sunrise-danang.vn" ? 2 : 1,
    approvalStatus: "APPROVED",
    rejectReason: null,
    active: true,
    amenityIds: seed.id % 2 === 0 ? [1, 2, 3, 6] : [1, 2, 3, 4, 5],
    images: HOTEL_PHOTOS.map((photo, index) => ({
      id: seed.id * 10 + index,
      url: img(HOTEL_PHOTOS[(index + seed.id) % HOTEL_PHOTOS.length] ?? photo),
      caption: index === 0 ? "Ảnh đại diện" : null,
      primary: index === 0,
      sortOrder: index,
    })),
  };
});

type PolicySeed = [string, string, string, number, number, boolean, string, string, string];
const POLICY_SEEDS: Record<number, PolicySeed> = {
  1: ["14:00", "23:30", "12:00", 24, 50, true, "Miễn phí tối đa 2 trẻ em dưới 11 tuổi ngủ chung giường với bố mẹ.", "Không cho phép mang theo thú cưng.", "Bao gồm buffet sáng miễn phí hàng ngày."],
  2: ["14:00", "23:30", "12:00", 48, 50, true, "Miễn phí 2 trẻ dưới 12 tuổi ngủ chung giường sẵn có.", "Không cho phép mang thú cưng.", "Miễn phí sử dụng hồ bơi nhiệt đới và bãi biển riêng."],
  3: ["15:00", "23:59", "12:00", 72, 100, true, "Miễn phí trẻ dưới 12 tuổi đi cùng gia đình.", "Không hỗ trợ thú cưng tại khu bảo tồn bán đảo Sơn Trà.", "Đặc quyền cáp treo Nam Tram và trà chiều tại Club Lounge."],
  4: ["15:00", "23:59", "12:00", 72, 100, false, "Trẻ em dưới 12 tuổi được miễn phí ăn sáng.", "Không cho phép thú cưng vào khu vực biệt thự biển.", "Hỗ trợ xe đón sân bay Phú Quốc khi đặt trước 24 giờ."],
  5: ["14:00", "23:00", "12:00", 48, 50, false, "Miễn phí tối đa 2 trẻ dưới 6 tuổi; ưu đãi vé cáp treo VinWonders.", "Không hỗ trợ mang thú cưng.", "Miễn phí cano cao tốc sang đảo Hòn Tre."],
  6: ["14:00", "22:30", "12:00", 24, 20, true, "Miễn phí 1 trẻ em dưới 10 tuổi ở cùng bố mẹ.", "Cho phép mang thú cưng nhỏ dưới 10kg ở khu Garden Villa (báo trước lễ tân).", "Có lò sưởi ấm áp trong phòng ngủ."],
  7: ["14:00", "23:00", "12:00", 24, 30, true, "Miễn phí trẻ dưới 6 tuổi ngủ chung giường.", "Cho phép thú cưng nhỏ dưới 7kg (có phụ phí vệ sinh).", "Lối đi riêng qua cầu bộ hành ra Bãi Sau."],
  8: ["14:00", "23:59", "12:00", 24, 20, true, "Miễn phí 1 trẻ dưới 11 tuổi ngủ chung giường.", "Không cho phép thú cưng.", "Cách phố đi bộ Nguyễn Huệ 200m."],
};

export const SEED_POLICIES: Record<number, HotelPolicyDto> = Object.fromEntries(
  Object.entries(POLICY_SEEDS).map(([hotelId, p]) => [
    Number(hotelId),
    {
      checkInFrom: p[0], checkInUntil: p[1], checkOutUntil: p[2],
      freeCancelBeforeHours: p[3], cancellationFeePercent: p[4],
      refundable: true, allowPayAtHotel: p[5], requireManualCancelApproval: false,
      childPolicy: p[6], petPolicy: p[7], otherRules: p[8],
    },
  ]),
);

type RoomTypeSeed = [hotelId: number, name: string, photo: string, area: number, adults: number, children: number, bed: string, price: number, total: number];
const ROOM_TYPE_SEEDS: RoomTypeSeed[] = [
  [1, "Deluxe Giường Đôi Hướng Phố", "photo-1590490360182-c33d57733427", 32, 2, 1, "1 Giường đôi Queen", 1450000, 10],
  [1, "Premier Hướng Biển Mỹ Khê", "photo-1582719478250-c89cae4dc85b", 45, 3, 1, "1 Giường King hoặc 2 Giường đơn", 1950000, 8],
  [2, "Deluxe Hướng Vườn Nhiệt Đới", "photo-1590490360182-c33d57733427", 43, 2, 2, "1 Giường đôi King hoặc 2 Giường đơn", 3350000, 12],
  [2, "Ocean Suite Hướng Biển Trực Diện", "photo-1582719478250-c89cae4dc85b", 85, 3, 2, "1 Giường đôi Super King", 4950000, 6],
  [3, "Classic Resort Ocean View", "photo-1551882547-ff40c63fe5fa", 70, 2, 2, "1 Giường King", 7800000, 8],
  [3, "Heaven Penthouse Biệt Lập Sơn Trà", "photo-1540555700478-4be289fbecef", 170, 4, 2, "2 Giường King lớn + Hồ bơi vô cực riêng", 14500000, 4],
  [4, "Emerald Bay View Room", "photo-1540555700478-4be289fbecef", 54, 2, 2, "1 Giường King", 4890000, 10],
  [4, "Turquoise Suite Bãi Khem", "photo-1566073771259-6a8506099945", 90, 3, 2, "1 Giường King cỡ lớn + 1 Sofa bed", 7900000, 6],
  [5, "Deluxe Hướng Biển", "photo-1566073771259-6a8506099945", 45, 2, 2, "1 Giường đôi King hoặc 2 Giường đơn", 2690000, 15],
  [5, "Villa Biển Đảo 2 Phòng Ngủ", "photo-1582719478250-c89cae4dc85b", 120, 4, 2, "2 Giường King lớn", 5200000, 6],
  [6, "Mimosa Deluxe Garden View", "photo-1520250497591-112f2f40a3f4", 40, 2, 1, "1 Giường King", 2190000, 10],
  [6, "Camellia Suite Ven Hồ Tuyền Lâm", "photo-1582719478250-c89cae4dc85b", 70, 3, 2, "1 Giường King + Ban công ngắm hồ", 3350000, 6],
  [7, "Deluxe Hướng Phố", "photo-1571896349842-33c89424de2d", 40, 2, 1, "1 Giường đôi Queen", 1850000, 12],
  [7, "Grand Suite Hướng Biển Hoàng Gia", "photo-1590490360182-c33d57733427", 72, 3, 2, "1 Giường đôi King siêu lớn", 2950000, 6],
  [8, "Deluxe Trung Tâm Sài Gòn", "photo-1590490360182-c33d57733427", 34, 2, 1, "1 Giường đôi Queen", 1250000, 12],
  [8, "Executive Suite Ngắm Phố Đi Bộ", "photo-1566073771259-6a8506099945", 58, 3, 2, "1 Giường King + Phòng khách riêng biệt", 1890000, 8],
];

export const SEED_ROOM_TYPES: RoomTypeDto[] = ROOM_TYPE_SEEDS.map(([hotelId, name, photo, area, adults, children, bed, price, total], index) => ({
  id: index + 1,
  hotelId,
  name,
  // Seeder đang để "frontendRoomId|imageUrl" trong description; mock dùng mô tả thật.
  description: `${name} – ${bed}, diện tích ${area} m², tối đa ${adults} người lớn và ${children} trẻ em.`,
  areaM2: area,
  maxAdults: adults,
  maxChildren: children,
  bedType: bed,
  basePrice: price,
  totalRooms: total,
  active: true,
  amenityIds: area >= 60 ? [7, 8] : [8],
  images: [{ id: index + 1, url: img(photo), sortOrder: 0 }],
}));

const ROOM_STATUS_CYCLE: RoomStatus[] = ["OCCUPIED", "AVAILABLE", "OCCUPIED", "CLEANING", "AVAILABLE", "OCCUPIED", "MAINTENANCE", "AVAILABLE"];

/** Sinh tối đa 6 phòng vật lý / hạng phòng: tầng = thứ tự hạng trong khách sạn + 1. */
export const SEED_ROOMS: RoomDto[] = SEED_ROOM_TYPES.flatMap((roomType) => {
  const floor = roomType.id % 2 === 0 ? 5 : 3;
  return Array.from({ length: Math.min(6, roomType.totalRooms) }, (_, index) => ({
    id: roomType.id * 100 + index + 1,
    roomTypeId: roomType.id,
    roomNumber: `${floor}${String(index + 1).padStart(2, "0")}`,
    floor,
    status: ROOM_STATUS_CYCLE[(roomType.id + index) % ROOM_STATUS_CYCLE.length],
  }));
});
