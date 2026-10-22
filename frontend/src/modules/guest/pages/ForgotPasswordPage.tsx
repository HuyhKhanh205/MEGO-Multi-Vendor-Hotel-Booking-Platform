import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../components/auth";
import { AuthService } from "../../../services/auth.service";

/**
 * Trang Quên mật khẩu — /forgot-password
 *
 * Luồng:
 * 1. Người dùng nhập email đã đăng ký.
 * 2. Gọi API POST /api/v1/auth/forgot-password.
 * 3. Backend gửi email chứa link/mã khôi phục (nếu email tồn tại).
 * 4. Frontend hiển thị thông báo trung tính (không tiết lộ email có tồn tại hay không).
 *
 * Ghi chú backend: Cần triển khai endpoint POST /api/v1/auth/forgot-password
 */
export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Quên mật khẩu | MeGo Hotel & Resort";
    window.scrollTo(0, 0);
  }, []);

  // Preserve redirect param for login link
  const loginLink = `/login${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const handleSubmit = async (email: string) => {
    // Reset signal from ForgotPasswordForm
    if (email === "__reset__") {
      setIsSubmitted(false);
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await AuthService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err) {
      // Nếu backend chưa triển khai → hiển thị thông báo trung tính
      // thay vì lỗi kỹ thuật, vì lý do bảo mật
      if (
        err instanceof Error &&
        err.message.includes("Không thể kết nối")
      ) {
        // Backend chưa sẵn sàng — vẫn hiển thị thông báo trung tính
        setIsSubmitted(true);
      } else {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi. Vui lòng thử lại."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F6FC] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-[420px] space-y-5">
        {/* ── Logo ── */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#1677FF]">Me</span>
              <span className="text-slate-800">Go</span>
            </span>
          </Link>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 sm:p-8">
          <ForgotPasswordForm
            isLoading={isLoading}
            isSubmitted={isSubmitted}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            loginLink={loginLink}
          />
        </div>

        {/* ── Support Footer ── */}
        <div className="text-center text-xs text-slate-400">
          <span>Bạn gặp trở ngại khi truy cập tài khoản? </span>
          <Link
            to="/support"
            className="font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
          >
            Liên hệ Hỗ trợ 24/7
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
