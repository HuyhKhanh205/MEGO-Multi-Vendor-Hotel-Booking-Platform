import React from "react";
import { Link } from "react-router-dom";
import type { FooterColumnData } from "./types";

interface FooterLinkColumnProps {
  data: FooterColumnData;
  className?: string;
}

export const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({
  data,
  className = "",
}) => {
  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Column Title */}
      <h3 className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider text-gray-800">
        {data.title}
      </h3>

      {/* Semantic Links List */}
      <nav aria-label={data.title}>
        <ul className="space-y-2">
          {data.links.map((link) => (
            <li key={link.id}>
              <Link
                to={link.path}
                className="inline-block text-[12px] sm:text-[12.5px] text-[#64748B] hover:text-[#1677FF] transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FooterLinkColumn;
