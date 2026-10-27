const numberFormat = new Intl.NumberFormat("vi-VN");
const decimalFormat = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });

export const formatVnd = (amount: number): string => `${numberFormat.format(amount)} ₫`;

/** Rút gọn số tiền lớn để không bị cắt trong thẻ KPI: 128.450.000 → "128,45 tr ₫". */
export const formatCompactVnd = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000_000) return `${decimalFormat.format(amount / 1_000_000_000)} tỷ ₫`;
  if (Math.abs(amount) >= 1_000_000) return `${decimalFormat.format(amount / 1_000_000)} tr ₫`;
  return formatVnd(amount);
};

const toDate = (value: string): Date => new Date(value.length === 10 ? `${value}T00:00:00` : value);

/** dd/MM/yyyy */
export const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(toDate(value));

/** dd/MM (Intl "vi-VN" trả về "dd-MM" khi bỏ năm nên ghép tay) */
export const formatDayMonth = (value: string): string => {
  const date = toDate(value);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
};

/** HH:mm (24h) */
export const formatTime = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(toDate(value));

export const formatWeekday = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(toDate(value));

export const nightsBetween = (checkIn: string, checkOut: string): number =>
  Math.max(1, Math.round((toDate(checkOut).getTime() - toDate(checkIn).getTime()) / 86_400_000));

export const isWeekend = (value: string): boolean => {
  const day = toDate(value).getDay();
  return day === 0 || day === 6;
};

/** Date (giờ địa phương) → yyyy-MM-dd */
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const todayIso = (): string => toIsoDate(new Date());

export const addDays = (iso: string, days: number): string => {
  const date = toDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};

/** 1 = Thứ Hai … 7 = Chủ nhật (ISO-8601) */
export const isoWeekday = (iso: string): number => {
  const day = toDate(iso).getDay();
  return day === 0 ? 7 : day;
};

/** Danh sách ngày từ from tới to (bao gồm cả hai đầu) */
export const dateRange = (from: string, to: string): string[] => {
  const days: string[] = [];
  for (let current = from; current <= to; current = addDays(current, 1)) days.push(current);
  return days;
};

/** Giá gọn trong ô lịch: 1.450.000 → "1,45tr" */
export const formatShortPrice = (amount: number): string =>
  amount >= 1_000_000 ? `${decimalFormat.format(amount / 1_000_000)}tr` : `${decimalFormat.format(amount / 1_000)}k`;

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** "Vừa xong", "5 phút trước", "3 giờ trước", "2 ngày trước", quá 7 ngày thì dd/MM/yyyy */
export const formatRelativeTime = (value: string, now = Date.now()): string => {
  const minutes = Math.floor((now - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} giờ trước`;
  if (minutes < 7 * 24 * 60) return `${Math.floor(minutes / (24 * 60))} ngày trước`;
  return formatDate(value);
};

/** Chữ tắt cho avatar: chữ đầu của họ + tên ("Nguyễn Văn An" → "NA") */
export const nameInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts.length > 1 ? parts[0][0] : ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
};
