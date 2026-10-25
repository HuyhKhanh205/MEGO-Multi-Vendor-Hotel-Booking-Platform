import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../headerCustomer/header";
import Footer from "../footerCustomer/footer";

export const MainLayout: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col text-slate-800 dark:text-[var(--text-primary)]"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
