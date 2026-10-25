import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  Award,
} from "../../../components/common/Icons";
import { LoginForm } from "../../guest/components/login";
import { useAppSelector } from "../../../stores/store";

export const PartnerLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Nếu đã đăng nhập đúng role PARTNER thì tự chuyển về dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "PARTNER") {
      navigate("/partner/dashboard", { replace: true });
    }
  }, [isAuthenticated, user?.role, navigate]);

  useEffect(() => {
    document.title = t("auth.partnerLogin.pageTitle");
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F4F6FC] to-[#E0EAFF] py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Ambient Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-[1240px] bg-white/95 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] items-stretch">
        {/* ── Cột trái (~53%): Partner Hero Banner ── */}
        <div className="hidden lg:block p-3.5">
          <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] rounded-3xl overflow-hidden flex flex-col justify-between p-7 sm:p-9 lg:p-10 select-none">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85"
              alt="MeGo Partner Portal"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/40" />

            {/* ── Top Badges ── */}
            <div className="relative z-10 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{t("auth.partnerLogin.hero.badgeTopLeft")}</span>
              </span>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-sm">
                {t("auth.partnerLogin.hero.badgeTopRight")}
              </span>
            </div>

            {/* ── Middle Narrative & Benefits ── */}
            <div className="relative z-10 space-y-4 my-auto py-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-[#1677FF]/80 backdrop-blur-md text-white border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t("auth.partnerLogin.hero.tag")}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                {t("auth.partnerLogin.hero.heading")}
              </h2>

              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-lg">
                {t("auth.partnerLogin.hero.description")}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t("auth.partnerLogin.hero.benefit1")}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
                  <Clock className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>{t("auth.partnerLogin.hero.benefit2")}</span>
                </div>
              </div>
            </div>

            {/* ── Bottom Floating Rating Card ── */}
            <div className="relative z-10 p-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-15 h-10 rounded-xl bg-[#1677FF]/40 border border-white/20 flex items-center justify-center font-black text-sm text-white shadow-md">
                  MeGo
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                    ))}
                    <span className="text-white text-xs font-extrabold ml-1">
                      4.9 / 5.0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5">
                    {t("auth.partnerLogin.hero.trustSubtitle")}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/80 text-white border border-emerald-400/30">
                {t("auth.partnerLogin.hero.verifiedBadge")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cột phải (~47%): Shared 2-Step LoginForm ── */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <LoginForm
            title={t("auth.partnerLogin.title")}
            subtitle={t("auth.partnerLogin.subtitle")}
            allowedRole="PARTNER"
            redirectTo="/partner/dashboard"
            showRegisterLink={true}
            registerLink="/partner/register"
            registerPromptText={t("auth.partnerLogin.noAccount")}
            registerLinkText={t("auth.partnerLogin.registerLinkText")}
            showForgotPassword={true}
            forgotPasswordLink="/forgot-password"
            showSocialLogin={false}
          />

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#1677FF] transition-colors"
            >
              {t("auth.partnerLogin.backToGuest")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginPage;
