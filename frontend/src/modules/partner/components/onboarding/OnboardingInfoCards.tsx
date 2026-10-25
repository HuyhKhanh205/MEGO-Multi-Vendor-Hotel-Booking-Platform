import type { SvgIconComponent } from "@mui/icons-material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import HelpOutlineOutlined from "@mui/icons-material/HelpOutlineOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";
import { ONBOARDING_FAQ, OPERATING_COMMITMENTS, REVIEW_STEPS, SECURITY_COMMITMENTS } from "../../data/onboardingMock";

const CardTitle = ({ icon: Icon, children }: { icon: SvgIconComponent; children: string }) => (
  <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
    <Icon sx={{ fontSize: 18 }} className="text-[#1677FF]" /> {children}
  </h2>
);

/** P20: các bước xét duyệt sau khi gửi hồ sơ. */
export const ReviewProcessCard = () => (
  <section className="rounded-3xl border border-slate-200/80 bg-white p-5">
    <CardTitle icon={ScheduleOutlined}>Quy trình xét duyệt hồ sơ (SLA 24 giờ)</CardTitle>
    <ol className="mt-4 space-y-3">
      {REVIEW_STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#1677FF]">{index + 1}</span>
          <span>
            <span className="block text-sm font-semibold text-slate-800">{step.title}</span>
            <span className="block text-xs leading-relaxed text-slate-500">{step.description}</span>
          </span>
        </li>
      ))}
    </ol>
  </section>
);

const ChecklistCard = ({ icon, title, items }: { icon: SvgIconComponent; title: string; items: string[] }) => (
  <section className="rounded-3xl border border-slate-200/80 bg-white p-5">
    <CardTitle icon={icon}>{title}</CardTitle>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-slate-600">
          <CheckCircleRounded sx={{ fontSize: 17 }} className="mt-0.5 shrink-0 text-emerald-500" /> {item}
        </li>
      ))}
    </ul>
  </section>
);

export const OperatingCommitmentsCard = () => <ChecklistCard icon={WorkspacePremiumOutlined} title="Cam kết vận hành MeGo" items={OPERATING_COMMITMENTS} />;

export const SecurityCommitmentsCard = () => <ChecklistCard icon={ShieldOutlined} title="Cam kết bảo mật doanh nghiệp" items={SECURITY_COMMITMENTS} />;

export const OnboardingFaqCard = () => (
  <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5">
    <CardTitle icon={HelpOutlineOutlined}>Câu hỏi thường gặp</CardTitle>
    <dl className="mt-3 space-y-3">
      {ONBOARDING_FAQ.map((item) => (
        <div key={item.question}>
          <dt className="text-sm font-semibold text-[#004CCD] dark:text-blue-300">{item.question}</dt>
          <dd className="mt-0.5 text-xs leading-relaxed text-slate-600">{item.answer}</dd>
        </div>
      ))}
    </dl>
  </section>
);
