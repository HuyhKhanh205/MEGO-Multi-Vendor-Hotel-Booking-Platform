import { useEffect, type ReactNode } from "react";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

interface OverlayProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** "modal": hộp giữa màn hình; "drawer": ngăn trượt từ phải */
  variant?: "modal" | "drawer";
  widthClass?: string;
}

/** Modal / drawer dùng chung: đóng bằng Esc hoặc bấm nền; nội dung cuộn được, header & footer cố định. */
export const Overlay = ({ open, title, subtitle, onClose, children, footer, variant = "modal", widthClass = "max-w-2xl" }: OverlayProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClass =
    variant === "drawer"
      ? `ml-auto flex h-full w-full ${widthClass} flex-col bg-white shadow-2xl`
      : `m-auto flex max-h-[calc(100vh-2rem)] w-full ${widthClass} flex-col rounded-3xl bg-white shadow-2xl`;

  return (
    <div className="fixed inset-0 z-[60] flex bg-slate-900/50 p-0 sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`${panelClass} ${variant === "drawer" ? "sm:-my-4 sm:-mr-4" : ""}`}>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Đóng">
            <CloseOutlined fontSize="small" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="shrink-0 border-t border-slate-100 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
};

export default Overlay;
