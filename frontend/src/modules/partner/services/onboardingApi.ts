import axios from "axios";
import { EMPTY_ONBOARDING_FORM, SAMPLE_REVIEW_NOTES } from "../data/onboardingMock";
import { PARTNER_DEMO_CREDENTIALS } from "../data/partnerMock";
import type {
  ApplicationDocument,
  ApplicationStatus,
  HotelCategory,
  OnboardingDraft,
  OnboardingForm,
  PartnerApplication,
} from "../types/partner.types";

const USE_MOCK = true;
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api", headers: { "Content-Type": "application/json" } });
const delay = (ms = 500) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const DRAFT_KEY = "mego_partner_onboarding_draft";
const APPLICATION_KEY = "mego_partner_application";
const SLA_HOURS = 24;

const readJson = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage không khả dụng (chế độ riêng tư...)
  }
};

const removeKey = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage không khả dụng
  }
};

/** Lỗi gắn với một trường cụ thể của form để giao diện đưa người dùng về đúng bước. */
export class OnboardingFieldError extends Error {
  field: keyof OnboardingForm;

  constructor(field: keyof OnboardingForm, message: string) {
    super(message);
    this.name = "OnboardingFieldError";
    this.field = field;
  }
}

const toDraft = (form: OnboardingForm): OnboardingDraft => {
  const { password: _password, ...draft } = form;
  void _password;
  return draft;
};

export const onboardingApi = {
  /** Bản nháp chỉ lưu trên thiết bị, không gồm mật khẩu và file. */
  loadDraft(): OnboardingForm | null {
    const draft = readJson<OnboardingDraft>(DRAFT_KEY);
    return draft ? { ...EMPTY_ONBOARDING_FORM, ...draft, password: "" } : null;
  },

  saveDraft(form: OnboardingForm) {
    writeJson(DRAFT_KEY, toDraft(form));
  },

  clearDraft() {
    removeKey(DRAFT_KEY);
  },

  async submitApplication(form: OnboardingForm, documents: ApplicationDocument[]): Promise<PartnerApplication> {
    if (!USE_MOCK) return (await api.post<PartnerApplication>("/partner/applications", { ...form, documents })).data; // TODO: endpoint Spring Boot (multipart)
    await delay(900);

    if (form.email.trim().toLowerCase() === PARTNER_DEMO_CREDENTIALS.identifier) {
      throw new OnboardingFieldError("email", "Email này đã được đăng ký cho một cơ sở lưu trú khác. Vui lòng đăng nhập hoặc dùng email công việc khác.");
    }

    const now = new Date();
    const application: PartnerApplication = {
      code: `MG-VN-${now.getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      representativeName: form.representativeName.trim(),
      email: form.email.trim(),
      propertyName: form.propertyName.trim(),
      hotelCategory: form.hotelCategory as HotelCategory,
      totalRooms: Number(form.totalRooms),
      documents,
      submittedAt: now.toISOString(),
      slaDueAt: new Date(now.getTime() + SLA_HOURS * 3_600_000).toISOString(),
      status: "PENDING_REVIEW",
      reviewNotes: [],
      formSnapshot: toDraft(form),
    };
    writeJson(APPLICATION_KEY, application);
    removeKey(DRAFT_KEY);
    return application;
  },

  async getApplication(): Promise<PartnerApplication | null> {
    if (!USE_MOCK) return (await api.get<PartnerApplication | null>("/partner/applications/current")).data; // TODO: endpoint Spring Boot
    await delay(350);
    return readJson<PartnerApplication>(APPLICATION_KEY);
  },

  /** Chép dữ liệu hồ sơ đã gửi vào bản nháp để mở lại form bổ sung. */
  prepareResubmission(application: PartnerApplication) {
    writeJson(DRAFT_KEY, application.formSnapshot);
  },

  /** Chỉ dùng ở môi trường dev để xem giao diện của từng trạng thái. */
  async setApplicationStatusForDemo(status: ApplicationStatus): Promise<PartnerApplication | null> {
    const application = readJson<PartnerApplication>(APPLICATION_KEY);
    if (!application) return null;
    const updated: PartnerApplication = { ...application, status, reviewNotes: status === "NEEDS_INFO" ? SAMPLE_REVIEW_NOTES : [] };
    writeJson(APPLICATION_KEY, updated);
    return updated;
  },
};

export default onboardingApi;
