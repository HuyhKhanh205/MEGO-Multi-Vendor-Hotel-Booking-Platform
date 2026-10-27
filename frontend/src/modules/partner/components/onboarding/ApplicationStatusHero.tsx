import { Link } from "react-router-dom";
import EditNoteOutlined from "@mui/icons-material/EditNoteOutlined";
import HourglassTopOutlined from "@mui/icons-material/HourglassTopOutlined";
import LoginOutlined from "@mui/icons-material/LoginOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import type { PartnerApplication } from "../../types/partner.types";
import { formatDayMonth, formatTime } from "../../utils/formatters";
import { getElapsedHours } from "./applicationProgress";

interface ApplicationStatusHeroProps {
  application: PartnerApplication;
  checkedAt: string;
  onResubmit: () => void;
  /** Đang đăng nhập bằng chính tài khoản đối tác của hồ sơ */
  signedIn?: boolean;
}

export const ApplicationStatusHero = ({ application, checkedAt, onResubmit, signedIn = false }: ApplicationStatusHeroProps) => {
  if (application.status === "SUSPENDED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <WarningAmberOutlined className="mt-0.5 shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900">Tài khoản đối tác đang tạm ngưng</p>
            <p className="text-sm text-slate-600">{application.rejectReason ?? "Cơ sở lưu trú tạm ngưng hiển thị trên MeGo. Vui lòng liên hệ chuyên viên để được hỗ trợ kích hoạt lại."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (application.status === "REJECTED") {
    const notes = (application.rejectReason ?? "Hồ sơ chưa đạt yêu cầu. Vui lòng liên hệ chuyên viên để biết chi tiết.").split("\n").filter(Boolean);
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <WarningAmberOutlined className="mt-0.5 shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900">Hồ sơ cần bổ sung thông tin</p>
            <p className="text-sm text-slate-600">Chuyên viên thẩm định đã tạm dừng hồ sơ cho đến khi bạn cập nhật các mục sau:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
            <button type="button" onClick={onResubmit} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">
              <EditNoteOutlined sx={{ fontSize: 19 }} /> Bổ sung hồ sơ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (application.status === "APPROVED") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <TaskAltOutlined className="mt-0.5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-slate-900">Hồ sơ đã được phê duyệt</p>
            <p className="text-sm text-slate-600">
              Tài khoản Extranet đã được kích hoạt cho <strong>{application.email}</strong>. Đăng nhập để thiết lập loại phòng, giá và bắt đầu nhận đặt phòng.
            </p>
            <Link to={signedIn ? "/partner/dashboard" : "/partner/login"} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <LoginOutlined sx={{ fontSize: 18 }} /> {signedIn ? "Vào trang quản trị" : "Đăng nhập Extranet"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const elapsed = getElapsedHours(application, checkedAt);
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#004CCD] dark:text-blue-300">
          <HourglassTopOutlined />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-white px-2 py-0.5 font-bold text-teal-700">SLA CAM KẾT 24 GIỜ</span>
            <span className="text-slate-500">Đã xử lý: <strong className="text-slate-700">{elapsed}/24 giờ</strong></span>
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">Hồ sơ đang được xét duyệt</p>
        </div>
      </div>
      <div className="sm:text-right">
        <p className="text-xs text-slate-500">Dự kiến hoàn tất</p>
        <p className="text-xl font-extrabold text-[#004CCD] dark:text-blue-300">{formatTime(application.slaDueAt)} · {formatDayMonth(application.slaDueAt)}</p>
      </div>
    </div>
  );
};

export default ApplicationStatusHero;
