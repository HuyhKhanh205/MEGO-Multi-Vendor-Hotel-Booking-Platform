import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../../../stores/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../stores/store";
import PartnerFooter from "./PartnerFooter";
import PartnerHotelProvider from "./PartnerHotelProvider";
import PartnerSidebar from "./PartnerSidebar";
import PartnerTopbar from "./PartnerTopbar";

export const PartnerLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.auth.user?.name ?? "Đối tác MeGo");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Bạn đã đăng xuất khỏi cổng đối tác.");
    navigate("/partner/login", { replace: true });
  };

  return (
    <PartnerHotelProvider>
      <div className="flex min-h-screen bg-[#F4F6FC] text-slate-800">
        <PartnerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
        <div className="flex min-w-0 flex-1 flex-col">
          <PartnerTopbar userName={userName} onOpenSidebar={() => setSidebarOpen(true)} onLogout={handleLogout} />
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
          <PartnerFooter />
        </div>
      </div>
    </PartnerHotelProvider>
  );
};

export default PartnerLayout;
