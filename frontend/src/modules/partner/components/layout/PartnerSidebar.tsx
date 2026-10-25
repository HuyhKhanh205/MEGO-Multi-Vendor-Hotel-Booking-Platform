import { NavLink } from "react-router-dom";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import PartnerBrand from "./PartnerBrand";
import { PARTNER_HOME_PATH, PARTNER_NAV, type PartnerNavBadgeTone } from "./partnerNav";

const badgeTone: Record<PartnerNavBadgeTone, string> = {
  blue: "bg-blue-100 text-[#004CCD]",
  red: "bg-red-100 text-red-600",
  green: "text-emerald-600",
  slate: "text-slate-500",
};

interface PartnerSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const PartnerSidebar = ({ open, onClose, onLogout }: PartnerSidebarProps) => (
  <>
    {/* Lớp phủ cho drawer trên mobile */}
    <div
      className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      aria-label="Điều hướng cổng đối tác"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5">
        <PartnerBrand />
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Đóng menu">
          <CloseOutlined fontSize="small" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {PARTNER_NAV.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, path, icon: Icon, badge }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === PARTNER_HOME_PATH}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? "bg-[#1677FF] text-white shadow-sm shadow-blue-500/30" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon sx={{ fontSize: 19 }} />
                        <span className="flex-1 truncate">{label}</span>
                        {badge && (
                          <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : badgeTone[badge.tone]}`}>
                            {badge.text}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Ở môi trường dev chừa chỗ cho nút "Switch Role" cố định ở góc trái dưới (App.tsx) */}
      <div className={`shrink-0 border-t border-slate-100 p-3 ${import.meta.env.DEV ? "pb-16" : ""}`}>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogoutOutlined sx={{ fontSize: 19 }} />
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>
    </aside>
  </>
);

export default PartnerSidebar;
