import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface HeaderSearchProps {
  className?: string;
  onSearchSubmit?: () => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = "",
  onSearchSubmit,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramKeyword = searchParams.get("keyword") || "";
  const [prevParam, setPrevParam] = useState(paramKeyword);
  const [keyword, setKeyword] = useState<string>(paramKeyword);

  if (paramKeyword !== prevParam) {
    setPrevParam(paramKeyword);
    setKeyword(paramKeyword);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/hotels?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/hotels");
    }
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <form
      role="search"
      aria-label="Tìm kiếm điểm đến hoặc khách sạn"
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full transition-all duration-200 ${className}`}
    >
      <div className="relative w-full flex items-center group">
        {/* Search Icon */}
        <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1677FF] transition-colors dark:text-[var(--text-placeholder)] dark:group-focus-within:text-[var(--brand-primary)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm điểm đến hoặc khách sạn..."
          className="w-full h-[38px] pl-10 pr-9 text-[13.5px] outline-none transition-all duration-200 rounded-full border
            text-gray-800 placeholder-gray-400 bg-[#F3F6FA] hover:bg-[#eaf0f8] focus:bg-white border-transparent focus:border-[#1677FF] focus:ring-3 focus:ring-blue-100/80
            dark:text-[var(--text-primary)] dark:placeholder-[var(--text-placeholder)] dark:bg-[var(--bg-input)] dark:hover:bg-[var(--bg-surface-elevated)] dark:focus:bg-[var(--bg-surface-elevated)] dark:border-[var(--border-default)] dark:focus:border-[var(--brand-primary)] dark:focus:ring-[var(--brand-primary)]/20"
        />

        {/* Clear Button */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Xóa từ khóa tìm kiếm"
            className="absolute right-3 p-0.5 rounded-full transition-colors
              text-gray-400 hover:text-gray-600 hover:bg-gray-200
              dark:text-[var(--text-muted)] dark:hover:text-[var(--text-secondary)] dark:hover:bg-[var(--bg-surface-hover)]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default HeaderSearch;
