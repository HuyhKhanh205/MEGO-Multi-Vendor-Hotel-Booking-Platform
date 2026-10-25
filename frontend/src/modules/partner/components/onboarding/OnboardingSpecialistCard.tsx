import { toast } from "react-toastify";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import PhoneInTalkOutlined from "@mui/icons-material/PhoneInTalkOutlined";
import StarRounded from "@mui/icons-material/StarRounded";
import SupportAgentOutlined from "@mui/icons-material/SupportAgentOutlined";
import { ONBOARDING_SPECIALIST } from "../../data/onboardingMock";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF } from "../../data/partnerMock";

interface OnboardingSpecialistCardProps {
  /** Lời nhắn riêng của chuyên viên (P21) */
  greeting?: string;
}

export const OnboardingSpecialistCard = ({ greeting }: OnboardingSpecialistCardProps) => (
  <section className="rounded-3xl border border-slate-200/80 bg-white p-5">
    <div className="flex items-center justify-between gap-2">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
        <SupportAgentOutlined sx={{ fontSize: 18 }} className="text-[#1677FF]" /> Chuyên viên Onboarding 1:1
      </h2>
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Đang trực tuyến
      </span>
    </div>

    <div className="mt-4 flex items-center gap-3">
      <img src={ONBOARDING_SPECIALIST.avatar} alt={ONBOARDING_SPECIALIST.name} className="h-12 w-12 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="font-bold text-slate-900">{ONBOARDING_SPECIALIST.name}</p>
        <p className="text-xs text-slate-500">{ONBOARDING_SPECIALIST.title}</p>
        <p className="mt-0.5 inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
          <StarRounded sx={{ fontSize: 14 }} /> {ONBOARDING_SPECIALIST.rating}
          <span className="font-normal text-slate-400"> ({ONBOARDING_SPECIALIST.reviews})</span>
        </p>
      </div>
    </div>

    {greeting && <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm italic leading-relaxed text-slate-600">“{greeting}”</p>}

    <div className="mt-4 space-y-2 text-sm">
      <a href={PARTNER_HOTLINE_HREF} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 hover:border-[#1677FF]">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
          <PhoneInTalkOutlined sx={{ fontSize: 17 }} className="text-[#1677FF]" /> {PARTNER_HOTLINE}
          <span className="font-normal text-slate-400">({ONBOARDING_SPECIALIST.extension})</span>
        </span>
        <span className="text-xs font-semibold text-[#1677FF]">Gọi ngay</span>
      </a>
      <a href={`mailto:${ONBOARDING_SPECIALIST.email}`} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 hover:border-[#1677FF]">
        <span className="inline-flex items-center gap-2 font-semibold text-slate-700">
          <MailOutlineOutlined sx={{ fontSize: 17 }} className="text-[#1677FF]" /> {ONBOARDING_SPECIALIST.email}
        </span>
        <span className="text-xs font-semibold text-[#1677FF]">Gửi mail</span>
      </a>
      <button
        type="button"
        onClick={() => toast.info(`Kênh chat trực tiếp đang được kết nối. Vui lòng gọi ${PARTNER_HOTLINE} (${ONBOARDING_SPECIALIST.extension}) để được hỗ trợ ngay.`)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 font-semibold text-[#1677FF] hover:bg-blue-100"
      >
        <ChatOutlined sx={{ fontSize: 17 }} /> Trò chuyện trực tiếp
      </button>
    </div>
  </section>
);

export default OnboardingSpecialistCard;
