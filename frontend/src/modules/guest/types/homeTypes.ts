export interface HotelSearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  selectedTag?: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: "shield" | "clock" | "tag" | "refresh";
  badge?: string;
}

export interface FeaturedHotel {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  reviewCount: number;
  ratingText: string;
  imageUrl: string;
  amenities: string[];
  originalPrice?: number;
  salePrice: number;
  discountPercent?: number;
  isPopular?: boolean;
  badge?: string;
  distanceToBeach?: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  cityKey: string;
  tagline: string;
  /** Nhãn viết hoa hiển thị trong card (VD: "THÀNH PHỐ ĐÁNG SỐNG") */
  badgeLabel: string;
  /** Số chỗ lưu trú tham khảo hiển thị badge top-left (VD: "1,240 khách sạn") */
  accommodationBadge: string;
  hotelCount: number;
  imageUrl: string;
  /** Giá tham khảo mỗi đêm — dữ liệu demo, chưa xác minh từ API */
  startingPrice?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  location: string;
  stayedAt: string;
  content: string;
  rating: number;
  avatarText: string;
}
