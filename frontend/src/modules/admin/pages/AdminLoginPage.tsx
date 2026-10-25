import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "../../../components/common/Icons";
import { LoginForm } from "../../guest/components/login";
import { useAppSelector } from "../../../stores/store";

export const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Nếu đã đăng nhập đúng role ADMIN thì tự chuyển về dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate]);

  useEffect(() => {
    document.title = t("auth.adminLogin.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-[#F4F6FC] to-blue-50/70 py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Ambient Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[490px] bg-white/95 backdrop-blur-xl rounded-[32px] border border-slate-200/80 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)] overflow-hidden">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1677FF] via-blue-600 to-indigo-600" />

        <div className="p-6 sm:p-10 lg:p-11">
          {/* ── Admin Portal Badge ── */}
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-slate-900 text-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("auth.adminLogin.badge")}</span>
            </span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1677FF] to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                M
              </div>
              <span className="text-base font-black tracking-tight">
                <span className="text-[#1677FF]">Me</span>
                <span className="text-slate-900">Go</span>
              </span>
            </div>
          </div>

          {/* ── Shared 2-Step LoginForm (Chỉ Email + Mật khẩu, không đăng ký, không MXH) ── */}
          <LoginForm
            title={t("auth.adminLogin.title")}
            subtitle={t("auth.adminLogin.subtitle")}
            allowedRole="ADMIN"
            redirectTo="/admin/dashboard"
            showRegisterLink={false}
            showForgotPassword={false}
            showSocialLogin={false}
            showRememberMe={false}
          />

          {/* ── Back to Home Link ── */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#1677FF] transition-colors"
            >
              {t("auth.adminLogin.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
