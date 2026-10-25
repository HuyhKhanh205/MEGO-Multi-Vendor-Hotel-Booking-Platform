import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

export const AdminLayout: React.FC = () => {
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
        pendingPartnersCount={4}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        <AdminHeader onToggleSidebar={() => setSidebarOpenMobile(!sidebarOpenMobile)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
