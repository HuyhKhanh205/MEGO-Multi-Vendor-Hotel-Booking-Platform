import React from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./headerData";
import type { NavItem } from "./types";

interface HeaderNavProps {
  className?: string;
  items?: NavItem[];
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  className = "",
  items = NAV_ITEMS,
}) => {
  return (
    <nav
      aria-label="Điều hướng chính"
      className={`flex items-center space-x-1 lg:space-x-2 xl:space-x-4 ${className}`}
    >
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `relative py-5 px-2.5 lg:px-3 text-[13.5px] transition-colors duration-150 inline-flex items-center select-none font-sans whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md ${
              isActive
                ? "text-[#1677FF] font-semibold"
                : "text-gray-600 hover:text-[#1677FF] font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-2.5 right-2.5 lg:left-3 lg:right-3 h-[2.5px] bg-[#1677FF] rounded-full transition-all duration-200"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default HeaderNav;
