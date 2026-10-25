export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  badgeText?: string;
  badgeType?: "success" | "warning" | "danger" | "info" | "neutral";
  icon: string;
}

export interface PartnerVerificationItem {
  id: string;
  code: string;
  name: string;
  category: string;
  region: string;
  legalStatus: "valid" | "missing_fire" | "pending_review" | "rejected";
  legalStatusLabel: string;
  submittedAt: string;
  roomCount: number;
  contactPerson: string;
  phone: string;
}

export interface SecurityAlert {
  id: string;
  type: "review_complaint" | "ip_monitor" | "channel_manager" | "security_incident";
  title: string;
  description: string;
  timeAgo: string;
  badgeText: string;
  badgeType: "danger" | "warning" | "success" | "info";
  actionText?: string;
  actionType?: "review" | "hold" | "dismiss";
}

export interface SettlementPartner {
  id: string;
  code: string;
  name: string;
  hotelCode: string;
  region: string;
  orderCount: number;
  totalGmv: number;
  takeRate: number;
  commission: number;
  netPayout: number;
  status: "paid" | "pending_payout_w4" | "bank_reconciling" | "disputed";
  statusLabel: string;
}

export interface AdminUser {
  id: string;
  userCode: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  location: string;
  vipTier?: "VIP Gold" | "VIP Diamond" | "VIP Silver" | "Standard";
  role: "customer" | "partner" | "admin";
  roleDetail: string;
  status: "active" | "suspended" | "pending_verification";
  suspensionInfo?: {
    reason: string;
    note: string;
    duration: "7_days" | "30_days" | "permanent";
    suspendedAt: string;
    suspendedBy: string;
  };
  totalBookings?: number;
  totalSpent?: number;
  joinedDate: string;
}

export interface RolePermissionModule {
  id: string;
  moduleCode: string;
  moduleName: string;
  subtitle: string;
  badgeText?: string;
  badgeType?: "info" | "warning" | "danger";
  permissions: {
    id: string;
    code: string;
    name: string;
    description: string;
    checked: boolean;
    isHighPrivilege?: boolean;
  }[];
}

export interface AdminRoleItem {
  id: string;
  code: string;
  name: string;
  accessLevel: string;
  description: string;
  userCount: number;
  isActive: boolean;
  isSystemRoot?: boolean;
}

export interface HotelListingItem {
  id: string;
  code: string;
  name: string;
  rating: number;
  starRating: number;
  address: string;
  city: string;
  totalRooms: number;
  availableRooms: number;
  priceRange: string;
  status: "active" | "pending" | "suspended";
  partnerName: string;
  commissionRate: number;
  imageUrl: string;
}

export interface BookingOrderItem {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  paymentMethod: "vnpay" | "stripe" | "hotel_pay";
  paymentStatus: "paid" | "pending" | "refunded";
  bookingStatus: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface PromotionCampaign {
  id: string;
  code: string;
  title: string;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  minBookingValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  budgetTotal: number;
  budgetUsed: number;
  usageCount: number;
  status: "active" | "scheduled" | "expired" | "paused";
}

export interface ReviewModerationItem {
  id: string;
  reviewCode: string;
  hotelName: string;
  customerName: string;
  rating: number;
  comment: string;
  reportReason?: string;
  reportedBy?: string;
  status: "pending_review" | "approved" | "hidden" | "deleted";
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  targetType: "User" | "Partner" | "Role" | "Financial" | "System";
  targetId: string;
  details: string;
  ipAddress: string;
  status: "success" | "warning" | "denied";
}
