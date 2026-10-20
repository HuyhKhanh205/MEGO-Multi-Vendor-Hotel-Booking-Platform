export interface NavItem {
  id: string;
  label: string;
  path: string;
  badge?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: "booking" | "promo" | "system";
}

export interface SupportContact {
  hotline: string;
  hotlineTime: string;
  email: string;
  onlineStaff: number;
}
