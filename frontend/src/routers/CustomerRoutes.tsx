import type { RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CustomerHome from "../modules/customer/pages/CustomerHome";

export const customerRoutes: RouteObject[] = [
  {
    path: "/customer",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CustomerHome />,
      },
    ],
  },
];
