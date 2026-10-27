import React, { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  Check,
  ShieldCheck,
} from "../../../../components/common/Icons";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { useAppDispatch } from "../../../../stores/store";
import { loginSuccess } from "../../../../stores/authSlice";
import {
  AuthService,
  AuthApiError,
  getPostLoginPath,
  normalizeApprovalStatus,
  type BackendRole,
} from "../../../../services/auth.service";

const PARTNER_APPLICATION_STATUS_PATH = "/partner/register/status";

export interface LoginFormProps {
  /** Tiêu đề form (mặc định dùng i18n của trang đăng nhập) */
  title?: string;
  /** Phụ đề mô tả dưới tiêu đề */
  subtitle?: string;
  /** Role được phép đăng nhập ở cổng này (CUSTOMER | PARTNER | ADMIN) */
  allowedRole?: BackendRole | BackendRole[];
  /** Đường dẫn điều hướng khi đăng nhập thành công */
  redirectTo?: string;
  /** Hiển thị link đăng ký tài khoản ở chân form */
  showRegisterLink?: boolean;
  /** Đường dẫn trang đăng ký */
  registerLink?: string;
  /** Câu dẫn trước link đăng ký */
  registerPromptText?: string;
  /** Nhãn hiển thị của link đăng ký */
  registerLinkText?: string;
  /** Hiển thị link Quên mật khẩu */
  showForgotPassword?: boolean;
  /** Đường dẫn trang Quên mật khẩu */
  forgotPasswordLink?: string;
  /** Hiển thị các nút đăng nhập mạng xã hội */
  showSocialLogin?: boolean;
  /** Hiển thị tuỳ chọn Ghi nhớ đăng nhập */
  showRememberMe?: boolean;

  /** Các props truyền từ LoginPage (Customer) hiện có */
  initialEmailOrPhone?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  onSubmit?: (values: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onSocialClick?: (provider: "google" | "facebook" | "apple") => void;
  onQuickDemoLogin?: () => void;
}

// Backend /api/auth/login chỉ hỗ trợ đăng nhập bằng email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginForm: React.FC<LoginFormProps> = ({
  title,
  subtitle,
  allowedRole,
  redirectTo,
  showRegisterLink = true,
  registerLink = "/register",
  registerPromptText,
  registerLinkText,
  showForgotPassword = true,
  forgotPasswordLink = "/forgot-password",
  showSocialLogin,
  showRememberMe = true,
  initialEmailOrPhone = "",
  isLoading: externalLoading,
  errorMessage: externalError,
  onSubmit,
  onSocialClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [dismissExternalError, setDismissExternalError] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const isLoading = externalLoading ?? internalLoading;
  const errorMessage =
    externalError !== undefined
      ? dismissExternalError
        ? null
        : externalError
      : internalError;

