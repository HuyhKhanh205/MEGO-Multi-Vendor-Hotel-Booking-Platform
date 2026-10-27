import store from "../../../stores/store";
import { EMPTY_ONBOARDING_FORM, REQUIRED_DOCUMENTS, SAMPLE_REJECT_REASON } from "../data/onboardingMock";
import { SEEDED_ACCOUNT_EMAILS } from "../data/partnerMock";
import type {
  ApplicationDocument,
  ApplicationStatus,
  DocumentCategory,
  HotelCategory,
  OnboardingDraft,
  OnboardingForm,
  PartnerApplication,
} from "../types/partner.types";
import { mockDelay, PARTNER_USE_MOCK, PartnerApiError, partnerRequest } from "./partnerHttp";

const DRAFT_KEY = "mego_partner_onboarding_draft";
const APPLICATION_KEY = "mego_partner_application";
const SLA_HOURS = 24;

export type DocumentFiles = Partial<Record<DocumentCategory, File>>;

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

const toDocuments = (files: DocumentFiles): ApplicationDocument[] =>
  REQUIRED_DOCUMENTS.flatMap((doc) => {
    const file = files[doc.category];
    return file ? [{ category: doc.category, fileName: file.name, size: file.size, mimeType: file.type }] : [];
  });

/**
 * Hồ sơ mẫu cho các tài khoản đối tác chưa duyệt có sẵn trong backend (ChatDataSeeder), để khi
 * đăng nhập thật bằng các tài khoản này trang Theo dõi hồ sơ có dữ liệu chi tiết.
 */
const seededApplication = (email: string, fullName: string, status: ApplicationStatus): PartnerApplication | null => {
  const seeds: Record<string, Pick<PartnerApplication, "propertyName" | "hotelCategory" | "totalRooms" | "rejectReason">> = {
    "partner.pending@mego.vn": { propertyName: "Khu nghỉ dưỡng Lavender Đà Lạt", hotelCategory: "RESORT", totalRooms: 36, rejectReason: null },
    "partner.rejected@mego.vn": {
      propertyName: "Homestay Biển Xanh",
      hotelCategory: "BOUTIQUE",
      totalRooms: 12,
      rejectReason: "Chưa bổ sung đầy đủ giấy chứng nhận đủ điều kiện PCCC và giấy phép kinh doanh lưu trú.",
    },
  };
  const seed = seeds[email];
  if (!seed) return null;
  const submittedAt = new Date(Date.now() - 6 * 3_600_000).toISOString();
  return {
    code: `MG-VN-SEED-${email.startsWith("partner.pending") ? "0003" : "0004"}`,
    representativeName: fullName.replace(/\s*\(.*\)$/, ""),
    email,
    ...seed,
    documents: REQUIRED_DOCUMENTS.map((doc) => ({ category: doc.category, fileName: `${doc.category.toLowerCase()}.pdf`, size: 1_800_000, mimeType: "application/pdf" })),
    submittedAt,
    slaDueAt: new Date(Date.parse(submittedAt) + SLA_HOURS * 3_600_000).toISOString(),
    status,
    formSnapshot: { ...EMPTY_ONBOARDING_FORM, email, representativeName: fullName, propertyName: seed.propertyName } as OnboardingDraft,
  };
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

  /**
   * POST /api/partner/applications (multipart/form-data, public)
   *  - part "application": JSON OnboardingForm (gồm password để tạo tài khoản PARTNER)
   *  - part "documents[<CATEGORY>]": file PDF/JPG/PNG ≤ 15MB
   */
  async submitApplication(form: OnboardingForm, files: DocumentFiles): Promise<PartnerApplication> {
    const documents = toDocuments(files);

    if (!PARTNER_USE_MOCK) {
      const body = new FormData();
      body.append("application", new Blob([JSON.stringify(form)], { type: "application/json" }));
      Object.entries(files).forEach(([category, file]) => { if (file) body.append(`documents[${category}]`, file); });
      try {
        return await partnerRequest<PartnerApplication>("post", "/partner/applications", "Không thể gửi hồ sơ. Vui lòng thử lại.", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (error) {
        // Backend trả 400 khi email đã tồn tại (existsByEmail) → đưa người dùng về ô email.
        if (error instanceof PartnerApiError && error.status === 400 && error.message.toLowerCase().includes("email")) {
          throw new OnboardingFieldError("email", error.message);
        }
        throw error;
      }
    }

    await mockDelay(900);
    if (SEEDED_ACCOUNT_EMAILS.includes(form.email.trim().toLowerCase())) {
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
      status: "PENDING",
      rejectReason: null,
      formSnapshot: toDraft(form),
    };
    writeJson(APPLICATION_KEY, application);
    removeKey(DRAFT_KEY);
    return application;
  },

  /**
   * GET /api/partner/applications/me (cần JWT của tài khoản PARTNER).
   * Mock: ưu tiên phiên đăng nhập (trạng thái thật từ AuthResponse.approvalStatus), sau đó tới hồ sơ
   * vừa gửi trên thiết bị này.
   */
  async getApplication(): Promise<PartnerApplication | null> {
    const user = store.getState().auth.user;
    const sessionStatus = user?.role === "PARTNER" ? user.approvalStatus : undefined;

    if (!PARTNER_USE_MOCK) {
      if (!user) return null;
      try {
        return await partnerRequest<PartnerApplication>("get", "/partner/applications/me", "Không thể tải trạng thái hồ sơ.");
      } catch (error) {
        if (error instanceof PartnerApiError && error.status === 404) return null;
        throw error;
      }
    }

    await mockDelay(350);
    const local = readJson<PartnerApplication>(APPLICATION_KEY);
    if (user?.role === "PARTNER") {
      const email = user.email.toLowerCase();
      const base = local && local.email.toLowerCase() === email ? local : seededApplication(email, user.name, sessionStatus ?? "PENDING");
      // Trạng thái lấy từ phiên đăng nhập thật thay vì dữ liệu cục bộ.
      return base && sessionStatus ? { ...base, status: sessionStatus } : base;
    }
    return local;
  },

  /** Chép dữ liệu hồ sơ đã gửi vào bản nháp để mở lại form bổ sung. */
  prepareResubmission(application: PartnerApplication) {
    writeJson(DRAFT_KEY, application.formSnapshot);
  },

  /** Chỉ dùng ở môi trường dev (khi chưa đăng nhập) để xem giao diện của từng trạng thái. */
  async setApplicationStatusForDemo(status: ApplicationStatus): Promise<PartnerApplication | null> {
    const application = readJson<PartnerApplication>(APPLICATION_KEY);
    if (!application) return null;
    const updated: PartnerApplication = { ...application, status, rejectReason: status === "REJECTED" ? SAMPLE_REJECT_REASON : null };
    writeJson(APPLICATION_KEY, updated);
    return updated;
  },
};

export default onboardingApi;
