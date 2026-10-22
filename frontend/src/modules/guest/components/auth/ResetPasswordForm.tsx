import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  KeyRound,
} from "../../../../components/common/Icons";
import {
  PasswordStrengthIndicator,
} from "../register/PasswordStrengthIndicator";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResetPasswordFormProps {
  token: string;
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage?: string | null;
  isTokenValid: boolean;
  isTokenChecking: boolean;
  onSubmit: (values: { newPassword: string; confirmPassword: string }) => void;
  loginLink: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Mật khẩu phải chứa ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Mật khẩu phải có chữ hoa, chữ thường và số"
    )
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

// ─── Component ───────────────────────────────────────────────────────────────

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  isLoading,
  isSuccess,
  errorMessage,
  isTokenValid,
  isTokenChecking,
  onSubmit,
  loginLink,
}) => {
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
    },
  });

  // ── Token Checking ───────────────────────────────────────────────────────
  if (isTokenChecking) {
    return (
      <div className="text-center space-y-5">
        <div className="flex justify-center">
          <span className="w-12 h-12 border-4 border-[#1677FF] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-slate-500">
          Đang xác minh liên kết khôi phục mật khẩu...
        </p>
      </div>
    );
  }

  // ── Invalid / Expired Token ──────────────────────────────────────────────
  if (!isTokenValid) {
    return (
      <div className="text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Liên kết không hợp lệ
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            {errorMessage ||
              "Liên kết khôi phục mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại mã khôi phục."}
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Gửi lại mã khôi phục</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            to={loginLink}
            className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang Đăng nhập</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── Success State ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Mật khẩu đã được cập nhật!
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập
            bằng mật khẩu mới ngay bây giờ.
          </p>
        </div>

        <Link
          to={loginLink}
          className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Đăng nhập ngay</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // ── Form State ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
          <KeyRound className="w-7 h-7 text-[#1677FF]" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Đặt lại mật khẩu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Nhập mật khẩu mới cho tài khoản MeGo của bạn. Mật khẩu cần có ít nhất
          8 ký tự, bao gồm chữ hoa, chữ thường và số.
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="block text-xs font-bold text-slate-700"
          >
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập mật khẩu mới"
              className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl border bg-white outline-none transition-all ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {formik.errors.newPassword}
            </p>
          )}

          {/* Password Strength */}
          <PasswordStrengthIndicator password={formik.values.newPassword} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-slate-700"
          >
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
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
              placeholder="Nhập lại mật khẩu mới"
              className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl border bg-white outline-none transition-all ${
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:ring-2 focus:ring-blue-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={
                showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-semibold mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group mt-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang cập nhật...</span>
            </div>
          ) : (
            <>
              <span>Cập nhật mật khẩu</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Back to login */}
      <div className="text-center pt-1">
        <Link
          to={loginLink}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang Đăng nhập</span>
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
