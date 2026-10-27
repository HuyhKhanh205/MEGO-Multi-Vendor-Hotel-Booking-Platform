import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import NoteAddOutlined from "@mui/icons-material/NoteAddOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import { logout } from "../../../stores/authSlice";
import { useAppDispatch, useAppSelector } from "../../../stores/store";
import ApplicationHeaderCard from "../components/onboarding/ApplicationHeaderCard";
import ApplicationStatusHero from "../components/onboarding/ApplicationStatusHero";
import { OnboardingFaqCard, SecurityCommitmentsCard } from "../components/onboarding/OnboardingInfoCards";
import OnboardingSpecialistCard from "../components/onboarding/OnboardingSpecialistCard";
import ReviewTimeline from "../components/onboarding/ReviewTimeline";
import SubmittedDocumentsCard from "../components/onboarding/SubmittedDocumentsCard";
import PartnerPublicShell from "../components/public/PartnerPublicShell";
import { APPLICATION_STATUS_LABELS } from "../data/onboardingMock";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF } from "../data/partnerMock";
import onboardingApi from "../services/onboardingApi";
import type { ApplicationStatus, PartnerApplication } from "../types/partner.types";

interface StatusState {
  requestId: number;
  application: PartnerApplication | null;
  checkedAt: string;
  error: string | null;
}

const DEMO_STATUSES: ApplicationStatus[] = ["PENDING", "REJECTED", "APPROVED", "SUSPENDED"];

export const PartnerApplicationStatusPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const signedInPartner = authUser?.role === "PARTNER";
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<StatusState>({ requestId: 0, application: null, checkedAt: "", error: null });
  const loading = state.requestId !== requestId;
  const { application } = state;

  useEffect(() => {
    document.title = "Theo dõi trạng thái hồ sơ | MeGo Partner";
  }, []);

  useEffect(() => {
    let cancelled = false;
    onboardingApi
      .getApplication()
      .then((result) => { if (!cancelled) setState({ requestId, application: result, checkedAt: new Date().toISOString(), error: null }); })
      .catch(() => { if (!cancelled) setState((previous) => ({ ...previous, requestId, error: "Không thể tải trạng thái hồ sơ. Vui lòng thử lại." })); });
    return () => { cancelled = true; };
  }, [requestId]);

  const handleResubmit = () => {
    if (!application) return;
    onboardingApi.prepareResubmission(application);
    navigate("/partner/register");
  };

  const handleDemoStatus = async (status: ApplicationStatus) => {
    await onboardingApi.setApplicationStatusForDemo(status);
    setRequestId((id) => id + 1);
  };

  const renderBody = () => {
    if (state.requestId === 0) {
      return (
        <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Đang tải trạng thái hồ sơ">
          <div className="h-28 rounded-3xl bg-white" />
          <div className="h-96 rounded-3xl bg-white" />
        </div>
      );
    }

    if (state.error && !application) {
      return (
        <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center">
          <ErrorOutlineOutlined className="text-red-500" sx={{ fontSize: 40 }} />
          <p className="font-semibold text-slate-800">{state.error}</p>
          <button type="button" onClick={() => setRequestId((id) => id + 1)} className="rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white">Thử lại</button>
        </div>
      );
    }

    if (!application) {
      return (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1677FF]">
            <NoteAddOutlined sx={{ fontSize: 30 }} />
          </span>
          <h1 className="text-xl font-extrabold text-slate-900">Chưa có hồ sơ nào trên thiết bị này</h1>
          <p className="text-sm leading-relaxed text-slate-500">
            Hoàn tất đăng ký đối tác để theo dõi tiến độ xét duyệt tại đây. Nếu bạn đã nộp hồ sơ trên thiết bị khác, vui lòng liên hệ hotline {PARTNER_HOTLINE}.
          </p>
          <Link to="/partner/register" className="rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003db3]">Bắt đầu đăng ký</Link>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <ApplicationHeaderCard application={application} />

        {/* Khi đã đăng nhập, trạng thái lấy từ phiên thật nên không cho đổi giả lập */}
        {import.meta.env.DEV && !signedInPartner && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500">
            Xem giao diện theo trạng thái (chỉ ở môi trường dev):
            {DEMO_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => { void handleDemoStatus(status); }}
                className={`rounded-lg px-2.5 py-1 font-semibold ${application.status === status ? "bg-[#1677FF] text-white" : "bg-slate-100 dark:bg-white/10 hover:bg-slate-200"}`}
              >
                {APPLICATION_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <section className={`space-y-6 rounded-3xl border border-slate-200/80 bg-white p-5 transition-opacity sm:p-6 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
              <ApplicationStatusHero application={application} checkedAt={state.checkedAt} onResubmit={handleResubmit} signedIn={signedInPartner} />
              <ReviewTimeline application={application} checkedAt={state.checkedAt} />
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setRequestId((id) => id + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-70"
                >
                  <RefreshOutlined sx={{ fontSize: 18 }} className={loading ? "animate-spin" : ""} /> Kiểm tra cập nhật mới nhất
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Bản sao hồ sơ PDF sẽ được gửi về email của bạn khi hệ thống xuất tài liệu hoàn thành.")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#1677FF] hover:bg-blue-100"
                >
                  <FileDownloadOutlined sx={{ fontSize: 18 }} /> Tải bản sao hồ sơ (PDF)
                </button>
                <a href={PARTNER_HOTLINE_HREF} className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1677FF]">
                  <HeadsetMicOutlined sx={{ fontSize: 17 }} /> Hotline thẩm định: <strong>{PARTNER_HOTLINE}</strong>
                </a>
              </div>
            </section>
            <SubmittedDocumentsCard application={application} />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <OnboardingSpecialistCard greeting={`Chào anh/chị ${application.representativeName}! Tôi sẽ trực tiếp đồng hành xử lý các vướng mắc hồ sơ và hỗ trợ thiết lập hệ thống phòng trên MeGo.`} />
            <SecurityCommitmentsCard />
            <OnboardingFaqCard />
          </aside>
        </div>
      </div>
    );
  };

  return (
    <PartnerPublicShell
      headerAction={
        signedInPartner ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">{authUser?.email}</span>
            <button
              type="button"
              onClick={() => { dispatch(logout()); toast.info("Bạn đã đăng xuất khỏi cổng đối tác."); navigate("/partner/login", { replace: true }); }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
            >
              <LogoutOutlined sx={{ fontSize: 18 }} /> Đăng xuất
            </button>
          </div>
        ) : (
          <Link to="/partner/login" className="text-sm font-semibold text-[#1677FF] hover:underline">Đăng nhập</Link>
        )
      }
    >
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link to="/partner/login" className="hover:text-[#1677FF]">Cổng đối tác</Link>
        <ChevronRightOutlined sx={{ fontSize: 16 }} />
        <Link to="/partner/register" className="hover:text-[#1677FF]">Đăng ký đối tác</Link>
        <ChevronRightOutlined sx={{ fontSize: 16 }} />
        <span className="font-semibold text-slate-800">Theo dõi trạng thái hồ sơ</span>
      </nav>
      {renderBody()}
    </PartnerPublicShell>
  );
};

export default PartnerApplicationStatusPage;
