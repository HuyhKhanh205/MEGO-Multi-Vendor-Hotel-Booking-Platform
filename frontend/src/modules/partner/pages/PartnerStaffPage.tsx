import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import { useAppSelector } from "../../../stores/store";
import { usePartnerHotel } from "../components/layout/hotelContext";
import LoadError from "../components/shared/LoadError";
import NoStaffPermission from "../components/staff/NoStaffPermission";
import StaffFormModal from "../components/staff/StaffFormModal";
import { POSITION_LABELS, POSITION_OPTIONS, POSITION_PILL_CLASS, STAFF_STATUS_META } from "../components/staff/permissionCatalog";
import partnerStaffApi from "../services/partnerStaffApi";
import type { PartnerStaffDto, StaffPosition, StaffRequest, UserStatus } from "../types/backend.types";
import { formatRelativeTime, nameInitials } from "../utils/formatters";

interface LoadState {
  requestId: number;
  staff: PartnerStaffDto[] | null;
  error: string | null;
}

const KpiTile = ({ label, value, tone = "text-slate-900" }: { label: string; value: number; tone?: string }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
    <p className="text-xs font-semibold text-slate-500">{label}</p>
    <p className={`mt-1 text-2xl font-extrabold ${tone}`}>{value}</p>
  </div>
);

const filterSelectClass = "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#1677FF]";

