import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Mail,
  KeyRound,
  ArrowLeft,
  ChevronRight,
  Info,
} from "../../../../components/common/Icons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ForgotPasswordFormProps {
  isLoading: boolean;
  isSubmitted: boolean;
  errorMessage?: string | null;
  onSubmit: (email: string) => void;
  loginLink: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Vui lòng nhập địa chỉ email của bạn")
    .email("Vui lòng nhập định dạng email hợp lệ (ví dụ: name@mego.vn)"),
});

// ─── Component ───────────────────────────────────────────────────────────────

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isLoading,
  isSubmitted,
  errorMessage,
  onSubmit,
  loginLink,
}) => {
  const [submittedEmail, setSubmittedEmail] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: (values) => {
      setSubmittedEmail(values.email.trim());
      onSubmit(values.email.trim());
    },
  });

  // ─── Success State ───────────────────────────────────────────────────────
  if (isSubmitted && !errorMessage) {
    return (
      <div className="text-center space-y-5">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Mail className="w-7 h-7 text-emerald-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">
            Kiểm tra hộp thư của bạn
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Nếu email{" "}
            <span className="font-semibold text-slate-700">
              {submittedEmail}
            </span>{" "}
            được đăng ký với MeGo, bạn sẽ nhận được hướng dẫn khôi phục mật
            khẩu trong vài phút tới.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#1677FF] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <p>
                Không nhận được email? Hãy kiểm tra thư mục{" "}
                <span className="font-semibold">Spam</span> hoặc{" "}
                <span className="font-semibold">Quảng cáo</span>.
              </p>
              <p>
                Email có thể mất vài phút để đến hộp thư của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setSubmittedEmail("");
              onSubmit("__reset__");
            }}
            className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
          >
            Gửi lại yêu cầu
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

  // ─── Form State ──────────────────────────────────────────────────────────
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
          Quên mật khẩu?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Nhập email đã đăng ký với tài khoản MeGo của bạn. Chúng tôi sẽ gửi mã
          khôi phục để đặt lại mật khẩu ngay lập tức.
        </p>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <span className="font-bold shrink-0">Lỗi:</span>
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-700"
          >
            Địa chỉ Email đã đăng ký{" "}
            <span className="text-red-500">*</span>
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
              placeholder="customer@mego.vn"
              className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border bg-white outline-none transition-all ${
                formik.touched.email && formik.errors.email
                  ? "border-red-400 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-200"
                  : "border-slate-200 focus:border-[#1677FF] focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {formik.errors.email}
            </p>
          ) : (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-[11px] text-slate-400">
                Đảm bảo bạn vẫn có quyền truy cập vào hộp thư này
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang gửi yêu cầu...</span>
            </div>
          ) : (
            <>
              <span>Gửi mã khôi phục</span>
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

export default ForgotPasswordForm;
