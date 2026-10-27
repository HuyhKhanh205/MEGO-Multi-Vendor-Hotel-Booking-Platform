import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";

/** Khối lỗi tải dữ liệu có nút Thử lại (dùng khi API trả lỗi hoặc backend chưa có endpoint). */
export const LoadError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center">
    <ErrorOutlineOutlined className="text-red-500" sx={{ fontSize: 40 }} />
    <p className="font-semibold text-slate-800">{message}</p>
    <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white">
      <RefreshOutlined sx={{ fontSize: 18 }} /> Thử lại
    </button>
  </div>
);

export default LoadError;
