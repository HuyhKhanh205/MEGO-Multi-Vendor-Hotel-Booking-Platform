import { Link } from "react-router-dom";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import { PARTNER_HOTLINE, PARTNER_HOTLINE_HREF, PARTNER_PORTAL_VERSION } from "../../data/partnerMock";

export const PartnerFooter = () => (
  <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-500 sm:px-6">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span>© {new Date().getFullYear()} MeGo.</span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircleOutlineOutlined sx={{ fontSize: 15 }} className="text-emerald-500" />
          Certified OTA 2-Way Synchronization Standard
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link to="/policies/terms" className="hover:text-[#1677FF]">Điều khoản dịch vụ B2B</Link>
        <Link to="/policies/privacy" className="hover:text-[#1677FF]">Chính sách bảo mật</Link>
        <a href={PARTNER_HOTLINE_HREF} className="inline-flex items-center gap-1.5 hover:text-[#1677FF]">
          <HeadsetMicOutlined sx={{ fontSize: 15 }} /> Hotline hỗ trợ: <strong className="text-[#1677FF]">{PARTNER_HOTLINE}</strong>
        </a>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px]">{PARTNER_PORTAL_VERSION}</span>
      </div>
    </div>
  </footer>
);

export default PartnerFooter;
