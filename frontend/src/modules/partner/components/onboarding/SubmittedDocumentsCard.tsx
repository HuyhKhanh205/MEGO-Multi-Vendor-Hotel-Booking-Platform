import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { DOCUMENT_LABELS } from "../../data/onboardingMock";
import type { PartnerApplication } from "../../types/partner.types";
import { getDocumentState, type DocumentReviewState } from "./applicationProgress";
import { formatFileSize } from "./formStyles";

const STATE_BADGE: Record<DocumentReviewState, { text: string; className: string }> = {
  reviewing: { text: "Đang thẩm định", className: "bg-teal-50 text-teal-700" },
  valid: { text: "Hợp lệ", className: "bg-emerald-50 text-emerald-700" },
  replace: { text: "Cần thay thế", className: "bg-amber-100 text-amber-800" },
};

export const SubmittedDocumentsCard = ({ application }: { application: PartnerApplication }) => {
  const states = application.documents.map((document) => getDocumentState(document, application.status));
  const validCount = states.filter((state) => state === "valid").length;
  const total = application.documents.length;
  const summary = application.status === "PENDING_REVIEW" ? `${total} tài liệu đang thẩm định` : `${validCount}/${total} tài liệu hợp lệ`;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
          <FolderOpenOutlined className="text-[#1677FF]" /> Danh mục tài liệu pháp lý đã tải lên
        </h2>
        <span className="text-sm font-semibold text-slate-500">{summary}</span>
      </div>
      <ul className="mt-4 divide-y divide-slate-100">
        {application.documents.map((document, index) => {
          const Icon = document.mimeType === "application/pdf" ? PictureAsPdfOutlined : ImageOutlined;
          const badge = STATE_BADGE[states[index]];
          return (
            <li key={document.category} className="flex items-center gap-3 py-3">
              <Icon className={document.mimeType === "application/pdf" ? "text-red-500" : "text-[#1677FF]"} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{DOCUMENT_LABELS[document.category]}</p>
                <p className="truncate text-xs text-slate-500" title={document.fileName}>{document.fileName} · {formatFileSize(document.size)}</p>
              </div>
              <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>{badge.text}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SubmittedDocumentsCard;
