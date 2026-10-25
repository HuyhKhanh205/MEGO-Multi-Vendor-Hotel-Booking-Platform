/**
 * MeGo API Client
 *
 * Axios instance dùng chung để gọi Spring Boot backend.
 *  - baseURL đọc từ VITE_API_BASE_URL (mặc định http://localhost:8080/api)
 *  - Tự động gắn header `Authorization: Bearer <jwt>` cho các API cần xác thực
 *  - KHÔNG gắn token cho /auth/** (backend JwtTokenValidator sẽ trả 401 nếu
 *    token cũ/hỏng được gửi kèm, kể cả với endpoint permitAll)
 *  - Khi nhận 401 từ API cần xác thực → gọi handler (logout) đã đăng ký
 */

import axios, { type AxiosError } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const AUTH_TOKEN_KEY = "mego_auth_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

const isAuthEndpoint = (url?: string) =>
  !!url && (url.includes("/auth/") || (url.includes("/chat") && !url.includes("/chat/book")));

// ── Request: gắn JWT ─────────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  if (!isAuthEndpoint(config.url)) {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Storage unavailable
    }
  }
  return config;
});

// ── Response: xử lý 401 (token hết hạn / không hợp lệ) ──────────────────────
let unauthorizedHandler: (() => void) | null = null;

/** Đăng ký hàm được gọi khi API trả 401 (thường là dispatch(logout())). */
export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint(error.config?.url)
    ) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

// ── Helpers ──────────────────────────────────────────────────────────────────

interface BackendErrorBody {
  message?: string;
  error?: string;
  fields?: Record<string, string>;
}

/**
 * Chuẩn hoá thông báo lỗi từ backend MeGo:
 *  - { message }                       → MessageResponse (400/401/403/500)
 *  - { status, error, fields: {...} }  → lỗi validation @Valid
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string => {
  if (axios.isAxiosError<BackendErrorBody>(error)) {
    if (!error.response) {
      return "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
    }
    const data = error.response.data;
    if (data?.fields && Object.keys(data.fields).length > 0) {
      return Object.values(data.fields).join(" • ");
    }
    return data?.message || data?.error || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

/** Lấy HTTP status từ lỗi axios (nếu có). */
export const getApiErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

export default apiClient;
