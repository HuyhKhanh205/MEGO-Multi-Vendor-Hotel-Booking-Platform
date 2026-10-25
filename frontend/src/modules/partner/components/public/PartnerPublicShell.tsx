import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF, PARTNER_PORTAL_VERSION } from "../../data/partnerMock";
import PartnerBrand from "../layout/PartnerBrand";

interface PartnerPublicShellProps {
  children: ReactNode;
  /** Nút / link ở góc phải header (VD: "Đăng nhập", "Đăng ký hợp tác") */
  headerAction?: ReactNode;
}

/** Khung chung cho các trang công khai của cổng đối tác: đăng nhập, đăng ký, theo dõi hồ sơ. */
export const PartnerPublicShell = ({ children, headerAction }: PartnerPublicShellProps) => (
  <div className="flex min-h-screen flex-col bg-[#F4F6FC] text-slate-800">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8">
        <PartnerBrand to="/partner/login" />
        {headerAction}
      </div>
    </header>

    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>

    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 sm:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>© {new Date().getFullYear()} MeGo.</span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircleOutlineOutlined sx={{ fontSize: 15 }} className="text-emerald-500" />
            Certified OTA 2-Way Synchronization Standard
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/policies/terms" className="hover:text-[#1677FF]">Điều khoản Đối tác MeGo</Link>
          <Link to="/policies/privacy" className="hover:text-[#1677FF]">Chính sách Bảo mật</Link>
          <a href={PARTNER_HOTLINE_HREF} className="inline-flex items-center gap-1.5 hover:text-[#1677FF]">
            <HeadsetMicOutlined sx={{ fontSize: 15 }} /> Hotline hỗ trợ: <strong className="text-[#1677FF]">{PARTNER_HOTLINE}</strong>
          </a>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px]">{PARTNER_PORTAL_VERSION}</span>
        </div>
      </div>
    </footer>
  </div>
);

export default PartnerPublicShell;
