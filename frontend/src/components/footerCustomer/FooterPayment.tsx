import React from "react";
import { PAYMENT_SECURITY_DATA } from "./footerData";

interface FooterPaymentProps {
  className?: string;
}

export const FooterPayment: React.FC<FooterPaymentProps> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Title */}
      <h3 className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider text-gray-800">
        {PAYMENT_SECURITY_DATA.title}
      </h3>

      {/* Security Description */}
      <p className="text-[12px] text-[#64748B] leading-relaxed">
        {PAYMENT_SECURITY_DATA.description}
      </p>

      {/* Payment Badges arranged in rows */}
      <div className="space-y-1.5 pt-1">
        {PAYMENT_SECURITY_DATA.rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex flex-wrap items-center gap-1.5">
            {row.map((badge) => (
              <span
                key={badge.id}
                className="inline-flex items-center justify-center px-2.5 py-1 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wide text-[#2C3E50] bg-[#E8EEF8] rounded select-none hover:bg-[#dce6f5] transition-colors"
              >
                {badge.label}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Production Disclaimer Note */}
      {PAYMENT_SECURITY_DATA.disclaimer && (
        <p className="text-[10px] text-gray-400 italic pt-1 leading-normal">
          * {PAYMENT_SECURITY_DATA.disclaimer}
        </p>
      )}
    </div>
  );
};

export default FooterPayment;
