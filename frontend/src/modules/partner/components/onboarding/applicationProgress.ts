import type { ApplicationDocument, ApplicationStatus, PartnerApplication } from "../../types/partner.types";

export type ReviewStepState = "done" | "active" | "attention" | "upcoming";

const REVIEW_HOURS = 12;

/** Trạng thái 4 bước xét duyệt, suy ra từ trạng thái hồ sơ để mọi khối trên trang luôn khớp nhau. */
export const getReviewStepStates = (status: ApplicationStatus): ReviewStepState[] => {
  if (status === "APPROVED") return ["done", "done", "done", "done"];
  if (status === "SUSPENDED") return ["done", "done", "done", "attention"];
  if (status === "REJECTED") return ["done", "attention", "upcoming", "upcoming"];
  return ["done", "active", "upcoming", "upcoming"];
};

export const getProgressPercent = (status: ApplicationStatus): number =>
  Math.round((getReviewStepStates(status).filter((state) => state === "done").length / 4) * 100);

/** Số giờ đã xử lý tính từ lúc nộp (0–24). */
export const getElapsedHours = (application: PartnerApplication, checkedAt: string): number =>
  Math.min(24, Math.max(0, Math.floor((Date.parse(checkedAt) - Date.parse(application.submittedAt)) / 3_600_000)));

/** % tiến độ của bước thẩm định pháp lý (cam kết trong 12 giờ). */
export const getLegalReviewPercent = (application: PartnerApplication, checkedAt: string): number => {
  const elapsedMinutes = (Date.parse(checkedAt) - Date.parse(application.submittedAt)) / 60_000;
  return Math.min(95, Math.max(5, Math.round((elapsedMinutes / (REVIEW_HOURS * 60)) * 100)));
};

export type DocumentReviewState = "reviewing" | "valid" | "replace";

export const getDocumentState = (document: ApplicationDocument, status: ApplicationStatus): DocumentReviewState => {
  if (status === "APPROVED" || status === "SUSPENDED") return "valid";
  // Mẫu "cần bổ sung" đang yêu cầu thay Giấy chứng nhận PCCC.
  if (status === "REJECTED") return document.category === "FIRE_SAFETY" ? "replace" : "valid";
  return "reviewing";
};
