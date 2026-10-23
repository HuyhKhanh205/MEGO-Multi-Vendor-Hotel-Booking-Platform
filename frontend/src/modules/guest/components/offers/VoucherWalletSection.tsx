import React, { useState } from "react";
import { toast } from "react-toastify";
import { PLATFORM_VOUCHERS } from "./offersData";
import type { PlatformVoucherItem } from "./types";

interface VoucherWalletSectionProps {
  vouchers?: PlatformVoucherItem[];
}

export const VoucherWalletSection: React.FC<VoucherWalletSectionProps> = ({
  vouchers = PLATFORM_VOUCHERS,
}) => {
  const [savedCodes, setSavedCodes] = useState<Set<string>>(() => new Set());
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
      toast.success(`Đã sao chép mã: ${code}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error(`Không thể sao chép tự động mã: ${code}`);
    }
  };

  const handleToggleSave = (code: string) => {
    setSavedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
        toast.info(`Đã bỏ lưu voucher ${code} khỏi ví`);
      } else {
        next.add(code);
        toast.success(`Đã thêm voucher ${code} vào ví MeGo của bạn!`);
      }
      return next;
    });
  };

  const handleSaveAll = () => {
    const all = new Set(vouchers.map((v) => v.code));
    setSavedCodes(all);
    toast.success(`Đã lưu toàn bộ ${vouchers.length} mã ưu đãi vào Ví thành công!`);
  };

  const areAllSaved = vouchers.length > 0 && vouchers.every((v) => savedCodes.has(v.code));

  return (
    <section className="w-full bg-surface-container-low py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header with Title and "Lưu tất cả" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                Kho Voucher Giảm Giá Nền Tảng
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Lưu ngay mã ưu đãi vào Ví cá nhân để tự động áp dụng mức giá tốt nhất khi thanh toán.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 self-start md:self-auto transition-all cursor-pointer ${
              areAllSaved
                ? "bg-primary text-on-primary"
                : "bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {areAllSaved ? "done" : "done_all"}
            </span>
            <span>{areAllSaved ? "Đã lưu tất cả mã!" : "Lưu tất cả mã vào ví"}</span>
          </button>
        </div>

        {/* Ticket Styled Voucher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vouchers.map((voucher) => {
            const isSaved = savedCodes.has(voucher.code);
            const isCopied = copiedCode === voucher.code;

            return (
              <div
                key={voucher.id}
                className="relative bg-surface-container-lowest rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`${voucher.tagBgClass} ${voucher.tagTextClass} text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase`}
                    >
                      {voucher.tag}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {voucher.expiryDate}
                    </span>
                  </div>

                  <div>
                    <p className="text-xl sm:text-2xl font-black text-primary">
                      {voucher.discountTitle}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {voucher.description}
                    </p>
                  </div>

                  {/* Code box */}
                  <div
                    onClick={() => handleCopyCode(voucher.code)}
                    className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors group"
                    title="Click để sao chép mã"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                        MÃ CODE
                      </span>
                      <span className="text-sm sm:text-base font-bold text-on-surface tracking-wider font-mono">
                        {voucher.code}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-tertiary font-semibold">
                        {voucher.remainingText}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary">
                        {isCopied ? "check" : "content_copy"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSave(voucher.code)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSaved
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface-container hover:bg-primary hover:text-on-primary text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSaved ? "bookmark_added" : "bookmark_add"}
                    </span>
                    <span>{isSaved ? "Đã lưu vào ví" : "Lưu vào ví"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparent Note */}
        <p className="mt-6 text-[11px] text-on-surface-variant text-center">
          * Voucher lưu vào ví được đồng bộ với tài khoản đặt phòng và sẽ tự động được kiểm tra điều kiện áp dụng tại bước thanh toán.
        </p>
      </div>
    </section>
  );
};

export default VoucherWalletSection;
