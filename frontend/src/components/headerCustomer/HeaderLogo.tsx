import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Đang ở trang chủ: chỉ cuộn lên đầu, không tải lại
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Ở trang khác: điều hướng về trang chủ + cuộn lên đầu
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <a
      href="/"
      onClick={handleLogoClick}
      aria-label="MeGo - Về trang chủ"
      className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1
        transition-all duration-150 hover:opacity-85 active:scale-95 cursor-pointer ${className}`}
    >
      {/* Brand Logo Image */}
      <div className="relative flex items-center justify-center">
        <img
          src="/assets/logo.png"
          alt="MeGo Logo"
          className="w-15 h-15 object-contain rounded-lg"
          draggable={false}
        />
      </div>
    </a>
  );
};

export default HeaderLogo;
