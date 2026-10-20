import type { RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import GuestHome from "../modules/guest/pages/GuestHome";
import HotelsPage from "../modules/guest/pages/HotelsPage";
import ExplorePage from "../modules/guest/pages/ExplorePage";
import OffersPage from "../modules/guest/pages/OffersPage";
import MyBookingsPage from "../modules/guest/pages/MyBookingsPage";
import LoginPage from "../modules/guest/pages/LoginPage";
import RegisterPage from "../modules/guest/pages/RegisterPage";
import SupportPage from "../modules/guest/pages/SupportPage";
import PolicyPage from "../modules/guest/pages/PolicyPage";
import SitemapPage from "../modules/guest/pages/SitemapPage";

export const guestRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <GuestHome />,
      },
      {
        path: "explore",
        element: <ExplorePage />,
      },
      {
        path: "hotels",
        element: <HotelsPage />,
      },
      {
        path: "offers",
        element: <OffersPage />,
      },
      {
        path: "my-bookings",
        element: <MyBookingsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
      {
        path: "policies/:policyId",
        element: <PolicyPage />,
      },
      {
        path: "sitemap",
        element: <SitemapPage />,
      },
    ],
  },
];
