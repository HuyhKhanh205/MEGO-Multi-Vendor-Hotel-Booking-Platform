import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginHero, LoginForm } from "../components/login";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";
import {
  AuthService,
  AuthApiError,
  getPostLoginPath,
} from "../../../services/auth.service";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect nội bộ (nếu có) — getPostLoginPath sẽ chặn open redirect
  const explicitRedirect =
    searchParams.get("redirect") ||
    (location.state as { from?: string } | undefined)?.from ||
    null;

  // Redirect if already authenticated (bao gồm ngay sau khi đăng nhập thành công)
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getPostLoginPath(user?.role, explicitRedirect), {
        replace: true,
      });
    }
  }, [isAuthenticated, user?.role, navigate, explicitRedirect]);

  useEffect(() => {
    document.title = "Đăng nhập tài khoản | MeGo Khách sạn & Resort";
    window.scrollTo(0, 0);
  }, []);

  // Form submit handler — POST /api/auth/login
  const handleLoginSubmit = async (values: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    const email = values.identifier.trim().toLowerCase();

    try {
      const res = await AuthService.login({ email, password: values.password });

      toast.success(res.message || "Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Effect phía trên sẽ điều hướng theo redirect / vai trò
      dispatch(loginSuccess({ user: AuthService.toAuthUser(res), token: res.jwt }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại.";

      // 403 + chưa xác minh email → gửi lại OTP và chuyển sang trang xác minh
      if (
        err instanceof AuthApiError &&
        err.status === 403 &&
        message.toLowerCase().includes("xác minh")
      ) {
        try {
          await AuthService.resendOtp(email);
          toast.info("Tài khoản chưa xác minh. Mã OTP mới đã được gửi tới email của bạn.");
        } catch {
          // Vẫn chuyển trang — người dùng có thể bấm "Gửi lại" tại đó
        }
        const params = new URLSearchParams({ email });
        if (explicitRedirect) params.set("redirect", explicitRedirect);
        navigate(`/verify-email?${params.toString()}`);
        return;
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Social OAuth click handler
  const handleSocialClick = (provider: "google" | "facebook" | "apple") => {
    const providerNames = {
      google: "Google OAuth 2.0",
      facebook: "Facebook Login",
      apple: "Apple ID",
    };
    toast.info(
      `Cổng đăng nhập qua ${providerNames[provider]} chưa được hỗ trợ. Vui lòng đăng nhập bằng Email.`,
      { autoClose: 4000 }
    );
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F6FC] py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1280px] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-stretch">
        {/* ── Cột trái (~53%): Brand Hero Banner ── */}
        <div className="hidden lg:block p-3">
          <LoginHero />
        </div>

        {/* ── Cột phải (~47%): Login Form ── */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <LoginForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleLoginSubmit}
            onSocialClick={handleSocialClick}
            registerLink={`/register${
              searchParams.toString() ? `?${searchParams.toString()}` : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;