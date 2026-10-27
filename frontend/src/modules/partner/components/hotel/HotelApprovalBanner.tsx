import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import HourglassTopOutlined from "@mui/icons-material/HourglassTopOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import type { HotelDto } from "../../types/backend.types";

/** Trạng thái duyệt khách sạn (hotel_hotels.approval_status) và lý do nếu bị từ chối / tạm ngưng. */
export const HotelApprovalBanner = ({ hotel }: { hotel: HotelDto }) => {
  if (hotel.approvalStatus === "APPROVED") {
    return (
      <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircleOutlineOutlined sx={{ fontSize: 15 }} />
        Đã duyệt · {hotel.active ? "Đang hiển thị trên MeGo" : "Đang ẩn khỏi MeGo"}
      </p>
    );
  }

  const pending = hotel.approvalStatus === "PENDING";
  const Icon = pending ? HourglassTopOutlined : WarningAmberOutlined;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${pending ? "border-blue-200 bg-blue-50 text-slate-700" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
      <Icon sx={{ fontSize: 20 }} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-bold">
          {pending ? "Thay đổi đang chờ MeGo duyệt" : hotel.approvalStatus === "SUSPENDED" ? "Khách sạn đang bị tạm ngưng" : "Khách sạn chưa được duyệt"}
        </p>
        {hotel.rejectReason && <p className="mt-0.5">{hotel.rejectReason}</p>}
      </div>
    </div>
  );
};

export default HotelApprovalBanner;
