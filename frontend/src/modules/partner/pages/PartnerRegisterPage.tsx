import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik, type FormikHelpers } from "formik";
import { toast } from "react-toastify";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import OnboardingSpecialistCard from "../components/onboarding/OnboardingSpecialistCard";
import { OperatingCommitmentsCard, ReviewProcessCard } from "../components/onboarding/OnboardingInfoCards";
import OnboardingStepper from "../components/onboarding/OnboardingStepper";
import { ONBOARDING_STEPS } from "../components/onboarding/onboardingSteps";
import { STEP_FIELDS, STEP_SCHEMAS } from "../components/onboarding/onboardingSchemas";
import StepDocuments, { type DocumentFiles } from "../components/onboarding/StepDocuments";
import StepPayout from "../components/onboarding/StepPayout";
import StepProperty from "../components/onboarding/StepProperty";
import StepRepresentative from "../components/onboarding/StepRepresentative";
import PartnerPublicShell from "../components/public/PartnerPublicShell";
import { APPLICATION_STATUS_LABELS, EMPTY_ONBOARDING_FORM, REQUIRED_DOCUMENTS } from "../data/onboardingMock";
import onboardingApi, { OnboardingFieldError } from "../services/onboardingApi";
import type { DocumentCategory, OnboardingForm, PartnerApplication } from "../types/partner.types";

const STEP_COPY = [
  { title: "Thông tin người đại diện quản trị", description: "Đầu mối chịu trách nhiệm pháp lý và tiếp nhận thông báo hợp đồng điện tử." },
  { title: "Thông tin chi tiết cơ sở lưu trú", description: "Dữ liệu hiển thị trực tiếp cho khách du lịch trên kênh đặt phòng MeGo." },
  { title: "Hồ sơ pháp lý & tiêu chuẩn an toàn PCCC", description: "Tài liệu bắt buộc để kích hoạt hợp đồng điện tử và nhận thanh toán tự động." },
  { title: "Tài khoản ngân hàng đối soát & chi trả doanh thu", description: "Doanh thu sau hoa hồng được chuyển về tài khoản này theo chu kỳ bạn chọn." },
];
const DOCUMENTS_STEP = 2;
const LAST_STEP = ONBOARDING_STEPS.length - 1;

const hasAllDocuments = (files: DocumentFiles) => REQUIRED_DOCUMENTS.every((doc) => files[doc.category]);

