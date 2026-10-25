import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";
import CloudDoneOutlined from "@mui/icons-material/CloudDoneOutlined";
import GppGoodOutlined from "@mui/icons-material/GppGoodOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import { loginSuccess } from "../../../stores/authSlice";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import PartnerLoginForm from "../components/login/PartnerLoginForm";
import PartnerLoginHero from "../components/login/PartnerLoginHero";
import PartnerPublicShell from "../components/public/PartnerPublicShell";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF } from "../data/partnerMock";
import partnerApi, { type PartnerLoginInput } from "../services/partnerApi";

const PARTNER_HOME = "/partner";

/** Chỉ chấp nhận redirect nội bộ trong cổng đối tác để tránh open redirect. */
const getSafeRedirect = (raw: string | null): string =>
  raw && raw.startsWith(PARTNER_HOME) && !raw.startsWith("//") && !raw.startsWith(`${PARTNER_HOME}/login`) ? raw : PARTNER_HOME;

const TRUST_BADGES = [
  { icon: VerifiedUserOutlined, label: "PCI-DSS Compliant" },
  { icon: CloudDoneOutlined, label: "Uptime 99,99%" },
  { icon: GppGoodOutlined, label: "GDPR & PDPA Protected" },
];

export const PartnerLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));

  useEffect(() => {
    document.title = "Đăng nhập Cổng Quản trị Đối tác | MeGo Partner";
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "PARTNER") navigate(redirectTo, { replace: true });
  }, [isAuthenticated, user?.role, navigate, redirectTo]);

  const handleSubmit = async (values: PartnerLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { account, token } = await partnerApi.login(values);
      dispatch(loginSuccess({ user: { id: account.id, name: account.fullName, email: account.email, role: "PARTNER" }, token }));
      toast.success(`Chào mừng ${account.fullName} quay lại cổng đối tác MeGo.`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnavailableAction = (feature: string) => {
    toast.info(`${feature} đang được kết nối với hệ thống. Vui lòng liên hệ hotline ${PARTNER_HOTLINE} nếu cần hỗ trợ ngay.`);
  };

  return (
    <PartnerPublicShell
      headerAction={
        <Link to="/partner/register/status" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#1677FF] hover:bg-blue-50">
          <AssignmentTurnedInOutlined sx={{ fontSize: 18 }} />
          <span className="hidden sm:inline">Theo dõi hồ sơ đã nộp</span>
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="tracking-wider text-slate-700">HOSPITALITY CLOUD</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#1677FF]">Cổng Đối Tác Chính Thức</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-semibold text-cyan-800">
            <VerifiedOutlined sx={{ fontSize: 15 }} /> Đã xác minh
          </span>
        </div>
        <a href={PARTNER_HOTLINE_HREF} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#1677FF]">
          <HeadsetMicOutlined sx={{ fontSize: 18 }} className="text-[#1677FF]" />
          Hotline B2B: <strong className="text-[#1677FF]">{PARTNER_HOTLINE}</strong>
          <span className="text-xs text-slate-400">(24/7 miễn phí)</span>
        </a>
      </div>

      <div className="grid overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-xl lg:grid-cols-[1.15fr_1fr]">
        <div className="hidden p-3 lg:block">
          <PartnerLoginHero />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <PartnerLoginForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            onUnavailableAction={handleUnavailableAction}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon sx={{ fontSize: 16 }} className="text-[#1677FF]" /> {label}
            </li>
          ))}
        </ul>
        <Link to="/support" className="hover:text-[#1677FF]">Trung tâm Trợ giúp</Link>
      </div>
    </PartnerPublicShell>
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
