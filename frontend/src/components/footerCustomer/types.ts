export interface FooterLink {
  id: string;
  label: string;
  path: string;
  isPlaceholder?: boolean;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export interface PaymentBadge {
  id: string;
  label: string;
}

export interface PaymentSectionData {
  title: string;
  description: string;
  rows: PaymentBadge[][];
  disclaimer?: string;
}

export interface BrandSectionData {
  description: string;
  hotlineTitle: string;
  hotline: string;
  hotlineTel: string;
}
