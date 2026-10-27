import type { ReactNode } from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import { useField } from "formik";
import { inputClassName } from "./formStyles";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}

/** Nhãn + nội dung + gợi ý/lỗi cho một trường form. */
export const FieldShell = ({ id, label, required, hint, error, children }: FieldShellProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

interface TextFieldProps {
  name: string;
  label: string;
  icon?: SvgIconComponent;
  required?: boolean;
  placeholder?: string;
  hint?: ReactNode;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  trailing?: ReactNode;
  /** Tiền tố id của input (mặc định "onboarding") để không trùng id giữa các form */
  idPrefix?: string;
  step?: string;
}

/** Ô nhập liệu gắn với Formik (dùng trong <Formik>). */
export const TextField = ({ name, label, icon: Icon, required, placeholder, hint, type = "text", inputMode, autoComplete, trailing, idPrefix = "onboarding", step }: TextFieldProps) => {
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;
  const id = `${idPrefix}-${name}`;

  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div className="relative">
        {Icon && <Icon sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          {...field}
          id={id}
          type={type}
          step={step}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`${inputClassName(!!error, !!Icon)} ${trailing ? "pr-11" : ""}`}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{trailing}</div>}
      </div>
    </FieldShell>
  );
};
