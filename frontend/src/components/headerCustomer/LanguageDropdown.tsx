
import React, { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "./headerData";

import type { Language } from "./types";

interface LanguageDropdownProps {
  className?: string;
  onLanguageChange?: (language: Language) => void;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  className = "",
  onLanguageChange,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Chọn ngôn ngữ, hiện tại là ${selectedLanguage.code}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[13px] font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100/70 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        {/* Globe icon */}
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9"
          />
        </svg>

        <span className="font-semibold text-gray-800">
          {selectedLanguage.code}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Chọn ngôn ngữ"
          className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            Chọn ngôn ngữ
          </div>

          {LANGUAGES.map((language) => {
            const isSelected =
              language.code === selectedLanguage.code;

            return (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(language)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left hover:bg-blue-50/70 transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-[#1677FF] font-semibold"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 text-center">
                    {language.flag}
                  </span>
                  <span>{language.name}</span>
                </div>

                {isSelected && (
                  <svg
                    className="w-4 h-4 text-[#1677FF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
