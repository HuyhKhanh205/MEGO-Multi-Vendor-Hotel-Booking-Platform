import React from "react";

interface HeaderLogoProps {
  className?: string;
}

export const HeaderLogo: React.FC<HeaderLogoProps> = ({
  className = "",
}) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Cuộn mượt về đầu trang hiện tại (không chuyển trang hoặc tải lại)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleLogoClick}
      aria-label="MeGo - Cuộn về đầu trang"
      title="Cuộn về đầu trang"
      className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1
        transition-all duration-150 hover:opacity-85 active:scale-95 cursor-pointer bg-transparent border-none ${className}`}
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
    </button>
  );
};

export default HeaderLogo;
