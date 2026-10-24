/* eslint react-refresh/only-export-components: off */
import { lazy, Suspense, type ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import MainLayout from "../components/layout/MainLayout";

const CustomerHome = lazy(() => import("../modules/customer/pages/CustomerHome"));
const BookingForm = lazy(() => import("../modules/customer/pages/BookingForm"));
const Payment = lazy(() => import("../modules/customer/pages/Payment"));
const PaymentResult = lazy(() => import("../modules/customer/pages/PaymentResult"));
const ProfilePage = lazy(() => import("../modules/customer/pages/CustomerProfilePage"));
const PasswordPage = lazy(() => import("../modules/customer/pages/ChangePasswordPage"));
const PaymentMethodsPage = lazy(() => import("../modules/customer/pages/SavedPaymentMethodsPage"));
const BookingsPage = lazy(() => import("../modules/customer/pages/MyBookingsPage"));
const BookingDetailPage = lazy(() => import("../modules/customer/pages/BookingDetailPage"));
const WishlistPage = lazy(() => import("../modules/customer/pages/WishlistPage"));
const LoyaltyPage = lazy(() => import("../modules/customer/pages/LoyaltyRewardsPage"));

const customerFallback = <div className="flex min-h-64 items-center justify-center"><CircularProgress aria-label="Đang tải trang" /></div>;
const page = (element: ReactNode) => <Suspense fallback={customerFallback}>{element}</Suspense>;

export const customerRoutes: RouteObject[] = [
  {
    path: "/customer",
    element: <MainLayout />,
    children: [
      { index: true, element: page(<CustomerHome />) },
      { path: "bookingform", element: page(<BookingForm />) },
      { path: "payment", element: page(<Payment />) },
      { path: "payment/:bookingId", element: page(<Payment />) },
      { path: "payment-result", element: page(<PaymentResult />) },
      { path: "profile", element: page(<ProfilePage />) },
      { path: "change-password", element: page(<PasswordPage />) },
      { path: "payment-methods", element: page(<PaymentMethodsPage />) },
      { path: "bookings", element: page(<BookingsPage />) },
      { path: "bookings/:bookingId", element: page(<BookingDetailPage />) },
      { path: "wishlist", element: page(<WishlistPage />) },
      { path: "loyalty", element: page(<LoyaltyPage />) },
    ],
  },
];
