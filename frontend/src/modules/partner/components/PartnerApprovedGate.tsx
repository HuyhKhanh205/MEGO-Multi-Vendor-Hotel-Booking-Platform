import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../stores/store";

const PARTNER_APPLICATION_STATUS_PATH = "/partner/register/status";

/**
 * Chặn đối tác chưa được duyệt (PENDING / REJECTED / SUSPENDED / chưa có hồ sơ) vào trang quản trị;
 * họ chỉ xem được trang Theo dõi hồ sơ. Nhân viên đối tác (PARTNER_STAFF) không có trạng thái duyệt riêng.
 * Dùng bên trong ProtectedRoute (đã kiểm tra đăng nhập + role).
 */
export const PartnerApprovedGate = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);
  if (user?.role === "PARTNER" && user.approvalStatus !== "APPROVED") {
    return <Navigate to={PARTNER_APPLICATION_STATUS_PATH} replace />;
  }
  return <>{children}</>;
};

export default PartnerApprovedGate;
