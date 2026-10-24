import type { RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CustomerHome from "../modules/customer/pages/CustomerHome";
import BookingForm from "../modules/customer/pages/BookingForm";
import Payment from "../modules/customer/pages/Payment";
import PaymentResult from "../modules/customer/pages/PaymentResult";

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
        path: "bookingform",
        element: <BookingForm />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "payment-result",
        element: <PaymentResult />,
      },
    ],
  },
];