const StaffContent = () => {
  const { hotels } = usePartnerHotel();
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ requestId: 0, staff: null, error: null });
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<StaffPosition | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [scope, setScope] = useState<string>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerStaffDto | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    partnerStaffApi
      .list()
      .then((staff) => { if (!cancelled) setState({ requestId, staff, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setState({ requestId, staff: null, error: error instanceof Error ? error.message : "Không tải được danh sách nhân viên." }); });
    return () => { cancelled = true; };
  }, [requestId]);

  const staff = useMemo(() => state.staff ?? [], [state.staff]);
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return staff.filter((item) =>
      (position === "ALL" || item.position === position) &&
      (status === "ALL" || item.status === status) &&
      (scope === "ALL" || (scope === "SHARED" ? item.hotelId === null : item.hotelId === Number(scope))) &&
      (!keyword || `${item.fullName} ${item.email} ${item.phone ?? ""}`.toLowerCase().includes(keyword)));
  }, [staff, query, position, status, scope]);

  const upsert = (saved: PartnerStaffDto) =>
    setState((current) => ({
      ...current,
      staff: current.staff?.some((item) => item.id === saved.id)
        ? current.staff.map((item) => (item.id === saved.id ? saved : item))
        : [...(current.staff ?? []), saved],
    }));

  const runAction = async (target: PartnerStaffDto, action: () => Promise<void>, fallback: string) => {
    setBusyId(target.id);
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : fallback);
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (request: StaffRequest) => {
    const saved = editing ? await partnerStaffApi.update(editing.id, request) : await partnerStaffApi.create(request);
    upsert(saved);
    toast.success(editing ? `Đã lưu thông tin ${saved.fullName}.` : `Đã gửi lời mời tới ${saved.email}.`);
    setFormOpen(false);
    setEditing(null);
  };

  const toggleLock = (target: PartnerStaffDto) => {
    const locking = target.status !== "LOCKED";
    const message = locking
      ? `Khóa tài khoản ${target.fullName}? Nhân viên sẽ bị đăng xuất và không đăng nhập được cho tới khi mở khóa.`
      : `Mở khóa tài khoản ${target.fullName}?`;
    if (!window.confirm(message)) return;
    void runAction(target, async () => {
      upsert(await partnerStaffApi.setStatus(target.id, locking ? "LOCKED" : "ACTIVE"));
      toast.success(locking ? `Đã khóa tài khoản ${target.fullName}.` : `Đã mở khóa tài khoản ${target.fullName}.`);
    }, "Không cập nhật được trạng thái.");
  };

  const remove = (target: PartnerStaffDto) => {
    if (!window.confirm(`Xóa nhân viên ${target.fullName} (${target.email})? Tài khoản sẽ mất quyền truy cập cổng đối tác. Thao tác này không hoàn tác được.`)) return;
    void runAction(target, async () => {
      await partnerStaffApi.remove(target.id);
      setState((current) => ({ ...current, staff: current.staff?.filter((item) => item.id !== target.id) ?? null }));
      toast.success(`Đã xóa nhân viên ${target.fullName}.`);
    }, "Không xóa được nhân viên.");
  };

  const resendInvite = (target: PartnerStaffDto) =>
    void runAction(target, async () => {
      await partnerStaffApi.resendInvite(target.id);
      toast.success(`Đã gửi lại lời mời tới ${target.email}.`);
    }, "Không gửi lại được lời mời.");

  if (state.error) return <LoadError message={state.error} onRetry={() => setRequestId((id) => id + 1)} />;
  if (!state.staff || state.requestId !== requestId) return <div className="h-96 animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải nhân viên" />;

  const hotelName = (hotelId: number | null) => (hotelId === null ? "Tất cả cơ sở" : hotels.find((hotel) => hotel.id === hotelId)?.name ?? `Khách sạn #${hotelId}`);
  const countBy = (value: UserStatus) => staff.filter((item) => item.status === value).length;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Nhân viên & Phân quyền</h1>
          <p className="mt-1 text-sm text-slate-500">Tài khoản nhân viên đăng nhập cổng đối tác với quyền giới hạn theo vai trò.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-600"
        >
          <PersonAddAlt1Outlined sx={{ fontSize: 19 }} /> Thêm nhân viên
        </button>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Thống kê nhân viên">
        <KpiTile label="Tổng nhân sự" value={staff.length} />
        <KpiTile label="Đang hoạt động" value={countBy("ACTIVE")} tone="text-emerald-600" />
        <KpiTile label="Chờ kích hoạt" value={countBy("PENDING_VERIFICATION")} tone="text-amber-600" />
        <KpiTile label="Đã khóa" value={countBy("LOCKED")} tone="text-red-600" />
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white">
        <div className="flex flex-col gap-3 p-5 lg:flex-row lg:items-center sm:p-6">
          <label className="relative w-full lg:w-72">
            <span className="sr-only">Tìm theo tên, email hoặc số điện thoại</span>
            <SearchOutlined sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:ml-auto">
            <select aria-label="Lọc theo vai trò" value={position} onChange={(event) => setPosition(event.target.value as StaffPosition | "ALL")} className={filterSelectClass}>
              <option value="ALL">Mọi vai trò</option>
              {POSITION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select aria-label="Lọc theo trạng thái" value={status} onChange={(event) => setStatus(event.target.value as UserStatus | "ALL")} className={filterSelectClass}>
              <option value="ALL">Mọi trạng thái</option>
              {(Object.keys(STAFF_STATUS_META) as UserStatus[]).map((value) => <option key={value} value={value}>{STAFF_STATUS_META[value].label}</option>)}
            </select>
            <select aria-label="Lọc theo phạm vi" value={scope} onChange={(event) => setScope(event.target.value)} className={filterSelectClass}>
              <option value="ALL">Mọi phạm vi</option>
              <option value="SHARED">Tất cả cơ sở</option>
              {hotels.map((hotel) => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)}
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 border-t border-slate-100 px-6 py-12 text-center">
            <SearchOffOutlined className="text-slate-300" sx={{ fontSize: 40 }} />
            <p className="font-semibold text-slate-700">{staff.length === 0 ? "Chưa có nhân viên nào" : "Không có nhân viên phù hợp"}</p>
            {staff.length === 0 && <p className="text-sm text-slate-500">Bấm "Thêm nhân viên" để mời lễ tân, kế toán… cùng quản lý.</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-white/5">
                <tr>
                  <th scope="col" className="px-5 py-3">Nhân viên</th>
                  <th scope="col" className="px-4 py-3">Vai trò</th>
                  <th scope="col" className="px-4 py-3">Phạm vi</th>
                  <th scope="col" className="px-4 py-3">Trạng thái</th>
                  <th scope="col" className="px-4 py-3">Đăng nhập gần nhất</th>
                  <th scope="col" className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => {
                  const statusMeta = STAFF_STATUS_META[item.status];
                  const busy = busyId === item.id;
                  return (
                    <tr key={item.id} className={item.status === "LOCKED" ? "bg-slate-50/60 dark:bg-white/5" : "hover:bg-slate-50/60"}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${item.status === "LOCKED" ? "bg-slate-200 text-slate-500" : "bg-blue-100 text-[#1677FF]"}`}>{nameInitials(item.fullName)}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{item.fullName}</p>
                            <p className="text-xs text-slate-500">{item.email}{item.phone ? ` · ${item.phone}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${POSITION_PILL_CLASS[item.position]}`}>{POSITION_LABELS[item.position]}</span>
                      </td>
                      <td className="max-w-[200px] px-4 py-3.5 text-slate-700"><span className="line-clamp-2">{hotelName(item.hotelId)}</span></td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} /> {statusMeta.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-600" title={item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString("vi-VN") : undefined}>
                        {item.lastLoginAt ? formatRelativeTime(item.lastLoginAt) : <span className="text-slate-400">Chưa đăng nhập</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/partner/staff/${item.id}/permissions`} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#1677FF] hover:bg-blue-100 dark:bg-blue-500/15">
                            <AdminPanelSettingsOutlined sx={{ fontSize: 16 }} /> Phân quyền
                          </Link>
                          <button type="button" onClick={() => { setEditing(item); setFormOpen(true); }} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Sửa ${item.fullName}`} title="Sửa thông tin">
                            <EditOutlined sx={{ fontSize: 18 }} />
                          </button>
                          {item.status === "PENDING_VERIFICATION" ? (
                            <button type="button" disabled={busy} onClick={() => resendInvite(item)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Gửi lại lời mời cho ${item.fullName}`} title="Gửi lại email mời">
                              <SendOutlined sx={{ fontSize: 17 }} />
                            </button>
                          ) : (
                            <button type="button" disabled={busy} onClick={() => toggleLock(item)} className={`rounded-lg p-1.5 ${item.status === "LOCKED" ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-500 hover:bg-amber-50 hover:text-amber-600"}`} aria-label={`${item.status === "LOCKED" ? "Mở khóa" : "Khóa"} ${item.fullName}`} title={item.status === "LOCKED" ? "Mở khóa tài khoản" : "Khóa tài khoản"}>
                              {item.status === "LOCKED" ? <LockOpenOutlined sx={{ fontSize: 18 }} /> : <LockOutlined sx={{ fontSize: 18 }} />}
                            </button>
                          )}
                          <button type="button" disabled={busy} onClick={() => remove(item)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label={`Xóa ${item.fullName}`} title="Xóa nhân viên">
                            <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex gap-3 rounded-3xl border border-slate-200/80 bg-white p-5 text-sm text-slate-600">
        <ShieldOutlined className="mt-0.5 shrink-0 text-[#1677FF]" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">Lưu ý bảo mật</p>
          <ul className="list-disc space-y-0.5 pl-4 text-xs leading-relaxed">
            <li>Mỗi nhân viên dùng một tài khoản riêng, không dùng chung tài khoản chủ cơ sở.</li>
            <li>Khóa tài khoản ngay khi nhân viên nghỉ việc; quyền rút tiền luôn chỉ thuộc về chủ cơ sở.</li>
            <li>Chỉ cấp quyền vừa đủ cho công việc: dùng mẫu theo vai trò rồi chỉnh thêm nếu cần.</li>
          </ul>
        </div>
      </section>

      <StaffFormModal
        open={formOpen}
        staff={editing}
        hotels={hotels}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export const PartnerStaffPage = () => {
  const role = useAppSelector((state) => state.auth.user?.role);

  useEffect(() => {
    document.title = "Nhân viên & Phân quyền | MeGo Partner";
  }, []);

  return role === "PARTNER" ? <StaffContent /> : <NoStaffPermission />;
};

export default PartnerStaffPage;
