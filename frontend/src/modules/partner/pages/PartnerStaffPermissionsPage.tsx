import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import AutoFixHighOutlined from "@mui/icons-material/AutoFixHighOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import SaveOutlined from "@mui/icons-material/SaveOutlined";
import { useAppSelector } from "../../../stores/store";
import { usePartnerHotel } from "../components/layout/hotelContext";
import LoadError from "../components/shared/LoadError";
import NoStaffPermission from "../components/staff/NoStaffPermission";
import {
  ALL_PERMISSIONS,
  isPermissionAllowed,
  PERMISSION_GROUPS,
  permissionLockReason,
  POSITION_LABELS,
  POSITION_OPTIONS,
  POSITION_PILL_CLASS,
  POSITION_TEMPLATES,
  sortPermissions,
  STAFF_STATUS_META,
} from "../components/staff/permissionCatalog";
import useUnsavedChangesPrompt from "../hooks/useUnsavedChangesPrompt";
import partnerStaffApi from "../services/partnerStaffApi";
import type { PartnerPermission, PartnerStaffDto, StaffPosition } from "../types/backend.types";
import { nameInitials } from "../utils/formatters";

interface LoadState {
  key: string;
  staff: PartnerStaffDto | null;
  error: string | null;
}

const BackLink = () => (
  <Link to="/partner/staff" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1677FF] hover:underline">
    <ArrowBackOutlined sx={{ fontSize: 18 }} /> Danh sách nhân viên
  </Link>
);

