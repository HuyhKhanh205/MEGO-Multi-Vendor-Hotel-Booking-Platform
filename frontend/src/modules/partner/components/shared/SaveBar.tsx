import SaveOutlined from "@mui/icons-material/SaveOutlined";

interface SaveBarProps {
  dirty: boolean;
  saving: boolean;
  onReset?: () => void;
  label?: string;
}

/** Thanh lưu ở cuối mỗi tab: một nút lưu duy nhất (Figma đang có 2 nút lưu khác nhau). */
export const SaveBar = ({ dirty, saving, onReset, label = "Lưu thay đổi" }: SaveBarProps) => (
  <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
    {dirty && <span className="mr-auto text-xs font-semibold text-amber-600">Có thay đổi chưa lưu</span>}
    {onReset && (
      <button type="button" onClick={onReset} disabled={!dirty || saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">
        Hoàn tác
      </button>
    )}
    <button
      type="submit"
      disabled={!dirty || saving}
      className="inline-flex items-center gap-2 rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#003db3] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <SaveOutlined sx={{ fontSize: 18 }} />}
      {saving ? "Đang lưu..." : label}
    </button>
  </div>
);

export default SaveBar;
