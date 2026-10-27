import ShieldOutlined from "@mui/icons-material/ShieldOutlined";

/** Hiện cho tài khoản PARTNER_STAFF: chỉ chủ cơ sở mới quản lý nhân viên. */
export const NoStaffPermission = () => (
  <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><ShieldOutlined sx={{ fontSize: 30 }} /></span>
    <h1 className="text-xl font-extrabold text-slate-900">Bạn không có quyền quản lý nhân viên</h1>
    <p className="text-sm leading-relaxed text-slate-500">Chỉ chủ cơ sở mới thêm, sửa và phân quyền nhân viên. Liên hệ chủ cơ sở nếu bạn cần thay đổi quyền của mình.</p>
  </div>
);

export default NoStaffPermission;
