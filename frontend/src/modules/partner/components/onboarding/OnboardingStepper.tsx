import CheckRounded from "@mui/icons-material/CheckRounded";
import { ONBOARDING_STEPS } from "./onboardingSteps";

interface OnboardingStepperProps {
  /** Chỉ số bước hiện tại (0–3) */
  current: number;
  /** Chỉ cho bấm quay lại các bước đã đi qua */
  onSelect: (step: number) => void;
}

export const OnboardingStepper = ({ current, onSelect }: OnboardingStepperProps) => {
  const progress = Math.round((current / ONBOARDING_STEPS.length) * 100);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Lộ trình thẩm định hồ sơ ·{" "}
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#004CCD] dark:text-blue-300">Mã hồ sơ được cấp sau khi gửi</span>
        </p>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          Tiến độ hoàn thiện: <strong className="text-lg text-[#1677FF]">{progress}%</strong>
          <span className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <span className="block h-2 rounded-full bg-[#1677FF] transition-all" style={{ width: `${progress}%` }} />
          </span>
        </div>
      </div>

      <ol className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {ONBOARDING_STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step.title} className="min-w-[200px] flex-1">
              <button
                type="button"
                disabled={!done}
                onClick={() => onSelect(index)}
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  active
                    ? "border-[#004CCD] bg-[#004CCD] text-white shadow-md shadow-blue-600/20"
                    : done
                      ? "border-slate-200 bg-slate-50 dark:bg-white/5 hover:border-[#1677FF]"
                      : "cursor-default border-slate-100 bg-slate-50/60 dark:bg-white/5 opacity-70"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    active ? "bg-white text-[#004CCD] dark:text-blue-300" : done ? "bg-[#1677FF] text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? <CheckRounded sx={{ fontSize: 18 }} /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[10px] font-bold uppercase tracking-wider ${active ? "text-blue-100" : "text-slate-400"}`}>
                    {active ? "Đang thực hiện" : done ? `Bước ${index + 1} · Đã xong` : `Bước ${index + 1}`}
                  </span>
                  <span className={`block truncate text-sm font-bold ${active ? "text-white" : "text-slate-800"}`}>{step.title}</span>
                  <span className={`block truncate text-xs ${active ? "text-blue-100" : "text-slate-500"}`}>{step.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default OnboardingStepper;
