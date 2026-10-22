/**
 * MeGo Auth Service
 *
 * Service layer cho các API xác thực người dùng.
 * Ghi chú: Các endpoint cần được kết nối với Spring Boot backend.
 *
 * Backend endpoints cần triển khai:
 *   POST /api/v1/auth/forgot-password       — Gửi mã khôi phục mật khẩu
 *   POST /api/v1/auth/reset-password         — Đặt lại mật khẩu bằng token
 *   POST /api/v1/auth/verify-email           — Xác minh email bằng token
 *   POST /api/v1/auth/resend-verification    — Gửi lại email xác minh
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// ─── Types ───────────────────────────────────────────────────────────────────

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

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const AuthService = {
  /**
   * Gửi yêu cầu khôi phục mật khẩu.
   * Backend sẽ gửi email chứa link/mã reset nếu email tồn tại.
   * Frontend luôn hiển thị thông báo trung tính (không tiết lộ email có tồn tại hay không).
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      const response = await axios.post<ForgotPasswordResponse>(
        `${API_BASE}/auth/forgot-password`,
        data
      );
      return response.data;
    } catch (error) {
      // Nếu backend chưa triển khai endpoint, trả về trạng thái pending
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data?.message ||
              "Không thể gửi yêu cầu khôi phục mật khẩu. Vui lòng thử lại."
          );
        }
        throw new Error(
          "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      }
      throw error;
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
      const response = await axios.post<ResetPasswordResponse>(
        `${API_BASE}/auth/reset-password`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error(
            error.response.data?.message ||
              "Token không hợp lệ hoặc đã hết hạn."
          );
        }
        if (error.response) {
          throw new Error(
            error.response.data?.message ||
              "Không thể đặt lại mật khẩu. Vui lòng thử lại."
          );
        }
        throw new Error(
          "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      }
      throw error;
    }
  },

  /**
   * Xác minh email bằng token từ email đăng ký.
   * Chỉ backend mới quyết định email đã được xác minh thành công hay chưa.
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await axios.post<VerifyEmailResponse>(
        `${API_BASE}/auth/verify-email`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error(
            error.response.data?.message ||
              "Liên kết xác minh không hợp lệ hoặc đã hết hạn."
          );
        }
        if (error.response) {
          throw new Error(
            error.response.data?.message ||
              "Không thể xác minh email. Vui lòng thử lại."
          );
        }
        throw new Error(
          "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      }
      throw error;
    }
  },

  /**
   * Gửi lại email xác minh.
   * Chỉ bắt đầu lại bộ đếm sau khi backend xác nhận yêu cầu gửi lại hợp lệ.
   */
  async resendVerification(
    data: ResendVerificationRequest
  ): Promise<ResendVerificationResponse> {
    try {
      const response = await axios.post<ResendVerificationResponse>(
        `${API_BASE}/auth/resend-verification`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error(
            error.response.data?.message ||
              "Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi và thử lại sau."
          );
        }
        if (error.response) {
          throw new Error(
            error.response.data?.message ||
              "Không thể gửi lại email. Vui lòng thử lại."
          );
        }
        throw new Error(
          "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      }
      throw error;
    }
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

export default AuthService;