  // Mặc định hiển thị social login nếu truyền onSocialClick (tương thích trang Customer)
  const shouldShowSocialLogin = showSocialLogin ?? Boolean(onSocialClick);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        identifier: Yup.string()
          .trim()
          .required(t("auth.login.validation.emailRequired"))
          .matches(emailRegex, t("auth.login.validation.emailInvalid")),
        password: Yup.string().required(
          t("auth.login.validation.passwordRequired")
        ),
        rememberMe: Yup.boolean(),
      }),
    [t]
  );

  const handleInternalLogin = async (values: {
    identifier: string;
    password: string;
    rememberMe: boolean;
  }) => {
    setInternalLoading(true);
    setInternalError(null);

    const email = values.identifier.trim().toLowerCase();
    const allowedRoles = allowedRole
      ? Array.isArray(allowedRole)
        ? allowedRole
        : [allowedRole]
      : null;
    const isPartnerPortal = Boolean(allowedRoles?.includes("PARTNER"));

    try {
      const res = await AuthService.login({
        email,
        password: values.password,
      });

      // 1. Kiểm tra role trả về có khớp với cổng đăng nhập hiện tại không
      if (allowedRoles && !allowedRoles.includes(res.role)) {
        const invalidMsg = t("auth.login.errors.invalidCredentials");
        setInternalError(invalidMsg);
        toast.error(invalidMsg, { position: "top-right", autoClose: 3000 });
        return;
      }

      // 2. Với PARTNER: hồ sơ chưa được duyệt (PENDING / REJECTED / SUSPENDED) vẫn cho đăng nhập
      //    nhưng chỉ được vào trang Theo dõi hồ sơ; trang quản trị bị chặn bởi route guard.
      if (isPartnerPortal && res.role === "PARTNER") {
        const partnerStatus = normalizeApprovalStatus(res);
        if (partnerStatus !== "APPROVED") {
          const statusMsg =
            partnerStatus === "PENDING"
              ? t("auth.login.errors.partnerPending")
              : partnerStatus === "REJECTED"
                ? t("auth.login.errors.partnerRejected")
                : "Hồ sơ đối tác chưa được kích hoạt. Vui lòng xem chi tiết trạng thái hồ sơ.";
          toast.info(statusMsg, { position: "top-right", autoClose: 4000 });
          dispatch(loginSuccess({ user: AuthService.toAuthUser(res), token: res.jwt }));
          navigate(PARTNER_APPLICATION_STATUS_PATH, { replace: true });
          return;
        }
      }

      // 3. Thành công: lưu thông tin vào Redux + localStorage và chuyển hướng
      toast.success(res.message || t("auth.login.success"), {
        position: "top-right",
        autoClose: 3000,
      });

      dispatch(
        loginSuccess({
          user: AuthService.toAuthUser(res),
          token: res.jwt,
        })
      );

      navigate(redirectTo || getPostLoginPath(res.role), { replace: true });
    } catch (err) {
      const rawMessage =
        err instanceof Error
          ? err.message
          : t("auth.login.errors.loginFailed");
      const lowerMsg = rawMessage.toLowerCase();

      // Hỗ trợ trường hợp backend trả lỗi 403 cho Partner PENDING / REJECTED
      if (isPartnerPortal) {
        if (lowerMsg.includes("pending") || lowerMsg.includes("chờ duyệt")) {
          const pendingMsg = t("auth.login.errors.partnerPending");
          setInternalError(pendingMsg);
          toast.error(pendingMsg, { position: "top-right", autoClose: 3000 });
          return;
        }
        if (lowerMsg.includes("rejected") || lowerMsg.includes("từ chối")) {
          const rejectedMsg = t("auth.login.errors.partnerRejected");
          setInternalError(rejectedMsg);
          toast.error(rejectedMsg, { position: "top-right", autoClose: 3000 });
          return;
        }
      }

      // Chuẩn hóa thông báo sai tài khoản / mật khẩu để không tiết lộ tài khoản tồn tại
      const isCredentialError =
        (err instanceof AuthApiError &&
          (err.status === 400 || err.status === 401)) ||
        lowerMsg.includes("không đúng") ||
        lowerMsg.includes("bad credentials") ||
        lowerMsg.includes("invalid");

      const displayMessage = isCredentialError
        ? t("auth.login.errors.invalidCredentials")
        : rawMessage;

      setInternalError(displayMessage);
      toast.error(displayMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setInternalLoading(false);
    }
  };

  const handleDefaultSocialClick = (
    provider: "google" | "facebook" | "apple"
  ) => {
    if (onSocialClick) {
      onSocialClick(provider);
      return;
    }
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

  const formik = useFormik({
    initialValues: {
      identifier: initialEmailOrPhone,
      password: "",
      rememberMe: true,
    },
    validationSchema,
    onSubmit: (values) => {
      setDismissExternalError(false);
      const payload = {
        identifier: values.identifier.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      };
      if (onSubmit) {
        onSubmit(payload);
      } else {
        void handleInternalLogin(payload);
      }
    },
  });

  // Xử lý chuyển từ Cấp 1 (nhập Email) sang Cấp 2 (nhập Mật khẩu)
  const handleProceedToStep2 = async () => {
    await formik.setFieldTouched("identifier", true, true);
    const errors = await formik.validateForm();
    if (errors.identifier) {
      return;
    }
    setInternalError(null);
    setDismissExternalError(true);
    setStep(2);
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 80);
  };

  // Quay lại Cấp 1 để đổi email
  const handleBackToStep1 = () => {
    setInternalError(null);
    setDismissExternalError(true);
    formik.setFieldTouched("password", false, false);
    setStep(1);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      void handleProceedToStep2();
    } else {
      formik.handleSubmit(e);
    }
  };

  const avatarInitial =
    formik.values.identifier.trim().charAt(0).toUpperCase() || "M";

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* ── Thanh cấp bậc 2 bước phía trên đầu (2-Step Progress Header) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#1677FF] border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
            {step === 1
              ? t("auth.login.step1Badge")
              : t("auth.login.step2Badge")}
          </span>
          <span className="text-slate-500 font-semibold">
            {step === 1
              ? t("auth.login.step1Title")
              : t("auth.login.step2Title")}
          </span>
        </div>

        {/* 2 Thanh tiến trình (2 Level Bars) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Thanh Cấp 1: Tài khoản */}
          <button
            type="button"
            onClick={() => {
              if (step === 2) handleBackToStep1();
            }}
            disabled={step === 1 || isLoading}
            className={`group text-left space-y-1.5 focus:outline-none ${
              step === 2 ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden p-[1px]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  step === 1
                    ? "w-full bg-gradient-to-r from-[#1677FF] via-blue-500 to-indigo-600 shadow-xs shadow-blue-500/40"
                    : "w-full bg-emerald-500"
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-colors ${
                  step === 1
                    ? "bg-[#1677FF] text-white"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {step === 2 ? <Check className="w-2.5 h-2.5" /> : "1"}
              </span>
              <span
                className={`font-bold truncate transition-colors ${
                  step === 1
                    ? "text-slate-900"
                    : "text-emerald-600 group-hover:underline"
                }`}
              >
                {t("auth.login.step1Title")}
              </span>
            </div>
          </button>

          {/* Thanh Cấp 2: Mật khẩu */}
          <div className="space-y-1.5 select-none">
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden p-[1px]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  step === 2
                    ? "w-full bg-gradient-to-r from-[#1677FF] via-blue-500 to-indigo-600 shadow-xs shadow-blue-500/40"
                    : "w-0 bg-transparent"
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-colors ${
                  step === 2
                    ? "bg-[#1677FF] text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </span>
              <span
                className={`font-bold truncate transition-colors ${
                  step === 2 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {t("auth.login.step2Title")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Title & Header ── */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {title ?? t("auth.login.title")}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {step === 2
            ? t("auth.login.step2Subtitle")
            : (subtitle ?? t("auth.login.subtitle"))}
        </p>
      </div>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
          <span className="font-bold shrink-0">
            {t("auth.login.errorPrefix")}
          </span>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* ── Form 2 Cấp ── */}
      <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
        {step === 1 ? (
          /* ══════════════════════════════════════════════════════════════════
             CẤP 1: NHẬP ĐỊA CHỈ EMAIL / TÀI KHOẢN
             ══════════════════════════════════════════════════════════════════ */
          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-bold text-slate-700"
              >
                {t("auth.login.emailLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1677FF] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  value={formik.values.identifier}
                  onChange={(e) => {
                    formik.handleChange(e);
                    if (internalError) setInternalError(null);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth.login.emailPlaceholder")}
                  className={`w-full pl-11 pr-4 py-3.5 text-sm font-medium rounded-2xl border bg-slate-50/70 outline-none transition-all ${
                    formik.touched.identifier && formik.errors.identifier
                      ? "border-red-400 bg-red-50/30 text-red-900 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200/90 hover:border-slate-300 focus:border-[#1677FF] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
              </div>
              {formik.touched.identifier && formik.errors.identifier && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">
                  {formik.errors.identifier}
                </p>
              )}
            </div>

            {/* Nút Tiếp tục qua Cấp 2 */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#1677FF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t("auth.login.continueBtn")}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════
             CẤP 2: XÁC THỰC MẬT KHẨU
             ══════════════════════════════════════════════════════════════════ */
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            {/* Thẻ hiển thị Tài khoản đã nhập ở Cấp 1 + Nút Đổi tài khoản */}
            <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1677FF] to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {avatarInitial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {formik.values.identifier}
                    </span>
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {t("auth.login.emailLabel")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackToStep1}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-[#1677FF] bg-blue-50 hover:bg-blue-100/80 transition-colors shrink-0 cursor-pointer"
              >
                {t("auth.login.changeAccount")}
              </button>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700"
              >
                {t("auth.login.passwordLabel")}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#1677FF] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  ref={passwordInputRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={t("auth.login.passwordPlaceholder")}
                  className={`w-full pl-11 pr-11 py-3.5 text-sm font-medium rounded-2xl border bg-slate-50/70 outline-none transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-400 bg-red-50/30 text-red-900 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200/90 hover:border-slate-300 focus:border-[#1677FF] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  }`}
                />
                {/* Show/Hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={
                    showPassword
                      ? t("auth.login.hidePassword")
                      : t("auth.login.showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-[11px] text-red-500 font-semibold mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Remember me & Forgot Password */}
            {(showRememberMe || showForgotPassword) && (
              <div className="flex items-center justify-between pt-1 text-xs">
                {showRememberMe ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-blue-400 cursor-pointer"
                    />
                    <span className="font-medium text-slate-600">
                      {t("auth.login.rememberMe")}
                    </span>
                  </label>
                ) : (
                  <span />
                )}

                {showForgotPassword && (
                  <Link
                    to={forgotPasswordLink}
                    className="text-xs font-bold text-[#1677FF] hover:underline"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                )}
              </div>
            )}

            {/* Submit & Back Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#1677FF] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/25 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("auth.login.submitting")}</span>
                  </div>
                ) : (
                  <>
                    <span>{t("auth.login.submit")}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToStep1}
                disabled={isLoading}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("auth.login.backToStep1")}</span>
              </button>
            </div>
          </div>
        )}
      </form>

      {/* ── Social Login Section ── */}
      {shouldShowSocialLogin && (
        <SocialLoginButtons onSocialClick={handleDefaultSocialClick} />
      )}

      {/* ── Register Link ── */}
      {showRegisterLink && (
        <div className="pt-1 text-center text-xs text-slate-500">
          {registerPromptText ?? t("auth.login.noAccount")}{" "}
          <Link
            to={registerLink}
            className="font-extrabold text-[#1677FF] hover:underline hover:text-blue-700 transition-colors"
          >
            {registerLinkText ?? t("auth.login.registerNow")}
          </Link>
        </div>
      )}

      {/* ── Security Footer Note ── */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>{t("auth.login.securityNote")}</span>
      </div>
    </div>
  );
};

export default LoginForm;
