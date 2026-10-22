export type PropertyType =
  | "hotel"
  | "resort"
  | "villa"
  | "apartment"
  | "homestay";

export type StarRating = 1 | 2 | 3 | 4 | 5;

export type SortCriteria =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "stars-desc";

export interface RoomImageItem {
  url: string;
  label: string;
}

export interface RoomAmenityGroup {
  groupTitle: string;
  iconName?: string;
  items: string[];
}

export interface HotelRoom {
  id: string;
  name: string;
  bedType: string;
  maxGuests: number;
  areaM2: number;
  originalPrice?: number;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  availableRooms: number;
  subTitle?: string;
  badge?: string;
  view?: string;
  images?: RoomImageItem[];
  amenityGroups?: RoomAmenityGroup[];
  perks?: string[];
  rating?: number;
}

export interface HotelItem {
  id: string;
  name: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  propertyType: PropertyType;
  stars: StarRating;
  rating: number;
  reviewCount: number;
  ratingText: string;
  images: string[];
  coverImage: string;
  amenities: string[];
  description: string;
  shortDescription: string;
  distanceToBeach?: string;
  distanceToCenter?: string;
  originalPrice?: number;
  pricePerNight: number;
  discountPercent?: number;
  isPopular?: boolean;
  badge?: string;
  policies: {
    freeCancellation: boolean;
    payAtHotel: boolean;
    breakfastIncluded: boolean;
    checkInTime: string;
    checkOutTime: string;
  };
  rooms?: HotelRoom[];
  location?: {
    lat: number;
    lng: number;
  };
}

export interface HotelFilterState {
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string; // e.g. "under-500k" | "500k-1m" | "1m-2m" | "over-2m"
  stars: number[];
  ratingThreshold?: number; // 4.5, 4.0, 3.5, 3.0
  amenities: string[];
  propertyTypes: PropertyType[];
  policies: string[]; // "free-cancellation", "pay-at-hotel", "breakfast"
}

export interface HotelSearchParams {
  destination?: string;
  keyword?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  sort?: SortCriteria;
  page?: number;
  limit?: number;
  view?: "list" | "map";
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface HotelReview {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  ratingText: string;
  stayDate: string;
  roomType: string;
  travelerType: string; // "Cặp đôi" | "Gia đình" | "Nhóm bạn" | "Công tác"
  comment: string;
  likes: number;
}

export interface BookingGuestInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  specialRequests?: string;
}
