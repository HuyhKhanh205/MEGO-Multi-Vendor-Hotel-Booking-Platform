/**
 * Lớp HTTP dùng chung cho cổng Partner.
 *
 *  - Gọi backend qua `apiClient` dùng chung (tự gắn JWT, tự logout khi 401).
 *  - Backend MeGo trả DTO trực tiếp (không bọc { success, data }), nên chỉ đọc `res.data`.
 *  - Khi `VITE_PARTNER_USE_MOCK` khác "false", các service dùng dữ liệu mock giả lập backend
 *    (xem `data/backendSeedMock.ts`) vì backend chưa có API /api/partner/**.
 *    Hợp đồng API dự kiến: frontend/docs/partner-api-contract.md
 */

import type { AxiosRequestConfig } from "axios";
import apiClient, { getApiErrorMessage, getApiErrorStatus } from "../../../services/apiClient";

export const PARTNER_USE_MOCK = import.meta.env.VITE_PARTNER_USE_MOCK !== "false";

/** Lỗi thống nhất cho mọi service Partner (theo mẫu AuthApiError). */
export class PartnerApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "PartnerApiError";
    this.status = status;
  }
}

type Method = "get" | "post" | "put" | "patch" | "delete";

/** Gọi API thật và chuẩn hóa lỗi về PartnerApiError. */
export const partnerRequest = async <T,>(
  method: Method,
  url: string,
  fallbackError: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = method === "get" || method === "delete"
      ? await apiClient[method]<T>(url, config)
      : await apiClient[method]<T>(url, body, config);
    return res.data;
  } catch (error) {
    throw new PartnerApiError(getApiErrorMessage(error, fallbackError), getApiErrorStatus(error));
  }
};

/** Độ trễ giả lập mạng cho nhánh mock. */
export const mockDelay = (ms = 400) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
