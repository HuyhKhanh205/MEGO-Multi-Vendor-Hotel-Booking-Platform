import { useRoutes } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import { adminRoutes } from "./AdminRoutes";
import { customerRoutes } from "./CustomerRoutes";
import { partnerRoutes } from "./PartnerRoutes";
import { guestRoutes } from "./GuestRoutes";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const AppRoutes = () => {
  const routing = useRoutes([
    ...adminRoutes,
    ...customerRoutes,
    ...partnerRoutes,
    ...guestRoutes,
  ]);

  return (
    <>
      {/* <Header /> */}
      <ScrollToTop />
      {routing}
      {/* <Footer /> */}
    </>
  );
};

export default AppRoutes;
