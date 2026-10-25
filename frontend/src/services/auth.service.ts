/**
 * MeGo Auth Service
 *
 * Service layer cho các API xác thực người dùng — kết nối Spring Boot backend
 * (AuthController, base path `/api/auth`).
 *
 * Backend endpoints đã triển khai:
 *   POST /api/auth/register     — Đăng ký, tạo user PENDING_VERIFICATION + gửi OTP email
 *   POST /api/auth/verify-otp   — Xác minh OTP 6 số → kích hoạt + trả JWT
 *   POST /api/auth/resend-otp   — Gửi lại OTP
 *   POST /api/auth/login        — Đăng nhập email + password → trả JWT
 *
 * Backend endpoints CHƯA triển khai (giữ lại cho màn hình quên mật khẩu):
 *   POST /api/auth/forgot-password
 *   POST /api/auth/reset-password
 */

import apiClient, {
  getApiErrorMessage,
  getApiErrorStatus,
} from "./apiClient";
import type { User } from "../stores/authSlice";

// ─── Types ───────────────────────────────────────────────────────────────────

/** Khớp enum RoleName phía backend */
export type BackendRole = "CUSTOMER" | "PARTNER" | "PARTNER_STAFF" | "ADMIN";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/** Khớp AuthResponse phía backend */
export interface AuthResponse {
  jwt: string;
  message: string;
  role: BackendRole;
  email: string;
  fullName: string;
}

/** Khớp MessageResponse phía backend */
export interface MessageResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  /** Backend có thể trả về cooldown (giây) để hiển thị bộ đếm */
  cooldownSeconds?: number;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/** Lỗi API có kèm HTTP status để UI xử lý theo từng trường hợp (401/403...). */
export class AuthApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const toAuthError = (error: unknown, fallback: string) =>
  new AuthApiError(getApiErrorMessage(error, fallback), getApiErrorStatus(error));

// ─── Service ─────────────────────────────────────────────────────────────────

export const AuthService = {
  /** Đăng nhập bằng email + mật khẩu. */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>("/auth/login", data);
      return res.data;
    } catch (error) {
      throw toAuthError(error, "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  },

  /** Đăng ký tài khoản mới — backend gửi mã OTP 6 số tới email. */
  async register(data: RegisterRequest): Promise<MessageResponse> {
    try {
      const res = await apiClient.post<MessageResponse>("/auth/register", data);
      return res.data;
    } catch (error) {
      throw toAuthError(error, "Đăng ký thất bại. Vui lòng thử lại.");
    }
  },

  /** Xác minh OTP đăng ký — thành công sẽ trả JWT (đăng nhập luôn). */
  async verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
    try {
      const res = await apiClient.post<AuthResponse>("/auth/verify-otp", data);
      return res.data;
    } catch (error) {
      throw toAuthError(error, "Không thể xác minh mã OTP. Vui lòng thử lại.");
    }
  },

  /** Gửi lại mã OTP xác minh email. */
  async resendOtp(email: string): Promise<MessageResponse> {
    try {
      const res = await apiClient.post<MessageResponse>("/auth/resend-otp", {
        email,
      });
      return res.data;
    } catch (error) {
      throw toAuthError(error, "Không thể gửi lại mã OTP. Vui lòng thử lại.");
    }
  },

  /**
   * Gửi yêu cầu khôi phục mật khẩu.
   * Backend sẽ gửi email chứa link/mã reset nếu email tồn tại.
   * Frontend luôn hiển thị thông báo trung tính (không tiết lộ email có tồn tại hay không).
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      const res = await apiClient.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        data
      );
      return res.data;
    } catch (error) {
      throw toAuthError(
        error,
        "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại."
      );
    }
  },

  /**
   * Đặt lại mật khẩu với token hợp lệ từ email.
   * Token phải được backend xác minh trước khi cho phép đổi mật khẩu.
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      const res = await apiClient.post<ResetPasswordResponse>(
        "/auth/reset-password",
        data
      );
      return res.data;
    } catch (error) {
      throw toAuthError(
        error,
        getApiErrorStatus(error) === 400
          ? "Token không hợp lệ hoặc đã hết hạn."
          : "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
    }
  },

  /** Chuyển AuthResponse của backend → User lưu trong Redux store. */
  toAuthUser(res: AuthResponse): User {
    return {
      id: res.email,
      name: res.fullName,
      email: res.email,
      role: res.role,
    };
  },

  /**
   * Trích xuất nhà cung cấp email từ địa chỉ email.
   * Trả về URL webmail nếu xác định được; null nếu không.
   */
  getEmailProviderUrl(email: string): { name: string; url: string } | null {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return null;

    const providers: Record<string, { name: string; url: string }> = {
      "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
      "googlemail.com": { name: "Gmail", url: "https://mail.google.com" },
      "outlook.com": { name: "Outlook", url: "https://outlook.live.com" },
      "hotmail.com": { name: "Outlook", url: "https://outlook.live.com" },
      "live.com": { name: "Outlook", url: "https://outlook.live.com" },
      "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
      "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
      "protonmail.com": {
        name: "ProtonMail",
        url: "https://mail.proton.me",
      },
      "proton.me": { name: "ProtonMail", url: "https://mail.proton.me" },
    };

    return providers[domain] || null;
  },
};

/**
 * Xác định trang đích sau khi đăng nhập.
 * Ưu tiên redirect hợp lệ (nội bộ) từ URL; nếu không có thì điều hướng theo vai trò.
 */
export const getPostLoginPath = (
  role: User["role"] | undefined,
  explicitRedirect?: string | null
): string => {
  if (
    explicitRedirect &&
    explicitRedirect.startsWith("/") &&
    !explicitRedirect.startsWith("//")
  ) {
    return explicitRedirect;
  }
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PARTNER":
    case "PARTNER_STAFF":
      return "/partner";
    default:
      return "/";
  }
};

export default AuthService;
