import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../stores/store";
import type { User } from "../stores/authSlice";

type UserRole = NonNullable<User["role"]>;

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  /** Role hoặc danh sách role được phép truy cập */
  allowedRole?: UserRole;
  allowedRoles?: UserRole[];
  /** Đường dẫn trang login tương ứng khi chưa đăng nhập hoặc sai role */
  loginPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
  allowedRoles,
  loginPath,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const requiredRoles: UserRole[] = allowedRoles
    ? allowedRoles
    : allowedRole
      ? [allowedRole]
      : [];

  const resolvedLoginPath =
    loginPath ??
    (requiredRoles.includes("ADMIN")
      ? "/admin/login"
      : requiredRoles.includes("PARTNER")
        ? "/partner/login"
        : "/login");

  const fullPath = location.pathname + location.search;

  // Chưa đăng nhập → chuyển về trang đăng nhập tương ứng
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`${resolvedLoginPath}?redirect=${encodeURIComponent(fullPath)}`}
        replace
        state={{ from: fullPath }}
      />
    );
  }

  // Đã đăng nhập nhưng không đúng role được phép → chuyển về trang đăng nhập của phân hệ đó
  if (
    requiredRoles.length > 0 &&
    (!user.role || !requiredRoles.includes(user.role))
  ) {
    return (
      <Navigate
        to={resolvedLoginPath}
        replace
        state={{ from: fullPath }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
