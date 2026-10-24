import { MOCK_HOTELS } from "../data/hotels";
import type {
  HotelItem,
  HotelRoom,
  HotelFilterState,
  HotelSearchParams,
  PaginatedResult,
} from "../types/hotel";

export const HotelsService = {
  getHotels(
    params: HotelSearchParams,
    filters?: HotelFilterState
  ): PaginatedResult<HotelItem> {
    let result = [...MOCK_HOTELS];

    // 1. Filter by keyword or destination
    const query = (params.keyword || params.destination || "").trim().toLowerCase();
    if (query) {
      const normalizedQuery = query.replace(/\s+/g, "");
      result = result.filter((hotel) => {
        const hotelName = hotel.name.toLowerCase();
        const hotelCity = hotel.city.toLowerCase().replace(/\s+/g, "");
        const hotelDistrict = hotel.district.toLowerCase();
        const hotelAddress = hotel.address.toLowerCase();

        return (
          hotelName.includes(query) ||
          hotelCity.includes(normalizedQuery) ||
          normalizedQuery.includes(hotelCity) ||
          hotelDistrict.includes(query) ||
          hotelAddress.includes(query)
        );
      });
    }

    // 2. Filter by Property Types (from filters or URL)
    if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
      result = result.filter((hotel) =>
        filters.propertyTypes.includes(hotel.propertyType)
      );
    }

    // 3. Filter by Stars
    if (filters?.stars && filters.stars.length > 0) {
      result = result.filter((hotel) => filters.stars.includes(hotel.stars));
    }

    // 4. Filter by Rating Threshold
    if (filters?.ratingThreshold && filters.ratingThreshold > 0) {
      result = result.filter(
        (hotel) => hotel.rating >= (filters.ratingThreshold || 0)
      );
    }

    // 5. Filter by Price Range
    if (filters?.priceRange) {
      switch (filters.priceRange) {
        case "under-500k":
          result = result.filter((hotel) => hotel.pricePerNight < 500000);
          break;
        case "500k-1m":
          result = result.filter(
            (hotel) =>
              hotel.pricePerNight >= 500000 && hotel.pricePerNight <= 1000000
          );
          break;
        case "1m-2m":
          result = result.filter(
            (hotel) =>
              hotel.pricePerNight >= 1000000 && hotel.pricePerNight <= 2000000
          );
          break;
        case "over-2m":
          result = result.filter((hotel) => hotel.pricePerNight > 2000000);
          break;
      }
    } else {
      if (typeof filters?.minPrice === "number" && filters.minPrice > 0) {
        result = result.filter(
          (hotel) => hotel.pricePerNight >= (filters.minPrice || 0)
        );
      }
      if (
        typeof filters?.maxPrice === "number" &&
        filters.maxPrice < 15000000
      ) {
        result = result.filter(
          (hotel) => hotel.pricePerNight <= (filters.maxPrice || 15000000)
        );
      }
    }

    // 6. Filter by Amenities (must have ALL selected amenities)
    if (filters?.amenities && filters.amenities.length > 0) {
      result = result.filter((hotel) =>
        filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }

    // 7. Filter by Policies
    if (filters?.policies && filters.policies.length > 0) {
      result = result.filter((hotel) => {
        return filters.policies.every((policy) => {
          if (policy === "free-cancellation") {
            return hotel.policies.freeCancellation;
          }
          if (policy === "pay-at-hotel") {
            return hotel.policies.payAtHotel;
          }
          if (policy === "breakfast") {
            return hotel.policies.breakfastIncluded;
          }
          return true;
        });
      });
    }

    // 8. Sorting
    const sort = params.sort || "recommended";
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.pricePerNight - b.pricePerNight;
        case "price-desc":
          return b.pricePerNight - a.pricePerNight;
        case "rating-desc":
          return b.rating - a.rating;
        case "stars-desc":
          return b.stars - a.stars;
        case "recommended":
        default:
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.rating - a.rating;
      }
    });

    // 9. Pagination
    const total = result.length;
    const page = Math.max(1, params.page || 1);
    const limit = params.limit || 6;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = result.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages,
      limit,
    };
  },

  getHotelById(id: string): HotelItem {
    if (!id) return MOCK_HOTELS[0];

    // Alias mapping for home data or numeric IDs
    const ALIAS_MAP: Record<string, string> = {
      "hotel-1": "furama-resort-da-nang",
      "1": "furama-resort-da-nang",
      "hotel-2": "vinpearl-resort-spa-nha-trang",
      "2": "vinpearl-resort-spa-nha-trang",
      "hotel-3": "jw-marriott-phu-quoc",
      "3": "jw-marriott-phu-quoc",
      "hotel-4": "the-imperial-hotel-vung-tau",
      "4": "the-imperial-hotel-vung-tau",
      "hotel-5": "dalat-edensee-lake-resort",
      "5": "dalat-edensee-lake-resort",
      "hotel-6": "intercontinental-danang-sun-peninsula",
      "6": "intercontinental-danang-sun-peninsula",
      "hotel-7": "novotel-danang-premier-han-river",
      "7": "novotel-danang-premier-han-river",
      "hotel-8": "tms-hotel-da-nang-beach",
      "8": "tms-hotel-da-nang-beach",
    };

    const target = (ALIAS_MAP[id] || id).toLowerCase();

    // 1. Exact match on id or slug
    let found = MOCK_HOTELS.find(
      (h) => h.id.toLowerCase() === target || h.slug.toLowerCase() === target
    );
    if (found) return found;

    // 2. Contains match on id or slug
    found = MOCK_HOTELS.find(
      (h) =>
        h.id.toLowerCase().includes(target) ||
        target.includes(h.id.toLowerCase()) ||
        h.slug.toLowerCase().includes(target) ||
        h.name.toLowerCase().includes(target)
    );
    if (found) return found;

    // 3. Graceful fallback to default hotel to ensure UI never crashes or renders blank
    return MOCK_HOTELS[0];
  },

  getRoomById(
    hotelId: string,
    roomId: string
  ): { hotel: HotelItem; room: HotelRoom } | null {
    const hotel = this.getHotelById(hotelId);
    if (!hotel || !hotel.rooms || hotel.rooms.length === 0) return null;

    let room = hotel.rooms.find((r) => r.id === roomId);
    if (!room) {
      room = hotel.rooms.find(
        (r) =>
          r.id.toLowerCase().includes(roomId.toLowerCase()) ||
          roomId.toLowerCase().includes(r.id.toLowerCase())
      );
    }
    if (!room) {
      room = hotel.rooms[0];
    }

    // Enhance room with rich default presentation if needed
    const defaultImages = [
      { url: room.imageUrl, label: "Phòng ngủ chính" },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        label: "Ban công view biển",
      },
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        label: "Bồn tắm đá tự nhiên",
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        label: "Phòng khách & Bar",
      },
    ];

    const defaultAmenityGroups = [
      {
        groupTitle: "Phòng tắm & Thư giãn",
        iconName: "bath",
        items: [
          "Bồn tắm nằm đá tự nhiên view biển",
          "Vòi sen tắm đứng áp lực lớn",
          "Áo choàng lông dệt cao cấp",
          "Máy sấy tóc Dyson Supersonic",
        ],
      },
      {
        groupTitle: "Công nghệ & Giải trí",
        iconName: "tv",
        items: [
          "Smart TV 55\" 4K sắc nét",
          "Loa Bluetooth Marshall Emberton",
          "Wi-Fi tốc độ cao 500Mbps riêng biệt",
        ],
      },
      {
        groupTitle: "Ẩm thực & Đồ uống",
        iconName: "coffee",
        items: [
          "Máy pha cà phê Nespresso và viên nén",
          "Minibar bổ sung miễn phí hằng ngày",
          "Trà thảo mộc hữu cơ cao cấp",
          "Nước khoáng cao cấp không giới hạn",
        ],
      },
      {
        groupTitle: "Dịch vụ & Tiện ích đặc quyền",
        iconName: "sparkles",
        items: [
          "Dọn phòng 2 lần/ngày tiêu chuẩn 5 sao",
          "Dịch vụ giặt ủi nhanh lấy trong ngày",
          "Bàn làm việc công thái học và đèn đọc sách",
        ],
      },
    ];

    const defaultPerks = [
      room.breakfastIncluded
        ? "Bữa sáng buffet thượng hạng miễn phí hàng ngày (2 khách)"
        : "Bữa sáng gọi món theo thực đơn ưu đãi",
      room.freeCancellation
        ? "Miễn phí hủy phòng trước 24 giờ nhận phòng"
        : "Chính sách hủy linh hoạt theo điều kiện đặt phòng",
      "Đặc quyền MeGo Club: Tích lũy 150 điểm thưởng + Welcome drink tại sảnh",
      "Quy định: Không hút thuốc trong phòng (khu vực hút thuốc riêng tại ban công)",
    ];

    const richRoom: HotelRoom = {
      ...room,
      view:
        room.view ||
        (room.name.toLowerCase().includes("biển") ||
        room.name.toLowerCase().includes("ocean")
          ? "Biển trực diện"
          : "Thành phố panorama"),
      badge: room.badge || "Hạng Sang Biển Trực Diện",
      rating: room.rating || hotel.rating,
      images:
        room.images && room.images.length > 0 ? room.images : defaultImages,
      amenityGroups:
        room.amenityGroups && room.amenityGroups.length > 0
          ? room.amenityGroups
          : defaultAmenityGroups,
      perks: room.perks && room.perks.length > 0 ? room.perks : defaultPerks,
    };

    return {
      hotel,
      room: richRoom,
    };
  },
};
