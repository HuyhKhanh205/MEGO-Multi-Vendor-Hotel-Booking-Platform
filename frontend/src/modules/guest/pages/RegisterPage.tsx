import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterHero, RegisterForm, type RegisterFormValues } from "../components/register";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate internal redirect URL to prevent open redirect vulnerabilities
  const rawRedirect =
    searchParams.get("redirect") ||
    (location.state as { from?: string } | undefined)?.from ||
    "/";
  const safeRedirect =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(safeRedirect, { replace: true });
    }
  }, [isAuthenticated, navigate, safeRedirect]);

  useEffect(() => {
    document.title = "Đăng ký thành viên MeGo Club | Nhận ngay 500 điểm thưởng";
    window.scrollTo(0, 0);
  }, []);

  // Form submit handler
  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate backend API call (Ghi chú: kết nối endpoint Spring Boot /api/v1/auth/register)
    setTimeout(() => {
      setIsLoading(false);

      dispatch(
        loginSuccess({
          user: {
            id: `usr-${Date.now().toString().slice(-4)}`,
            name: values.fullName,
            email: values.email,
            role: "CUSTOMER",
            avatar:
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          },
          token: `mego-jwt-token-${Date.now()}`,
        })
      );

      toast.success(
        `Chúc mừng ${values.fullName}! Bạn đã gia nhập MeGo Club thành công và nhận ngay 500 MeGo Points.`,
        {
          position: "top-right",
          autoClose: 4000,
        }
      );

      // Navigate back to the intended booking / protected route
      navigate(safeRedirect, { replace: true });
    }, 800);
  };

  // Social OAuth click handler
  const handleSocialClick = (provider: "google" | "facebook" | "apple") => {
    const providerNames = {
      google: "Google OAuth 2.0",
      facebook: "Facebook Login",
      apple: "Apple ID",
    };
    toast.info(
      `Cổng đăng ký nhanh qua ${providerNames[provider]} đang được kết nối với hệ thống backend. Vui lòng hoàn tất biểu mẫu đăng ký tiêu chuẩn.`,
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