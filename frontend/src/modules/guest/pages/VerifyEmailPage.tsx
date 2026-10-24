import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { VerifyEmailCard } from "../components/auth";

/**
 * Trang Xác nhận Email — /verify-email
 *
 * Hai luồng sử dụng:
 *
 * 1. Xác minh email sau đăng ký:
 *    URL: /verify-email?email=user@example.com
 *    Hiển thị trạng thái chờ xác nhận + bộ đếm gửi lại.
 *
 * 2. Xác minh từ link email:
 *    URL: /verify-email?token=abc123&email=user@example.com
 *    Tự động gọi API xác minh.
 *
 * Ghi chú backend:
 *   POST /api/v1/auth/verify-email         — Xác minh bằng token
 *   POST /api/v1/auth/resend-verification  — Gửi lại email xác minh
 */
export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");

  useEffect(() => {
    document.title = "Xác nhận email | MeGo Hotel & Resort";
    window.scrollTo(0, 0);
  }, []);

  const loginLink = "/login";

  // No email → redirect guidance
  if (!email) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#F4F6FC] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-[420px] space-y-5">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-[#1677FF]">Me</span>
                <span className="text-slate-800">Go</span>
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 sm:p-8 text-center space-y-4">
            <h1 className="text-xl font-bold text-slate-900">
              Thiếu thông tin email
            </h1>
            <p className="text-sm text-slate-500">
              Không tìm thấy địa chỉ email cần xác minh. Vui lòng truy cập
              trang này từ liên kết trong email hoặc đăng ký lại.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                className="w-full h-11 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white font-bold text-sm transition-all flex items-center justify-center"
              >
                Đăng ký tài khoản
              </Link>
              <Link
                to="/login"
                className="text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
              >
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <VerifyEmailCard
            email={email}
            token={token}
            loginLink={loginLink}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
