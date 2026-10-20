import React from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderNav from "./HeaderNav";
import HeaderSearch from "./HeaderSearch";
import HeaderActions from "./HeaderActions";
import MobileNavigation from "./MobileNavigation";

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  className = "",
  showSearch = true,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] shadow-xs transition-all duration-200 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-3 sm:gap-4 lg:gap-6">
          {/* Group 1: Logo & Primary Desktop Navigation */}
          <div className="flex items-center gap-4 lg:gap-7 shrink-0">
            <HeaderLogo />

            {/* Desktop Navigation Menu (Order: Khám phá, Khách sạn, Ưu đãi, Đặt chỗ của tôi) */}
            <HeaderNav className="hidden lg:flex" />
          </div>

          {/* Group 2: Center Search Bar (Navigates to /hotels?keyword=...) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
              <HeaderSearch />
            </div>
          )}

          {/* Group 3: Right Area (Currency, Support badge 3, Notification red dot, Login/Register buttons) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderActions className="hidden sm:flex" />

            {/* Mobile Actions: compact auth buttons + mobile drawer toggle on very small screens */}
            <div className="flex sm:hidden items-center gap-1.5">
              <HeaderActions className="flex sm:hidden [&>*:not(:last-child)]:hidden" />
            </div>

            {/* Mobile Menu Hamburger (for tablets & mobile < lg) */}
            <MobileNavigation />
          </div>
        </div>

        {/* Mobile Search Row (for small screens < md) */}
        {showSearch && (
          <div className="block md:hidden pb-3 pt-0.5">
            <HeaderSearch />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
