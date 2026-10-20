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
  hotelCount: number;
  imageUrl: string;
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
