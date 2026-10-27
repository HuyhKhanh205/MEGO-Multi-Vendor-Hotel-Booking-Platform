import type { ReactNode } from "react";
import { useField } from "formik";
import { FieldShell } from "../onboarding/FormField";
import { inputClassName } from "../onboarding/formStyles";

interface BaseProps {
  name: string;
  label: string;
  idPrefix: string;
  required?: boolean;
  hint?: ReactNode;
}

export const TextAreaField = ({ name, label, idPrefix, required, hint, rows = 3, placeholder }: BaseProps & { rows?: number; placeholder?: string }) => {
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;
  const id = `${idPrefix}-${name}`;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea {...field} id={id} rows={rows} placeholder={placeholder} aria-invalid={!!error} className={`${inputClassName(!!error, false)} resize-y leading-relaxed`} />
    </FieldShell>
  );
};

export const SelectField = ({ name, label, idPrefix, required, hint, options, placeholder }: BaseProps & { options: Array<{ value: string; label: string }>; placeholder?: string }) => {
  const [field, meta] = useField<string>(name);
  const error = meta.touched ? meta.error : undefined;
  const id = `${idPrefix}-${name}`;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <select {...field} id={id} aria-invalid={!!error} className={inputClassName(!!error, false)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </FieldShell>
  );
};

/** Công tắc bật/tắt cho trường boolean của Formik. */
export const ToggleField = ({ name, label, description }: { name: string; label: string; description?: string }) => {
  const [field, , helpers] = useField<boolean>(name);
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4 hover:border-blue-300">
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={field.value}
          onChange={(event) => { void helpers.setValue(event.target.checked); }}
          className="peer sr-only"
        />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-[#1677FF] peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
};
