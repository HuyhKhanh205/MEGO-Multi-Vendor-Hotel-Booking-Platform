import { Navigate, type RouteObject } from "react-router-dom";
import PartnerHome from "../modules/partner/pages/PartnerHome";
import PartnerLoginPage from "../modules/partner/pages/PartnerLoginPage";
import ProtectedRoute from "./ProtectedRoute";

export const partnerRoutes: RouteObject[] = [
  {
    path: "/partner/login",
    element: <PartnerLoginPage />,
  },
  {
    path: "/partner",
    element: (
      <ProtectedRoute
        allowedRoles={["PARTNER"]}
        loginPath="/partner/login"
      />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/partner/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <PartnerHome />,
      },
      {
        path: "*",
        element: <PartnerHome />,
      },
    ],
  },
];
