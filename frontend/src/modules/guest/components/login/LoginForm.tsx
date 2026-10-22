import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
} from "../../../../components/common/Icons";
import { SocialLoginButtons } from "./SocialLoginButtons";

interface LoginFormProps {
  initialEmailOrPhone?: string;
  isLoading: boolean;
  errorMessage?: string | null;
  onSubmit: (values: { identifier: string; password: string; rememberMe: boolean }) => void;
  onSocialClick: (provider: "google" | "facebook" | "apple") => void;
  onQuickDemoLogin?: () => void;
  registerLink?: string;
}

// Regex validation for either email or VN phone number
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

const validationSchema = Yup.object({
  identifier: Yup.string()
    .required("Vui lòng nhập Email hoặc Số điện thoại")
    .test(
      "is-email-or-phone",
      "Vui lòng nhập định dạng email hoặc số điện thoại hợp lệ (10 số)",
      (value) => {
        if (!value) return false;
        const cleanVal = value.trim().replace(/\s+/g, "");
        return emailRegex.test(cleanVal) || phoneRegex.test(cleanVal);
      }
    ),
  password: Yup.string()
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu của bạn"),
  rememberMe: Yup.boolean(),
});

export const LoginForm: React.FC<LoginFormProps> = ({
  initialEmailOrPhone = "",
  isLoading,
  errorMessage,
  onSubmit,
  onSocialClick,
  onQuickDemoLogin,
  registerLink = "/register",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      identifier: initialEmailOrPhone || "khachhang@mego.vn",
      password: "password123",
      rememberMe: true,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        identifier: values.identifier.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
      });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* ── Title & Header ── */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Đăng nhập
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Đăng nhập để tiếp tục hành trình đặt phòng cùng MeGo
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
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        {/* Email or Phone field */}
        <div className="space-y-1.5">
          <label
            htmlFor="identifier"
            className="block text-xs font-bold text-slate-700"
          >
            Email hoặc Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={formik.values.identifier}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="name@example.com hoặc 0912 345 678"
              className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                formik.touched.identifier && formik.errors.identifier
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>
          {formik.touched.identifier && formik.errors.identifier && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {formik.errors.identifier}
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-700"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all ${
                formik.touched.password && formik.errors.password
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {/* Show/Hide password toggle */}
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
          {formik.touched.password && formik.errors.password && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              className="w-4 h-4 rounded border-slate-300 text-[#1677FF] focus:ring-blue-400 cursor-pointer"
            />
            <span className="font-medium text-slate-600">Ghi nhớ đăng nhập</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-bold text-[#1677FF] hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group mt-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang xác thực...</span>
            </div>
          ) : (
            <>
              <span>Đăng nhập ngay</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

      
      </form>

      {/* ── Social Login Section ── */}
      <SocialLoginButtons onSocialClick={onSocialClick} />

      {/* ── Register Link ── */}
      <div className="pt-2 text-center text-xs text-slate-500">
        Chưa có tài khoản MeGo?{" "}
        <Link
          to={registerLink}
          className="font-extrabold text-[#1677FF] hover:underline hover:text-blue-700 transition-colors"
        >
          Đăng ký thành viên ngay
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;