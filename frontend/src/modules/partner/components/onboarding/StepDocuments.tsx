import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { REQUIRED_DOCUMENTS } from "../../data/onboardingMock";
import type { DocumentCategory } from "../../types/partner.types";
import DocumentDropzone from "./DocumentDropzone";

export type DocumentFiles = Partial<Record<DocumentCategory, File>>;

interface StepDocumentsProps {
  files: DocumentFiles;
  showMissing: boolean;
  onChange: (category: DocumentCategory, file: File | null) => void;
}

const GROUPS = Array.from(new Set(REQUIRED_DOCUMENTS.map((doc) => doc.group)));

export const StepDocuments = ({ files, showMissing, onChange }: StepDocumentsProps) => (
  <div className="space-y-4">
    <p className="flex gap-2 rounded-xl bg-blue-50 p-3 text-sm text-slate-600">
      <InfoOutlined sx={{ fontSize: 18 }} className="mt-0.5 shrink-0 text-[#1677FF]" />
      Tài liệu bắt buộc để kích hoạt hợp đồng điện tử và nhận thanh toán. File chỉ được gửi cùng hồ sơ, không lưu vào bản nháp.
    </p>
    {GROUPS.map((group, index) => {
      const documents = REQUIRED_DOCUMENTS.filter((doc) => doc.group === group);
      return (
        <section key={group} className="rounded-2xl border border-slate-200 p-4">
          <h3 className="mb-3 text-sm font-bold text-slate-800">
            {index + 1}. {group} <span className="text-red-500">*</span>
          </h3>
          <div className={`grid gap-3 ${documents.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {documents.map((doc) => (
              <DocumentDropzone
                key={doc.category}
                label={doc.label}
                file={files[doc.category] ?? null}
                missing={showMissing && !files[doc.category]}
                onChange={(file) => onChange(doc.category, file)}
              />
            ))}
          </div>
        </section>
      );
    })}
  </div>
);

export default StepDocuments;
