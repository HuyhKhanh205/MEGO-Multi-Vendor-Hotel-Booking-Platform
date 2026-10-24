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
      className={`sticky top-0 z-40 w-full border-b shadow-xs transition-all duration-200 ${className}`}
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--header-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-3 sm:gap-4 lg:gap-6">
          {/* Group 1: Logo & Primary Desktop Navigation */}
          <div className="flex items-center gap-4 lg:gap-7 shrink-0">
            <HeaderLogo />

            {/* Desktop Navigation Menu */}
            <HeaderNav className="hidden lg:flex" />
          </div>

          {/* Group 2: Center Search Bar */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
              <HeaderSearch />
            </div>
          )}

          {/* Group 3: Right Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <HeaderActions className="hidden sm:flex" />

            {/* Mobile Actions: compact */}
            <div className="flex sm:hidden items-center gap-1.5">
              <HeaderActions className="flex sm:hidden [&>*:not(:last-child)]:hidden" />
            </div>

            {/* Mobile Menu Hamburger */}
            <MobileNavigation />
          </div>
        </div>

        {/* Mobile Search Row */}
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
