import type { RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CustomerHome from "../modules/customer/pages/CustomerHome";
import BookingForm from "../modules/customer/pages/BookingForm";

export const customerRoutes: RouteObject[] = [
  {
    path: "/customer",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <CustomerHome />,
      },
      {
        index: true,
        path:"bookingform",
        element: <BookingForm />,
      },
    ],
  },
];