const PermissionsEditor = ({ staff, onSaved }: { staff: PartnerStaffDto; onSaved: (staff: PartnerStaffDto) => void }) => {
  const { hotels } = usePartnerHotel();
  const [draft, setDraft] = useState<PartnerPermission[]>(() => sortPermissions(staff.permissions));
  const [saving, setSaving] = useState(false);

  const saved = useMemo(() => sortPermissions(staff.permissions), [staff.permissions]);
  const dirty = draft.join(",") !== saved.join(",");
  useUnsavedChangesPrompt(dirty, "Phân quyền chưa được lưu. Rời trang và bỏ các thay đổi này?");

  const toggle = (key: PartnerPermission) =>
    setDraft((current) => sortPermissions(current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));

  const setGroup = (keys: PartnerPermission[], enabled: boolean) =>
    setDraft((current) => sortPermissions(enabled ? [...current, ...keys] : current.filter((item) => !keys.includes(item))));

  const applyTemplate = (position: StaffPosition) => {
    const template = POSITION_TEMPLATES[position];
    const allowed = template.filter((key) => isPermissionAllowed(key, staff.position));
    setDraft(sortPermissions(allowed));
    const dropped = template.length - allowed.length;
    toast.info(
      dropped
        ? `Đã áp mẫu ${POSITION_LABELS[position]}, bỏ ${dropped} quyền không dành cho vai trò ${POSITION_LABELS[staff.position]}.`
        : `Đã áp mẫu ${POSITION_LABELS[position]}. Bấm "Lưu phân quyền" để áp dụng.`,
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await partnerStaffApi.updatePermissions(staff.id, draft);
      onSaved(updated);
      setDraft(sortPermissions(updated.permissions));
      toast.success(`Đã lưu phân quyền cho ${updated.fullName}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được phân quyền.");
    } finally {
      setSaving(false);
    }
  };

  const statusMeta = STAFF_STATUS_META[staff.status];
  const scopeName = staff.hotelId === null ? "Tất cả cơ sở" : hotels.find((hotel) => hotel.id === staff.hotelId)?.name ?? `Khách sạn #${staff.hotelId}`;

  return (
    <div className="space-y-5 pb-24">
      <BackLink />

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-extrabold text-[#1677FF]">
          {nameInitials(staff.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">Phân quyền: {staff.fullName}</h1>
          <p className="text-sm text-slate-500">{staff.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-1 font-semibold ${POSITION_PILL_CLASS[staff.position]}`}>{POSITION_LABELS[staff.position]}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-white/10">{scopeName}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${statusMeta.className}`}><span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />{statusMeta.label}</span>
          </div>
        </div>
      </section>

      {staff.status === "LOCKED" && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10">Tài khoản đang bị khóa: quyền được lưu nhưng chỉ có hiệu lực sau khi mở khóa.</p>
      )}

      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900"><AutoFixHighOutlined className="text-[#1677FF]" sx={{ fontSize: 20 }} /> Áp dụng mẫu theo vai trò</h2>
        <p className="mt-0.5 text-xs text-slate-500">Đặt nhanh bộ quyền mặc định, sau đó bật/tắt từng quyền nếu cần. Quyền ngoài phạm vi vai trò sẽ được bỏ qua.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {POSITION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyTemplate(option.value)}
              className={`rounded-xl border px-3.5 py-2 text-sm font-semibold ${option.value === staff.position ? "border-[#1677FF] bg-blue-50 text-[#1677FF] dark:bg-blue-500/15" : "border-slate-200 text-slate-700 hover:border-blue-300"}`}
            >
              {option.label}{option.value === staff.position ? " (vai trò hiện tại)" : ""}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {PERMISSION_GROUPS.map((group) => {
          const allowedKeys = group.permissions.filter((item) => !permissionLockReason(item, staff.position)).map((item) => item.key);
          const enabledCount = group.permissions.filter((item) => draft.includes(item.key)).length;
          const allOn = allowedKeys.length > 0 && allowedKeys.every((key) => draft.includes(key));
          return (
            <section key={group.id} className="rounded-3xl border border-slate-200/80 bg-white p-5" aria-labelledby={`group-${group.id}`}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 id={`group-${group.id}`} className="text-base font-bold text-slate-900">{group.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-white/10">{enabledCount}/{group.permissions.length}</span>
                  {allowedKeys.length > 0 && (
                    <button type="button" onClick={() => setGroup(allowedKeys, !allOn)} className="text-xs font-semibold text-[#1677FF] hover:underline">
                      {allOn ? "Tắt cả nhóm" : "Bật cả nhóm"}
                    </button>
                  )}
                </div>
              </div>
              <ul className="space-y-1.5">
                {group.permissions.map((permission) => {
                  const lockReason = permissionLockReason(permission, staff.position);
                  const checked = draft.includes(permission.key);
                  return (
                    <li key={permission.key}>
                      <label className={`flex gap-3 rounded-2xl border p-3 ${lockReason ? "cursor-not-allowed border-dashed border-slate-200 bg-slate-50/70 dark:bg-white/5" : `cursor-pointer ${checked ? "border-blue-200 bg-blue-50/40 dark:bg-blue-500/10" : "border-slate-200 hover:border-blue-300"}`}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!!lockReason}
                          onChange={() => toggle(permission.key)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1677FF]"
                          aria-describedby={`perm-${permission.key}-desc`}
                        />
                        <span className="min-w-0">
                          <span className={`block text-sm font-semibold ${lockReason ? "text-slate-500" : "text-slate-800"}`}>{permission.label}</span>
                          <span id={`perm-${permission.key}-desc`} className="block text-xs leading-relaxed text-slate-500">
                            {permission.description}
                            {lockReason && (
                              <span className="mt-1 flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                                <LockOutlined sx={{ fontSize: 13 }} /> {lockReason}
                              </span>
                            )}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-68">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 py-3 pl-4 pr-20 sm:pl-6 sm:pr-24">
          <p className="text-sm text-slate-700" aria-live="polite">
            <strong className="text-slate-900">{draft.length}/{ALL_PERMISSIONS.length}</strong> quyền đang bật
            {dirty && <span className="ml-2 text-xs font-semibold text-amber-600">· Có thay đổi chưa lưu</span>}
          </p>
          <div className="ml-auto flex gap-2">
            <button type="button" disabled={!dirty || saving} onClick={() => setDraft(saved)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40">
              Hủy thay đổi
            </button>
            <button type="button" disabled={!dirty || saving} onClick={() => { void handleSave(); }} className="inline-flex items-center gap-2 rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#003db3] disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <SaveOutlined sx={{ fontSize: 18 }} />}
              {saving ? "Đang lưu..." : "Lưu phân quyền"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionsContent = ({ staffId }: { staffId: number }) => {
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ key: "", staff: null, error: null });
  const key = `${staffId}#${requestId}`;

  useEffect(() => {
    let cancelled = false;
    partnerStaffApi
      .get(staffId)
      .then((staff) => { if (!cancelled) setState({ key, staff, error: null }); })
      .catch((error: unknown) => { if (!cancelled) setState({ key, staff: null, error: error instanceof Error ? error.message : "Không tải được nhân viên." }); });
    return () => { cancelled = true; };
  }, [staffId, key]);

  if (state.key !== key) return <div className="h-96 animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải phân quyền" />;
  if (state.error || !state.staff) {
    return (
      <div className="space-y-4">
        <BackLink />
        <LoadError message={state.error ?? "Không tìm thấy nhân viên."} onRetry={() => setRequestId((id) => id + 1)} />
      </div>
    );
  }
  return <PermissionsEditor staff={state.staff} onSaved={(staff) => setState((current) => ({ ...current, staff }))} />;
};

export const PartnerStaffPermissionsPage = () => {
  const role = useAppSelector((state) => state.auth.user?.role);
  const { staffId } = useParams();
  const id = Number(staffId);

  useEffect(() => {
    document.title = "Phân quyền nhân viên | MeGo Partner";
  }, []);

  if (role !== "PARTNER") return <NoStaffPermission />;
  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center font-semibold text-slate-700">Đường dẫn nhân viên không hợp lệ.</p>
      </div>
    );
  }
  return <PermissionsContent key={id} staffId={id} />;
};

export default PartnerStaffPermissionsPage;
