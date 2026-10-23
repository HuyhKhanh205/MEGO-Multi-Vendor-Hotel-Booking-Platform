export type OfferCategoryId =
  | "all"
  | "club"
  | "partners"
  | "combo"
  | "early-bird";

export interface OfferCategoryTab {
  id: OfferCategoryId;
  label: string;
  iconName: string;
  badgeCount?: number;
}

export interface PlatformVoucherItem {
  id: string;
  code: string;
  tag: string;
  tagBgClass: string;
  tagTextClass: string;
  expiryDate: string;
  discountTitle: string;
  description: string;
  remainingText: string;
  minBookingValue: number;
  category: OfferCategoryId;
}

export interface DestinationDealItem {
  id: string;
  name: string;
  tagline: string;
  discountText: string;
  hotelCountText: string;
  imageUrl: string;
  destination: string;
}

export interface FinancialPartnerDealItem {
  id: string;
  partnerName: string;
  partnerColorClass: string;
  badge: string;
  badgeBgClass: string;
  discountTitle: string;
  description: string;
  promoCode?: string;
  terms: string;
}

export interface MeGoClubRedeemOption {
  id: string;
  voucherValue: number;
  voucherLabel: string;
  pointsRequired: number;
}

export type OfferSortOption =
  | "recommended"
  | "discount-desc"
  | "price-asc"
  | "price-desc";
