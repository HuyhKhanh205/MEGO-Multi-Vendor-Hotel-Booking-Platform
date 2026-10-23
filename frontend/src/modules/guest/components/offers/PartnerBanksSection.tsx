import React, { useState } from "react";
import { toast } from "react-toastify";
import { FINANCIAL_PARTNERS } from "./offersData";

export const PartnerBanksSection: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedCode(code);
      toast.success(`Đã sao chép mã đối tác: ${code}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error(`Không thể sao chép mã: ${code}`);
    }
  };

  return (
    <section className="w-full bg-surface-container-low py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Ưu Đãi Đối Tác Tài Chính
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Giảm thêm cùng lúc với các chương trình khuyến mãi khi thanh toán qua thẻ ngân hàng và ví đối tác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FINANCIAL_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="p-6 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-base sm:text-lg font-bold ${partner.partnerColorClass}`}>
                    {partner.partnerName}
                  </span>
                  <span className={`${partner.badgeBgClass} text-[11px] font-bold px-2 py-0.5 rounded`}>
                    {partner.badge}
                  </span>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-bold text-on-surface">
                    {partner.discountTitle}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {partner.description}
                  </p>

                  {partner.promoCode && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-surface-container px-2.5 py-1 rounded-md text-primary">
                        {partner.promoCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(partner.promoCode!)}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedCode === partner.promoCode ? "done" : "content_copy"}
                        </span>
                        <span>{copiedCode === partner.promoCode ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant pt-2 border-t border-slate-100">
                {partner.terms}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerBanksSection;
