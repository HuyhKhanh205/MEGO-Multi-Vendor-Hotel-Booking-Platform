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
        <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1677FF] transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm điểm đến hoặc khách sạn..."
          className="w-full h-[38px] pl-10 pr-9 text-[13.5px] text-gray-800 placeholder-gray-400 bg-[#F3F6FA] hover:bg-[#eaf0f8] focus:bg-white rounded-full border border-transparent focus:border-[#1677FF] focus:ring-3 focus:ring-blue-100/80 outline-none transition-all duration-200"
        />

        {/* Clear Button */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Xóa từ khóa tìm kiếm"
            className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
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
        )}
      </div>
    </form>
  );
};

export default HeaderSearch;
