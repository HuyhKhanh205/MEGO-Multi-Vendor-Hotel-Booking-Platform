/* eslint react-refresh/only-export-components: off */
import { lazy, Suspense, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import PartnerGuard from "../modules/partner/components/PartnerGuard";
import PartnerLayout from "../modules/partner/components/layout/PartnerLayout";

const PartnerLoginPage = lazy(() => import("../modules/partner/pages/PartnerLoginPage"));
const PartnerRegisterPage = lazy(() => import("../modules/partner/pages/PartnerRegisterPage"));
const PartnerApplicationStatusPage = lazy(() => import("../modules/partner/pages/PartnerApplicationStatusPage"));
const PartnerHome = lazy(() => import("../modules/partner/pages/PartnerHome"));
const PartnerComingSoon = lazy(() => import("../modules/partner/pages/PartnerComingSoon"));

const partnerFallback = <div className="flex min-h-64 items-center justify-center"><CircularProgress aria-label="Đang tải trang" /></div>;
const page = (element: ReactNode) => <Suspense fallback={partnerFallback}>{element}</Suspense>;

export const partnerRoutes: RouteObject[] = [
  {
    path: "/partner/login",
    element: page(<PartnerLoginPage />),
  },
  {
    path: "/partner/register",
    element: page(<PartnerRegisterPage />),
  },
  {
    path: "/partner/register/status",
    element: page(<PartnerApplicationStatusPage />),
  },
  {
    path: "/partner",
    element: (
      <PartnerGuard>
        <PartnerLayout />
      </PartnerGuard>
    ),
    children: [
      { index: true, element: page(<PartnerHome />) },
      { path: "*", element: page(<PartnerComingSoon />) },
    ],
  },
];
