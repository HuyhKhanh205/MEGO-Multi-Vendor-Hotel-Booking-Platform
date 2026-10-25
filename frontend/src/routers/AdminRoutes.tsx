/* eslint react-refresh/only-export-components: off */
import { lazy, Suspense, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import AdminLayout from "../modules/admin/components/layout/AdminLayout";

const AdminHome = lazy(() => import("../modules/admin/pages/AdminHome"));
const AdminUsersPage = lazy(() => import("../modules/admin/pages/AdminUsersPage"));
const AdminRolesPage = lazy(() => import("../modules/admin/pages/AdminRolesPage"));
const AdminFinancePage = lazy(() => import("../modules/admin/pages/AdminFinancePage"));
const AdminPartnersPage = lazy(() => import("../modules/admin/pages/AdminPartnersPage"));
const AdminHotelsPage = lazy(() => import("../modules/admin/pages/AdminHotelsPage"));
const AdminBookingsPage = lazy(() => import("../modules/admin/pages/AdminBookingsPage"));
const AdminPromotionsPage = lazy(() => import("../modules/admin/pages/AdminPromotionsPage"));
const AdminReviewsPage = lazy(() => import("../modules/admin/pages/AdminReviewsPage"));
const AdminAuditLogsPage = lazy(() => import("../modules/admin/pages/AdminAuditLogsPage"));
const AdminLoginPage = lazy(() => import("../modules/admin/pages/AdminLoginPage"));

const adminFallback = (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <CircularProgress size={36} sx={{ color: "#1677FF" }} />
      <span className="text-xs font-semibold text-slate-400">Đang tải dữ liệu phân hệ Admin...</span>
    </div>
  </div>
);

const page = (element: ReactNode) => (
  <Suspense fallback={adminFallback}>{element}</Suspense>
);

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/login",
    element: page(<AdminLoginPage />),
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: page(<AdminHome />) },
      { path: "partners", element: page(<AdminPartnersPage />) },
      { path: "hotels", element: page(<AdminHotelsPage />) },
      { path: "users", element: page(<AdminUsersPage />) },
      { path: "roles", element: page(<AdminRolesPage />) },
      { path: "bookings", element: page(<AdminBookingsPage />) },
      { path: "promotions", element: page(<AdminPromotionsPage />) },
      { path: "finance", element: page(<AdminFinancePage />) },
      { path: "reports", element: page(<AdminFinancePage />) },
      { path: "reviews", element: page(<AdminReviewsPage />) },
      { path: "audit-logs", element: page(<AdminAuditLogsPage />) },
    ],
  },
];
