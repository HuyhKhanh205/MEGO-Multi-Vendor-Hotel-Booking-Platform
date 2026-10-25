import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import ConstructionOutlined from "@mui/icons-material/ConstructionOutlined";
import { findPartnerNavItem, PARTNER_HOME_PATH } from "../components/layout/partnerNav";

/** Trang tạm cho các mục cổng đối tác chưa được xây dựng. */
export const PartnerComingSoon = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const section = pathname.split("/").slice(0, 3).join("/");
  const navItem = findPartnerNavItem(section);
  const keyword = searchParams.get("q");
  const title = navItem?.label ?? "Tính năng";

  useEffect(() => {
    document.title = `${title} | MeGo Partner`;
  }, [title]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1677FF]">
        <ConstructionOutlined sx={{ fontSize: 30 }} />
      </span>
      <h1 className="text-xl font-extrabold text-slate-900">{title} đang được xây dựng</h1>
      <p className="text-sm leading-relaxed text-slate-500">
        Màn hình này đã có trong thiết kế và sẽ sớm được triển khai.
        {keyword && <> Kết quả tìm kiếm cho “<strong className="text-slate-700">{keyword}</strong>” sẽ hiển thị tại đây.</>}
      </p>
      <Link to={PARTNER_HOME_PATH} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
        Về trang Tổng quan <ArrowForwardOutlined sx={{ fontSize: 17 }} />
      </Link>
    </div>
  );
};

export default PartnerComingSoon;
