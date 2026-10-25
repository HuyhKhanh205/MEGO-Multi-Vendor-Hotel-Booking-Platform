/** Class cho input/select trong form onboarding, có biến thể báo lỗi. */
export const inputClassName = (hasError: boolean, withIcon = true) =>
  `w-full rounded-xl border py-2.5 pr-3 text-sm outline-none transition-all ${withIcon ? "pl-10" : "pl-3"} ${
    hasError
      ? "border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 bg-slate-50/60 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
  }`;

export const formatFileSize = (bytes: number): string =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
