import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ResetPasswordForm } from "../components/auth";
import { AuthService } from "../../../services/auth.service";

/**
 * Trang Đặt lại mật khẩu — /reset-password
 *
 * Luồng:
 * 1. Người dùng click link khôi phục mật khẩu trong email.
 * 2. URL: /reset-password?token=abc123
 * 3. Frontend xác minh token với backend.
 * 4. Nếu hợp lệ → hiển thị form nhập mật khẩu mới.
 * 5. Gửi mật khẩu mới + token → backend đặt lại mật khẩu.
 *
 * Ghi chú backend: Cần triển khai endpoint POST /api/v1/auth/reset-password
 * Token phải được backend xác minh trước khi cho phép đổi mật khẩu.
 */
export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isTokenChecking] = useState(false);

  useEffect(() => {
    document.title = "Đặt lại mật khẩu | MeGo Hotel & Resort";
    window.scrollTo(0, 0);
  }, []);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setErrorMessage(
        "Không tìm thấy mã khôi phục. Vui lòng sử dụng liên kết trong email hoặc yêu cầu gửi lại mã."
      );
      return;
    }

    // Token format sanity check (basic — real validation is server-side)
    if (token.length < 10) {
      setIsTokenValid(false);
      setErrorMessage("Mã khôi phục không hợp lệ.");
      return;
    }

    // Token looks reasonable for now.
    // Real token validation happens when the form is submitted via the API.
    // If backend has a separate validate-token endpoint, call it here:
    //
    // setIsTokenChecking(true);
    // AuthService.validateResetToken({ token })
    //   .then(res => { setIsTokenValid(res.valid); })
    //   .catch(() => { setIsTokenValid(false); })
    //   .finally(() => { setIsTokenChecking(false); });
    setIsTokenValid(true);
  }, [token]);

  const loginLink = "/login";

  const handleSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await AuthService.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      if (
        err instanceof Error &&
        (err.message.includes("hết hạn") ||
          err.message.includes("không hợp lệ"))
      ) {
        setIsTokenValid(false);
      }
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Không thể đặt lại mật khẩu. Vui lòng thử lại."
      );
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
          <ResetPasswordForm
            token={token}
            isLoading={isLoading}
            isSuccess={isSuccess}
            errorMessage={errorMessage}
            isTokenValid={isTokenValid}
            isTokenChecking={isTokenChecking}
            onSubmit={handleSubmit}
            loginLink={loginLink}
          />
        </div>

        {/* ── Support Footer ── */}
        <div className="text-center text-xs text-slate-400">
          <span>Cần hỗ trợ? </span>
          <Link
            to="/support"
            className="font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
          >
            Liên hệ Trung tâm hỗ trợ MeGo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
