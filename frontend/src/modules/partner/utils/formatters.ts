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
