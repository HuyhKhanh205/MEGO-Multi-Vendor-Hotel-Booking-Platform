/**
 * Quy tắc giá & tồn kho dùng chung cho form (xem trước / kiểm tra) và mock service.
 * Backend nên kiểm tra lại cùng các ràng buộc này.
 */

import type { AllotmentMode, PriceAdjustMode } from "../types/backend.types";

export const MIN_ROOM_PRICE = 50_000;
export const MAX_ROOM_PRICE = 500_000_000;
export const MAX_RANGE_DAYS = 366;
export const PERCENT_MIN = -90;
export const PERCENT_MAX = 300;

/** Ô "sắp hết phòng": còn ≤ 2 phòng và chưa khóa bán */
export const LOW_STOCK_THRESHOLD = 2;

/** Giá mới sau điều chỉnh; null = về giá cơ bản của hạng phòng. Theo % thì làm tròn tới 1.000 ₫. */
export const applyPriceAdjust = (currentPrice: number, mode: PriceAdjustMode, value: number): number | null => {
  switch (mode) {
    case "SET":
      return Math.round(value);
    case "PERCENT":
      return Math.round((currentPrice * (1 + value / 100)) / 1_000) * 1_000;
    case "AMOUNT":
      return Math.round(currentPrice + value);
    case "RESET":
      return null;
  }
};

/** Số phòng mở bán mới: SET = đặt bằng N (tối đa tổng phòng), REDUCE = bớt N phòng khỏi bán. */
export const applyAllotment = (available: number, total: number, mode: AllotmentMode, value: number): number =>
  mode === "SET" ? Math.min(total, Math.max(0, value)) : Math.max(0, available - value);

export const priceError = (price: number | null): string | null => {
  if (price === null) return null;
  if (!Number.isFinite(price) || price < MIN_ROOM_PRICE) return `Giá phòng tối thiểu ${MIN_ROOM_PRICE.toLocaleString("vi-VN")} ₫.`;
  if (price > MAX_ROOM_PRICE) return "Giá phòng vượt mức cho phép.";
  return null;
};

export interface BulkScope {
  from: string;
  to: string;
  weekdays: number[];
  roomTypeIds: number[];
}

/** Kiểm tra phạm vi áp dụng chung của form giá / tồn kho hàng loạt. */
export const validateBulkScope = (scope: BulkScope, today: string): Partial<Record<"range" | "weekdays" | "roomTypeIds", string>> => {
  const errors: Partial<Record<"range" | "weekdays" | "roomTypeIds", string>> = {};
  if (!scope.from || !scope.to) errors.range = "Chọn khoảng ngày áp dụng.";
  else if (scope.from > scope.to) errors.range = "Ngày kết thúc phải sau ngày bắt đầu.";
  else if (scope.to < today) errors.range = "Không thể cập nhật các ngày đã qua.";
  else if ((Date.parse(scope.to) - Date.parse(scope.from)) / 86_400_000 + 1 > MAX_RANGE_DAYS) errors.range = `Chỉ cập nhật tối đa ${MAX_RANGE_DAYS} ngày mỗi lần.`;
  if (!scope.weekdays.length) errors.weekdays = "Chọn ít nhất một thứ.";
  if (!scope.roomTypeIds.length) errors.roomTypeIds = "Chọn ít nhất một hạng phòng.";
  return errors;
};
