import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";
import CloudDoneOutlined from "@mui/icons-material/CloudDoneOutlined";
import GppGoodOutlined from "@mui/icons-material/GppGoodOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import { loginSuccess } from "../../../stores/authSlice";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import PartnerLoginForm from "../components/login/PartnerLoginForm";
import PartnerLoginHero from "../components/login/PartnerLoginHero";
import PartnerPublicShell from "../components/public/PartnerPublicShell";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF } from "../data/partnerMock";
import partnerApi, { type PartnerLoginInput } from "../services/partnerApi";

const PARTNER_HOME = "/partner";

/** Chỉ chấp nhận redirect nội bộ trong cổng đối tác để tránh open redirect. */
const getSafeRedirect = (raw: string | null): string =>
  raw && raw.startsWith(PARTNER_HOME) && !raw.startsWith("//") && !raw.startsWith(`${PARTNER_HOME}/login`) ? raw : PARTNER_HOME;

const TRUST_BADGES = [
  { icon: VerifiedUserOutlined, label: "PCI-DSS Compliant" },
  { icon: CloudDoneOutlined, label: "Uptime 99,99%" },
  { icon: GppGoodOutlined, label: "GDPR & PDPA Protected" },
];

export const PartnerLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const redirectTo = getSafeRedirect(searchParams.get("redirect"));

  useEffect(() => {
    document.title = "Đăng nhập Cổng Quản trị Đối tác | MeGo Partner";
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "PARTNER") navigate(redirectTo, { replace: true });
  }, [isAuthenticated, user?.role, navigate, redirectTo]);

  const handleSubmit = async (values: PartnerLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { account, token } = await partnerApi.login(values);
      dispatch(loginSuccess({ user: { id: account.id, name: account.fullName, email: account.email, role: "PARTNER" }, token }));
      toast.success(`Chào mừng ${account.fullName} quay lại cổng đối tác MeGo.`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnavailableAction = (feature: string) => {
    toast.info(`${feature} đang được kết nối với hệ thống. Vui lòng liên hệ hotline ${PARTNER_HOTLINE} nếu cần hỗ trợ ngay.`);
  };

  return (
    <PartnerPublicShell
      headerAction={
        <Link to="/partner/register/status" className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-[#1677FF] hover:bg-blue-50">
          <AssignmentTurnedInOutlined sx={{ fontSize: 18 }} />
          <span className="hidden sm:inline">Theo dõi hồ sơ đã nộp</span>
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="tracking-wider text-slate-700">HOSPITALITY CLOUD</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#1677FF]">Cổng Đối Tác Chính Thức</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-semibold text-cyan-800">
            <VerifiedOutlined sx={{ fontSize: 15 }} /> Đã xác minh
          </span>
        </div>
        <a href={PARTNER_HOTLINE_HREF} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#1677FF]">
          <HeadsetMicOutlined sx={{ fontSize: 18 }} className="text-[#1677FF]" />
          Hotline B2B: <strong className="text-[#1677FF]">{PARTNER_HOTLINE}</strong>
          <span className="text-xs text-slate-400">(24/7 miễn phí)</span>
        </a>
      </div>

      <div className="grid overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-xl lg:grid-cols-[1.15fr_1fr]">
        <div className="hidden p-3 lg:block">
          <PartnerLoginHero />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <PartnerLoginForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            onUnavailableAction={handleUnavailableAction}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon sx={{ fontSize: 16 }} className="text-[#1677FF]" /> {label}
            </li>
          ))}
        </ul>
        <Link to="/support" className="hover:text-[#1677FF]">Trung tâm Trợ giúp</Link>
      </div>
    </PartnerPublicShell>
  );
};

export default PartnerLoginPage;
