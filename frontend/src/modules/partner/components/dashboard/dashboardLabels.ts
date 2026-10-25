import type { DashboardPeriod, PaymentStatus, StayStatus } from "../../types/partner.types";

export const PERIOD_OPTIONS: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "TODAY", label: "Hôm nay" },
  { value: "LAST_7_DAYS", label: "7 ngày qua" },
  { value: "THIS_MONTH", label: "Tháng này" },
];

export const PERIOD_COPY: Record<DashboardPeriod, { revenue: string; bookings: string; comparison: string }> = {
  TODAY: { revenue: "Doanh thu hôm nay", bookings: "Lượt đặt hôm nay", comparison: "so với hôm qua" },
  LAST_7_DAYS: { revenue: "Doanh thu 7 ngày", bookings: "Lượt đặt 7 ngày", comparison: "so với 7 ngày trước" },
  THIS_MONTH: { revenue: "Doanh thu tháng này", bookings: "Tổng lượt đặt phòng", comparison: "so với tháng trước" },
};

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; className: string }> = {
  PAID: { label: "Đã thanh toán", className: "bg-emerald-50 text-emerald-700" },
  CARD_GUARANTEE: { label: "Bảo lãnh thẻ", className: "bg-blue-50 text-blue-700" },
  PAY_AT_HOTEL: { label: "Thu tại khách sạn", className: "bg-amber-50 text-amber-700" },
};

export const STAY_STATUS: Record<StayStatus, { label: string; className: string }> = {
  ARRIVING: { label: "Sắp đến", className: "bg-sky-100 text-sky-800" },
  IN_HOUSE: { label: "Đang lưu trú", className: "bg-teal-700 text-white" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-slate-100 text-slate-700" },
  DEPARTING: { label: "Trả phòng", className: "bg-rose-100 text-rose-700" },
};
