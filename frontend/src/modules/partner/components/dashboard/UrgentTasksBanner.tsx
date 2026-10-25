import CloseOutlined from "@mui/icons-material/CloseOutlined";
import NotificationImportantOutlined from "@mui/icons-material/NotificationImportantOutlined";
import type { UrgentTask } from "../../types/partner.types";

interface UrgentTasksBannerProps {
  tasks: UrgentTask[];
  onReview: () => void;
  onDismiss: () => void;
}

export const UrgentTasksBanner = ({ tasks, onReview, onDismiss }: UrgentTasksBannerProps) => {
  const total = tasks.reduce((sum, task) => sum + task.count, 0);
  if (total === 0) return null;

  return (
    <section role="status" className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:flex-row sm:items-center">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
        <NotificationImportantOutlined sx={{ fontSize: 22 }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
          Cần xử lý gấp trong ca sáng
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">{total} yêu cầu</span>
        </p>
        <p className="mt-0.5 text-sm text-slate-600">{tasks.map((task) => `${task.count} ${task.label}`).join(" • ")}</p>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onReview} className="whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm hover:bg-teal-50">
          Duyệt check-in sớm
        </button>
        <button type="button" onClick={onDismiss} className="rounded-lg p-1.5 text-slate-500 hover:bg-white" aria-label="Ẩn thông báo cần xử lý">
          <CloseOutlined fontSize="small" />
        </button>
      </div>
    </section>
  );
};

export default UrgentTasksBanner;
