import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginHero, LoginForm } from "../components/login";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";

export const LoginPage: React.FC = () => {
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
    document.title = "Đăng nhập tài khoản | MeGo Khách sạn & Resort";
    window.scrollTo(0, 0);
  }, []);

  // Form submit handler
  const handleLoginSubmit = async (values: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate backend API call (Ghi chú: kết nối endpoint Spring Boot /api/v1/auth/login)
    setTimeout(() => {
      setIsLoading(false);

      // Verify credentials (Demo test accounts)
      const isEmail = values.identifier.includes("@");
      const userName = isEmail
        ? values.identifier.split("@")[0].toUpperCase()
        : "Khách hàng MeGo";

      dispatch(
        loginSuccess({
          user: {
            id: `usr-${Date.now().toString().slice(-4)}`,
            name: `Nguyễn ${userName}`,
            email: isEmail ? values.identifier : `${values.identifier}@mego.vn`,
            role: "CUSTOMER",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          },
          token: `mego-jwt-token-${Date.now()}`,
        })
      );

      toast.success("Đăng nhập thành công! Chào mừng bạn quay trở lại MeGo.", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate back to the intended booking / protected route
      navigate(safeRedirect, { replace: true });
    }, 600);
  };

  // Quick 1-click login helper for seamless testing
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      dispatch(
        loginSuccess({
          user: {
            id: "usr-demo-01",
            name: "Trần Mai Anh",
            email: "maianh.tran@mego.vn",
            role: "CUSTOMER",
            avatar:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
          },
          token: "mego-jwt-token-demo-valid",
        })
      );

      toast.success("Đã đăng nhập thành công với tài khoản mẫu!", {
        position: "top-right",
      });

      navigate(safeRedirect, { replace: true });
    }, 300);
  };

  // Social OAuth click handler
  const handleSocialClick = (provider: "google" | "facebook" | "apple") => {
    const providerNames = {
      google: "Google OAuth 2.0",
      facebook: "Facebook Login",
      apple: "Apple ID",
    };
    toast.info(
      `Cổng đăng nhập qua ${providerNames[provider]} đang được kết nối với hệ thống backend. Vui lòng đăng nhập bằng Email/SĐT hoặc nút thử nghiệm.`,
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
            onQuickDemoLogin={handleQuickDemoLogin}
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