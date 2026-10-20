import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CurrencyDropdown from "./LanguageDropdown";
import SupportPopover from "./SupportPopover";
import NotificationPopover from "./NotificationPopover";
import { useAppSelector, useAppDispatch } from "../../stores/store";
import { logout } from "../../stores/authSlice";

interface HeaderActionsProps {
  className?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0 ${className}`}>
      {/* 1. Đơn vị tiền tệ */}
      <CurrencyDropdown />

      <div className="hidden sm:block w-px h-5 bg-gray-200 mx-0.5" aria-hidden="true" />

      {/* 2. Hỗ trợ / Liên hệ (với badge số 3) */}
      <SupportPopover />

      {/* 3. Thông báo (với chấm đỏ) */}
      <NotificationPopover />

      <div className="w-px h-5 bg-gray-200 mx-0.5" aria-hidden="true" />

      {/* 4. Khu vực tài khoản: Đăng nhập / Đăng ký (Thay thế hoàn toàn VIP Gold) */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-2">
          {/* Nút Đăng nhập */}
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-[13.5px] font-semibold text-[#1677FF] bg-white border border-[#1677FF]/40 hover:bg-blue-50/70 hover:border-[#1677FF] rounded-[10px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap active:scale-[0.98]"
          >
            Đăng nhập
          </Link>

          {/* Nút Đăng ký */}
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-4 py-1.5 text-[13.5px] font-semibold text-white bg-[#1677FF] hover:bg-[#0f62d4] active:bg-[#0950b7] rounded-[10px] shadow-xs hover:shadow transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap active:scale-[0.98]"
          >
            Đăng ký
          </Link>
        </div>
      ) : (
        /* Khu vực tài khoản khi ĐÃ ĐĂNG NHẬP */
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-expanded={isUserMenuOpen}
            aria-label="Menu tài khoản người dùng"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <span className="text-[13px] font-semibold text-gray-800 max-w-[100px] truncate hidden md:inline-block">
              {user?.name || "Tài khoản"}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-[13.5px] font-bold text-gray-900 truncate">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
                  {user?.email || "user@mego.vn"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/customer"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Trang cá nhân
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Đặt chỗ của tôi
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderActions;
