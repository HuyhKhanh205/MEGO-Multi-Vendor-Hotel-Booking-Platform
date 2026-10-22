import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "../../../../components/common/Icons";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { SocialLoginButtons } from "../login/SocialLoginButtons";

export interface RegisterFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormProps {
  isLoading: boolean;
  errorMessage?: string | null;
  onSubmit: (values: RegisterFormValues) => void;
  onSocialClick: (provider: "google" | "facebook" | "apple") => void;
  loginLink?: string;
}

// Regex for email and Vietnamese phone number
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const vnPhoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required("Vui lòng nhập họ và tên của bạn")
    .min(2, "Họ và tên tối thiểu 2 ký tự")
    .test("not-only-spaces", "Họ và tên không được chỉ chứa khoảng trắng", (val) =>
      Boolean(val && val.trim().length > 0)
    ),
  email: Yup.string()
    .trim()
    .required("Vui lòng nhập địa chỉ email")
    .matches(emailRegex, "Định dạng email không hợp lệ (ví dụ: name@example.com)"),
  phoneNumber: Yup.string()
    .trim()
    .required("Vui lòng nhập số điện thoại liên hệ")
    .test("is-vn-phone", "Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 03, 05, 07, 08, 09)", (val) => {
      if (!val) return false;
      const clean = val.replace(/\s+/g, "");
      return vnPhoneRegex.test(clean);
    }),
  password: Yup.string()
    .required("Vui lòng tạo mật khẩu cho tài khoản")
    .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận lại mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không trùng khớp"),
  agreeTerms: Yup.boolean().oneOf(
    [true],
    "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật"
  ),
});

export const RegisterForm: React.FC<RegisterFormProps> = ({
  isLoading,
  errorMessage,
  onSubmit,
  onSocialClick,
  loginLink = "/login",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        phoneNumber: values.phoneNumber.trim().replace(/\s+/g, ""),
      });
    },
  });

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* ── Title & Header ── */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] ring-4 ring-blue-100" />
          <span className="text-[11px] font-extrabold text-[#1677FF] uppercase tracking-wider">
            Khách hàng mới
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Tạo tài khoản MeGo
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Trải nghiệm đặt phòng với giá ưu đãi nhất thị trường
        </p>
      </div>

      {/* ── Error Banner ── */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <span className="font-bold shrink-0">⚠️ Lỗi:</span>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={formik.handleSubmit} className="space-y-3.5" noValidate>
        {/* Field 1: Full Name */}
        <div className="space-y-1">
          <label
            htmlFor="fullName"
            className="block text-xs font-bold text-slate-700"
          >
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nguyễn Văn A"
              className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">
              {formik.errors.fullName}
            </p>
          )}
        </div>

        {/* Field 2: Email & Phone Number (2 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700"
            >
              Địa chỉ Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] text-red-500 font-semibold mt-0.5">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label
              htmlFor="phoneNumber"
              className="block text-xs font-bold text-slate-700"
            >
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0912 345 678"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                    : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
                }`}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-[11px] text-red-500 font-semibold mt-0.5">
                {formik.errors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Field 3: Password + Strength Indicator */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-700"
          >
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập ít nhất 8 ký tự"
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 4-segment Strength Indicator */}
          <PasswordStrengthIndicator password={formik.values.password} />

          {formik.touched.password && formik.errors.password && (
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Field 4: Confirm Password */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-slate-700"
          >
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập lại mật khẩu vừa đặt"
              className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-[11px] text-red-500 font-semibold mt-0.5">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Field 5: Terms & Privacy Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formik.values.agreeTerms}
              onChange={formik.handleChange}
              className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-blue-400 cursor-pointer mt-0.5 shrink-0"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Tôi đồng ý với{" "}
              <Link
                to="/policies/terms-of-service"
                target="_blank"
                className="font-bold text-[#1677FF] hover:underline"
              >
                Điều khoản dịch vụ
              </Link>{" "}
              &{" "}
              <Link
                to="/policies/privacy-policy"
                target="_blank"
                className="font-bold text-[#1677FF] hover:underline"
              >
                Chính sách bảo mật
              </Link>{" "}
              của MeGo.
            </span>
          </label>
          {formik.touched.agreeTerms && formik.errors.agreeTerms && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {formik.errors.agreeTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group mt-3"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang khởi tạo tài khoản...</span>
            </div>
          ) : (
            <>
              <span>Tạo tài khoản</span>
            </>
          )}
        </button>
      </form>

      {/* ── Social Register Buttons ── */}
      <SocialLoginButtons onSocialClick={onSocialClick} />

      {/* ── Back to Login Link ── */}
      <div className="pt-1 text-center text-xs text-slate-500">
        Đã có tài khoản MeGo?{" "}
        <Link
          to={loginLink}
          className="font-extrabold text-[#1677FF] hover:underline hover:text-blue-700 transition-colors"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;