import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import KeyOutlined from "@mui/icons-material/KeyOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { PARTNER_DEMO_CREDENTIALS } from "../../data/partnerMock";
import type { PartnerLoginInput } from "../../services/partnerApi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const partnerCodeRegex = /^HTL-\d{4,}$/i;

const validationSchema = Yup.object({
  identifier: Yup.string()
    .trim()
    .required("Vui lòng nhập email công việc hoặc mã đối tác")
    .test("email-or-code", "Nhập email hợp lệ hoặc mã đối tác dạng HTL-1234", (value) => !!value && (emailRegex.test(value) || partnerCodeRegex.test(value))),
  password: Yup.string().required("Vui lòng nhập mật khẩu quản trị").min(8, "Mật khẩu quản trị có ít nhất 8 ký tự"),
  rememberMe: Yup.boolean(),
});

interface PartnerLoginFormProps {
  isLoading: boolean;
  errorMessage: string | null;
  onSubmit: (values: PartnerLoginInput) => void;
  onUnavailableAction: (feature: string) => void;
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border py-3 pl-11 text-sm outline-none transition-all ${
    hasError
      ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 bg-slate-50/60 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
  }`;

export const PartnerLoginForm = ({ isLoading, errorMessage, onSubmit, onUnavailableAction }: PartnerLoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik<PartnerLoginInput>({
    initialValues: { identifier: "", password: "", rememberMe: true },
    validationSchema,
    onSubmit: (values) => onSubmit({ ...values, identifier: values.identifier.trim() }),
  });

  const identifierError = formik.touched.identifier ? formik.errors.identifier : undefined;
  const passwordError = formik.touched.password ? formik.errors.password : undefined;

  const fillDemoAccount = () => {
    void formik.setValues({ ...formik.values, ...PARTNER_DEMO_CREDENTIALS });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">Đăng nhập Cổng Quản lý Đối tác</h1>

      {errorMessage && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
          <ErrorOutlineOutlined sx={{ fontSize: 18 }} className="mt-0.5 shrink-0" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="partner-identifier" className="block text-sm font-semibold text-slate-700">
            Email công việc / Tên tài khoản <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BadgeOutlined sx={{ fontSize: 19 }} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="partner-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={formik.values.identifier}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="partner@hotelbrand.com hoặc mã đối tác"
              aria-invalid={!!identifierError}
              className={`${inputClass(!!identifierError)} pr-4`}
            />
          </div>
          {identifierError && <p className="text-xs font-semibold text-red-500">{identifierError}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="partner-password" className="block text-sm font-semibold text-slate-700">
              Mật khẩu quản trị <span className="text-red-500">*</span>
            </label>
            <button type="button" onClick={() => onUnavailableAction("Khôi phục mật khẩu đối tác")} className="text-sm font-semibold text-[#1677FF] hover:underline">
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <KeyOutlined sx={{ fontSize: 19 }} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="partner-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nhập mật khẩu quản trị của bạn"
              aria-invalid={!!passwordError}
              className={`${inputClass(!!passwordError)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 19 }} /> : <VisibilityOutlined sx={{ fontSize: 19 }} />}
            </button>
          </div>
          {passwordError && <p className="text-xs font-semibold text-red-500">{passwordError}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer select-none items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#1677FF]"
            />
            Ghi nhớ phiên đăng nhập (30 ngày)
          </label>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> PMS Gateway
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#004CCD] text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-[#003db3] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang xác thực...
            </>
          ) : (
            <>
              Đăng nhập Portal <ArrowForwardOutlined sx={{ fontSize: 19 }} />
            </>
          )}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> Hoặc truy cập bảo mật qua <span className="h-px flex-1 bg-slate-200" />
        </div>
        <button
          type="button"
          onClick={() => onUnavailableAction("Đăng nhập qua Google Workspace")}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-blue-50 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-100"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8Z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
          </svg>
          Đăng nhập qua Google Workspace Doanh nghiệp
        </button>
      </div>

      <div className="space-y-1 border-t border-slate-100 pt-5 text-center text-sm">
        <p className="text-slate-500">Chưa có tài khoản đối tác lưu trú?</p>
        <Link to="/partner/register" className="inline-flex items-center gap-1 text-base font-bold text-[#004CCD] hover:underline">
          Đăng ký hợp tác ngay <ArrowForwardOutlined sx={{ fontSize: 16 }} />
        </Link>
      </div>

      {import.meta.env.DEV && (
        <button type="button" onClick={fillDemoAccount} className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:border-[#1677FF] hover:text-[#1677FF]">
          Dùng tài khoản demo (chỉ hiện ở môi trường dev)
        </button>
      )}
    </div>
  );
};

export default PartnerLoginForm;
