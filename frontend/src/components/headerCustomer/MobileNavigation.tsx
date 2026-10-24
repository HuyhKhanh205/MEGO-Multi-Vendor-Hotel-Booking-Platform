import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./headerData";
import HeaderSearch from "./HeaderSearch";
import ThemeToggle from "./ThemeToggle";
import { useAppSelector, useAppDispatch } from "../../stores/store";
import { logout } from "../../stores/authSlice";

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

  return (
    <div className={`lg:hidden ${className}`}>
      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Mở menu điều hướng"
        aria-expanded={isOpen}
        className="p-2 -mr-1 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          text-gray-700 hover:text-blue-600 dark:text-[var(--icon-default)] dark:hover:text-[var(--brand-primary)] dark:hover:bg-[var(--bg-surface-hover)]"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-surface)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu trên di động"
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-[#1677FF]">Me</span>
            <span
              className="text-lg font-black"
              style={{ color: "var(--text-primary)" }}
            >
              Go
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium ml-1 text-[#1677FF]"
              style={{ backgroundColor: "var(--brand-primary-bg)" }}
            >
              Hotel
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme Toggle trong mobile drawer */}
            <ThemeToggle />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng menu"
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-[var(--bg-surface-hover)]"
              style={{ color: "var(--text-muted)" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mobile Search */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Tìm kiếm nhanh
            </p>
            <HeaderSearch onSearchSubmit={handleClose} />
          </div>

          {/* Navigation Links */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Menu chính
            </p>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#1677FF] font-semibold dark:bg-[var(--brand-primary-bg)] dark:text-[var(--brand-primary)]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#1677FF] dark:text-[var(--text-secondary)] dark:hover:bg-[var(--bg-surface-hover)] dark:hover:text-[var(--brand-primary)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] dark:bg-[var(--brand-primary)]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Account / Auth Section */}
          <div
            className="pt-2 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Tài khoản
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold rounded-xl transition-colors
                    text-[#1677FF] bg-white border border-[#1677FF]/40 hover:bg-blue-50
                    dark:bg-[var(--bg-surface)] dark:text-[var(--brand-primary)] dark:border-[var(--brand-primary)]/40 dark:hover:bg-[var(--brand-primary-bg)]"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white rounded-xl transition-colors shadow-xs
                    bg-[#1677FF] hover:bg-blue-700
                    dark:bg-[var(--brand-primary)] dark:hover:bg-[var(--brand-primary-hover)]"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className="flex items-center gap-3 p-2 rounded-xl"
                  style={{ backgroundColor: "var(--bg-muted)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user?.name || "Người dùng"}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {user?.email || "user@mego.vn"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/customer"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                    text-gray-700 hover:bg-blue-50 hover:text-blue-600
                    dark:text-[var(--text-secondary)] dark:hover:bg-[var(--brand-primary-bg)] dark:hover:text-[var(--brand-primary)]"
                >
                  Trang cá nhân
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                    text-gray-700 hover:bg-blue-50 hover:text-blue-600
                    dark:text-[var(--text-secondary)] dark:hover:bg-[var(--brand-primary-bg)] dark:hover:text-[var(--brand-primary)]"
                >
                  Đặt chỗ của tôi
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left
                    dark:hover:bg-red-900/20"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Quick Support */}
          <div
            className="pt-2 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Hỗ trợ 24/7
            </p>
            <div
              className="p-3 rounded-xl space-y-1.5 text-xs"
              style={{
                backgroundColor: "var(--brand-primary-bg)",
                color: "var(--text-secondary)",
              }}
            >
              <p>
                Hotline:{" "}
                <strong style={{ color: "var(--text-primary)" }}>1900 6868</strong>
              </p>
              <p>
                Email:{" "}
                <strong style={{ color: "var(--text-primary)" }}>support@mego.vn</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
