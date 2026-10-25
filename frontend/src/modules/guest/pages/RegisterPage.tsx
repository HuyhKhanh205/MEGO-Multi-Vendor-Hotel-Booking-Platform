import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterHero, RegisterForm, type RegisterFormValues } from "../components/register";
import { useAppSelector } from "../../../stores/store";
import { AuthService, getPostLoginPath } from "../../../services/auth.service";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect nội bộ (nếu có) — getPostLoginPath sẽ chặn open redirect
  const explicitRedirect =
    searchParams.get("redirect") ||
    (location.state as { from?: string } | undefined)?.from ||
    null;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(getPostLoginPath(user?.role, explicitRedirect), {
        replace: true,
      });
    }
  }, [isAuthenticated, user?.role, navigate, explicitRedirect]);

  useEffect(() => {
    document.title = "Đăng ký thành viên MeGo Club | Nhận ngay 500 điểm thưởng";
    window.scrollTo(0, 0);
  }, []);

  // Form submit handler — POST /api/auth/register → chuyển sang nhập OTP
  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await AuthService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phoneNumber || undefined,
      });

      toast.success(res.message || "Đăng ký thành công! Vui lòng kiểm tra email.", {
        position: "top-right",
        autoClose: 5000,
      });

      const params = new URLSearchParams({ email: values.email });
      if (explicitRedirect) params.set("redirect", explicitRedirect);
      navigate(`/verify-email?${params.toString()}`, { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại."
      );
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
      `Cổng đăng ký nhanh qua ${providerNames[provider]} chưa được hỗ trợ. Vui lòng hoàn tất biểu mẫu đăng ký tiêu chuẩn.`,
      { autoClose: 4000 }
    );
  };

  const loginUrl = `/login${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F6FC] py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1280px] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-stretch">
        {/* ── Cột trái (~50%): Brand Hero MeGo Club ── */}
        <div className="hidden lg:block p-3">
          <RegisterHero />
        </div>

        {/* ── Cột phải (~50%): Register Form ── */}
        <div className="p-6 sm:p-9 lg:p-11 flex flex-col justify-center">
          <RegisterForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleRegisterSubmit}
            onSocialClick={handleSocialClick}
            loginLink={loginUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;