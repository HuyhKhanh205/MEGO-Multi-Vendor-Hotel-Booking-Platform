import type { SvgIconComponent } from "@mui/icons-material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import DrawOutlined from "@mui/icons-material/DrawOutlined";
import ManageSearchOutlined from "@mui/icons-material/ManageSearchOutlined";
import PriorityHighRounded from "@mui/icons-material/PriorityHighRounded";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { REVIEW_STEPS } from "../../data/onboardingMock";
import type { PartnerApplication } from "../../types/partner.types";
import { formatDate, formatTime } from "../../utils/formatters";
import { getLegalReviewPercent, getProgressPercent, getReviewStepStates, type ReviewStepState } from "./applicationProgress";

const STEP_ICONS: SvgIconComponent[] = [UploadFileOutlined, ManageSearchOutlined, DrawOutlined, RocketLaunchOutlined];

const STATE_BADGE: Record<ReviewStepState, { text: string; className: string }> = {
  done: { text: "Hoàn tất", className: "bg-emerald-50 text-emerald-700" },
  active: { text: "Đang thẩm định", className: "bg-teal-700 text-white" },
  attention: { text: "Cần bổ sung", className: "bg-amber-100 text-amber-800" },
  upcoming: { text: "Chưa bắt đầu", className: "bg-slate-100 dark:bg-white/10 text-slate-500" },
};

interface ReviewTimelineProps {
  application: PartnerApplication;
  checkedAt: string;
}

export const ReviewTimeline = ({ application, checkedAt }: ReviewTimelineProps) => {
  const states = getReviewStepStates(application.status);
  const progress = getProgressPercent(application.status);
  const legalPercent = getLegalReviewPercent(application, checkedAt);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Tiến độ quy trình thẩm định 4 bước</h2>
        <span className="whitespace-nowrap text-sm font-semibold text-[#1677FF]">{progress}% hoàn thành</span>
      </div>
      <ol className="mt-4">
        {REVIEW_STEPS.map((step, index) => {
          const state = states[index];
          const Icon = state === "done" ? CheckRounded : state === "attention" ? PriorityHighRounded : STEP_ICONS[index];
          const isLast = index === REVIEW_STEPS.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && <span className={`absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5 ${state === "done" ? "bg-[#1677FF]" : "bg-slate-200"}`} />}
              <span
                className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  state === "done" ? "bg-[#1677FF] text-white" : state === "active" ? "bg-teal-700 text-white ring-4 ring-teal-100" : state === "attention" ? "bg-amber-500 text-white ring-4 ring-amber-100" : "bg-slate-100 dark:bg-white/10 text-slate-400"
                }`}
              >
                <Icon sx={{ fontSize: 19 }} />
              </span>
              <div className={`min-w-0 flex-1 ${state === "active" || state === "attention" ? "rounded-2xl bg-slate-50 dark:bg-white/5 p-3" : "pt-1.5"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className={`font-semibold ${state === "upcoming" ? "text-slate-400" : "text-slate-900"}`}>{index + 1}. {step.title}</p>
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATE_BADGE[state].className}`}>{STATE_BADGE[state].text}</span>
                </div>
                <p className={`text-xs ${state === "upcoming" ? "text-slate-400" : "text-slate-500"}`}>
                  {index === 0 ? `Hoàn tất lúc ${formatTime(application.submittedAt)} · ${formatDate(application.submittedAt)}` : step.description}
                </p>
                {state === "active" && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <span className="block h-2 rounded-full bg-teal-600" style={{ width: `${legalPercent}%` }} />
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-teal-700">{legalPercent}% thời gian thẩm định</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ReviewTimeline;
