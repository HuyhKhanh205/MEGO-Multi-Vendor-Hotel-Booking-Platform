import BedOutlined from "@mui/icons-material/BedOutlined";
import { APPLICATION_STATUS_LABELS, HOTEL_CATEGORIES } from "../../data/onboardingMock";
import type { ApplicationStatus, PartnerApplication } from "../../types/partner.types";
import { formatDate, formatTime } from "../../utils/formatters";

const STATUS_CHIP: Record<ApplicationStatus, string> = {
  PENDING: "bg-blue-50 text-[#1677FF]",
  REJECTED: "bg-amber-100 text-amber-800",
  SUSPENDED: "bg-red-100 text-red-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
};

export const ApplicationHeaderCard = ({ application }: { application: PartnerApplication }) => {
  const category = HOTEL_CATEGORIES.find((item) => item.value === application.hotelCategory)?.title ?? "Cơ sở lưu trú";
  const facts = [
    { label: "Người đại diện", value: application.representativeName },
    { label: "Ngày nộp hồ sơ", value: `${formatDate(application.submittedAt)} · ${formatTime(application.submittedAt)}` },
    { label: "Loại hình · Quy mô", value: `${category} · ${application.totalRooms} phòng` },
  ];

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#1677FF]">
          <BedOutlined sx={{ fontSize: 28 }} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#004CCD] dark:text-blue-300">Hồ sơ đối tác</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CHIP[application.status]}`}>{APPLICATION_STATUS_LABELS[application.status]}</span>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500">Mã: <strong className="text-slate-800">#{application.code}</strong></p>
          <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900">{application.propertyName}</h1>
        </div>
      </div>
      {/* Grid co giãn: bản Figma để "Người đại diện" đè lên "Ngày nộp hồ sơ" */}
      <dl className="grid gap-4 sm:grid-cols-3 lg:max-w-xl">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{fact.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ApplicationHeaderCard;