export const PartnerRegisterPage = () => {
  const navigate = useNavigate();
  const [initialDraft] = useState(() => onboardingApi.loadDraft());
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<DocumentFiles>({});
  const [showMissingDocs, setShowMissingDocs] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existing, setExisting] = useState<PartnerApplication | null>(null);

  useEffect(() => {
    document.title = "Đăng ký đối tác | MeGo Partner";
    let cancelled = false;
    onboardingApi.getApplication().then((application) => { if (!cancelled) setExisting(application); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  const goToStep = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (category: DocumentCategory, file: File | null) => {
    setFiles((current) => {
      const updated = { ...current };
      if (file) updated[category] = file;
      else delete updated[category];
      return updated;
    });
  };

  const handleSubmit = async (values: OnboardingForm, helpers: FormikHelpers<OnboardingForm>) => {
    if (step === DOCUMENTS_STEP && !hasAllDocuments(files)) {
      setShowMissingDocs(true);
      return;
    }

    if (step < LAST_STEP) {
      helpers.setTouched({}, false);
      goToStep(step + 1);
      return;
    }

    // Người dùng có thể quay lại xóa file sau khi đã qua bước tài liệu.
    if (!hasAllDocuments(files)) {
      setShowMissingDocs(true);
      goToStep(DOCUMENTS_STEP);
      return;
    }

    setSubmitError(null);
    try {
      const application = await onboardingApi.submitApplication(values, files);
      toast.success(`Đã gửi hồ sơ ${application.code}. MeGo sẽ phản hồi trong 24 giờ làm việc.`);
      navigate("/partner/register/status");
    } catch (error) {
      if (error instanceof OnboardingFieldError) {
        // Đưa người dùng về đúng bước chứa trường lỗi và báo ngay tại ô nhập.
        const fieldStep = STEP_FIELDS.findIndex((fields) => fields.includes(error.field));
        goToStep(fieldStep >= 0 ? fieldStep : 0);
        void helpers.setTouched({ [error.field]: true }, false);
        helpers.setFieldError(error.field, error.message);
        return;
      }
      setSubmitError(error instanceof Error ? error.message : "Không thể gửi hồ sơ. Vui lòng thử lại.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <PartnerPublicShell
      headerAction={
        <p className="text-sm text-slate-500">
          <span className="hidden sm:inline">Đã có tài khoản? </span>
          <Link to="/partner/login" className="font-semibold text-[#1677FF] hover:underline">Đăng nhập</Link>
        </p>
      }
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Đăng ký đối tác</h1>
          <p className="mt-1 text-sm text-slate-500">Hoàn tất 4 bước để đưa cơ sở lưu trú của bạn lên MeGo. Thời gian ước tính: 10 phút.</p>
        </div>
      </div>

      {existing && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm">
          <p className="inline-flex items-center gap-2 text-slate-700">
            <AssignmentTurnedInOutlined sx={{ fontSize: 19 }} className="text-[#1677FF]" />
            Thiết bị này đã gửi hồ sơ <strong>{existing.code}</strong> ({APPLICATION_STATUS_LABELS[existing.status].toLowerCase()}).
          </p>
          <Link to="/partner/register/status" className="font-semibold text-[#1677FF] hover:underline">Theo dõi hồ sơ →</Link>
        </div>
      )}

      {initialDraft && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="inline-flex items-center gap-2">
            <HistoryOutlined sx={{ fontSize: 19 }} /> Đã khôi phục bản nháp đã lưu. Vì lý do bảo mật, vui lòng nhập lại mật khẩu và tải lại tài liệu.
          </p>
        </div>
      )}

      <OnboardingStepper current={step} onSelect={goToStep} />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Formik<OnboardingForm>
          initialValues={initialDraft ?? EMPTY_ONBOARDING_FORM}
          validationSchema={STEP_SCHEMAS[step]}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form noValidate className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-base font-extrabold text-[#004CCD] dark:text-blue-300">{step + 1}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{STEP_COPY[step].title}</h2>
                  <p className="text-sm text-slate-500">{STEP_COPY[step].description}</p>
                </div>
              </div>

              {submitError && (
                <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                  <ErrorOutlineOutlined sx={{ fontSize: 18 }} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {step === 0 && <StepRepresentative />}
              {step === 1 && <StepProperty />}
              {step === DOCUMENTS_STEP && <StepDocuments files={files} showMissing={showMissingDocs} onChange={handleFileChange} />}
              {step === LAST_STEP && <StepPayout />}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { onboardingApi.saveDraft(values); toast.success("Đã lưu bản nháp trên thiết bị này. Bạn có thể quay lại hoàn tất sau."); }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    <SaveOutlined sx={{ fontSize: 18 }} /> Lưu bản nháp
                  </button>
                  {step > 0 && (
                    <button type="button" onClick={() => goToStep(step - 1)} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                      <ArrowBackOutlined sx={{ fontSize: 18 }} /> Quay lại
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004CCD] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-[#003db3] disabled:cursor-wait disabled:opacity-70"
                >
                  {step < LAST_STEP ? (
                    <>Tiếp tục <ArrowForwardOutlined sx={{ fontSize: 18 }} /></>
                  ) : isSubmitting ? (
                    <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Đang gửi hồ sơ...</>
                  ) : (
                    <>Gửi hồ sơ xét duyệt <SendOutlined sx={{ fontSize: 17 }} /></>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <OnboardingSpecialistCard />
          <ReviewProcessCard />
          <OperatingCommitmentsCard />
        </aside>
      </div>
    </PartnerPublicShell>
  );
};

export default PartnerRegisterPage;
