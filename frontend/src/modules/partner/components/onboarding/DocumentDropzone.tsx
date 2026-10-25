import { useId, useRef, useState, type DragEvent } from "react";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import ImageOutlined from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import { ACCEPTED_DOCUMENT_TYPES, MAX_DOCUMENT_BYTES } from "../../data/onboardingMock";
import { formatFileSize } from "./formStyles";

interface DocumentDropzoneProps {
  label: string;
  file: File | null;
  missing: boolean;
  onChange: (file: File | null) => void;
}

const validateFile = (file: File): string | null => {
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) return "Chỉ nhận file PDF, JPG hoặc PNG.";
  if (file.size > MAX_DOCUMENT_BYTES) return `File ${formatFileSize(file.size)} vượt quá giới hạn 15 MB.`;
  return null;
};

export const DocumentDropzone = ({ label, file, missing, onChange }: DocumentDropzoneProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = (candidate: File | undefined) => {
    if (!candidate) return;
    const problem = validateFile(candidate);
    setError(problem);
    if (!problem) onChange(candidate);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files[0]);
  };

  if (file) {
    const Icon = file.type === "application/pdf" ? PictureAsPdfOutlined : ImageOutlined;
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
        <Icon sx={{ fontSize: 22 }} className={file.type === "application/pdf" ? "text-red-500" : "text-[#1677FF]"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800" title={file.name}>{file.name}</p>
          <p className="text-xs text-slate-500">{label} · {formatFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
          aria-label={`Xóa file ${file.name}`}
        >
          <DeleteOutlineOutlined sx={{ fontSize: 19 }} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
          dragging ? "border-[#1677FF] bg-blue-50" : missing || error ? "border-red-300 bg-red-50/40" : "border-slate-300 bg-slate-50/60 dark:bg-white/5 hover:border-[#1677FF]"
        }`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#1677FF]">
          <CloudUploadOutlined sx={{ fontSize: 22 }} />
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {label}: kéo thả file vào đây, hoặc <span className="text-[#1677FF] underline">chọn file</span>
        </span>
        <span className="text-xs text-slate-500">PDF, JPG, PNG · tối đa 15 MB</span>
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(event) => pick(event.target.files?.[0])}
      />
      {(error || missing) && <p className="text-xs font-semibold text-red-500">{error ?? "Vui lòng tải lên tài liệu này."}</p>}
    </div>
  );
};

export default DocumentDropzone;
