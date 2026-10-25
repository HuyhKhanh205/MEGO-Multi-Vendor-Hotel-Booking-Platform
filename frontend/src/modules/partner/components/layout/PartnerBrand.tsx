import { Link } from "react-router-dom";

interface PartnerBrandProps {
  to?: string;
  className?: string;
}

export const PartnerBrand = ({ to = "/partner", className = "" }: PartnerBrandProps) => (
  <Link to={to} className={`inline-flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`} aria-label="MeGo Partner – về trang tổng quan">
    <img src="/assets/logo.png" alt="MeGo" className="h-9 w-9 rounded-lg object-contain" draggable={false} />
    <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-extrabold tracking-wider text-[#004CCD]">PARTNER</span>
  </Link>
);

export default PartnerBrand;
