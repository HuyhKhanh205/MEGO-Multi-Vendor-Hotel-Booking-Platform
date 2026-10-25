import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../stores/store";

/** Chỉ cho tài khoản role PARTNER vào cổng đối tác. */
export const PartnerGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || user?.role !== "PARTNER") {
    const fullPath = location.pathname + location.search;
    return <Navigate to={`/partner/login?redirect=${encodeURIComponent(fullPath)}`} replace />;
  }

  return <>{children}</>;
};

export default PartnerGuard;
