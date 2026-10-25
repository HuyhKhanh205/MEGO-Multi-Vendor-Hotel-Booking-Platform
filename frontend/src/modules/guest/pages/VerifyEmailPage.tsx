import React, { useCallback, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { VerifyEmailCard } from "../components/auth";
import { useAppDispatch } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";
import {
  AuthService,
  getPostLoginPath,
  type AuthResponse,
} from "../../../services/auth.service";

/**
 * Trang Xác nhận Email — /verify-email?email=user@example.com[&redirect=/path]
 *
 * Sau khi đăng ký (hoặc đăng nhập khi tài khoản chưa xác minh), người dùng
 * nhập mã OTP 6 số được gửi qua email. Xác minh thành công → backend trả JWT
 * → đăng nhập luôn và chuyển hướng.
 *
 * Backend:
 *   POST /api/auth/verify-otp  — Xác minh OTP, kích hoạt + trả JWT
 *   POST /api/auth/resend-otp  — Gửi lại OTP
 */
export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    document.title = "Xác nhận email | MeGo Hotel & Resort";
    window.scrollTo(0, 0);
  }, []);

  const loginLink = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";

  const handleVerified = useCallback(
    (res: AuthResponse) => {
      dispatch(loginSuccess({ user: AuthService.toAuthUser(res), token: res.jwt }));
      toast.success(res.message || "Xác minh thành công! Chào mừng bạn đến với MeGo.", {
        position: "top-right",
        autoClose: 4000,
      });
      navigate(getPostLoginPath(res.role, redirect), { replace: true });
    },
    [dispatch, navigate, redirect]
  );

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
            loginLink={loginLink}
            onVerified={handleVerified}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
