import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./headerData";
import HeaderSearch from "./HeaderSearch";
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
        className="p-2 -mr-1 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
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
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu trên di động"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-[#1677FF]">Me</span>
            <span className="text-lg font-black text-gray-900">Go</span>
            <span className="text-xs bg-blue-50 text-[#1677FF] px-2 py-0.5 rounded-full font-medium ml-1">
              Hotel
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng menu"
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Mobile Search */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Tìm kiếm nhanh
            </p>
            <HeaderSearch onSearchSubmit={handleClose} />
          </div>

          {/* Navigation Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                        ? "bg-blue-50 text-[#1677FF] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#1677FF]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Account / Auth Section */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tài khoản
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-[#1677FF] bg-white border border-[#1677FF]/40 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.name || "Người dùng"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || "user@mego.vn"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/customer/profile"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Trang cá nhân
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  Đặt chỗ của tôi
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Quick Support */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Hỗ trợ 24/7
            </p>
            <div className="p-3 bg-blue-50/50 rounded-xl space-y-1.5 text-xs text-gray-600">
              <p>Hotline: <strong className="text-gray-900">1900 6868</strong></p>
              <p>Email: <strong className="text-gray-900">support@mego.vn</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
