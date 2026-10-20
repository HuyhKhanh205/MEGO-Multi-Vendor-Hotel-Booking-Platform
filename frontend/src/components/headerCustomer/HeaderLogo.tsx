import React from "react";
import { Link } from "react-router-dom";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  className = "",
}) => {
  return (
    <Link
      to="/"
      aria-label="MeGo - Về trang chủ"
      className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1 transition-transform active:scale-95 ${className}`}
    >
      {/* Brand Logo Image */}
      <div className="relative flex items-center justify-center">
        <img
          src="/assets/logo.png"
          alt="MeGo Logo"
          className="w-15 h-15 object-contain rounded-lg"
        />
      </div>

    </Link>
  );
};

export default HeaderLogo;