import { useRoutes } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import { adminRoutes } from "./AdminRoutes";
import { customerRoutes } from "./CustomerRoutes";
import { partnerRoutes } from "./PartnerRoutes";
import { guestRoutes } from "./GuestRoutes";

const AppRoutes = () => {
  const routing = useRoutes([
    ...adminRoutes,
    ...customerRoutes,
    ...partnerRoutes,
    ...guestRoutes,
  ]);

  return (
    <>
      <ScrollToTop />
      {routing}
    </>
  );
};

export default AppRoutes;
