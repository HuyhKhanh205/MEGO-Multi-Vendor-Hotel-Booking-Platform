import { useCallback, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddBusinessOutlined from "@mui/icons-material/AddBusinessOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import StarRounded from "@mui/icons-material/StarRounded";
import { MOCK_NOTIFICATIONS, PARTNER_DEMO_ACCOUNT } from "../../data/partnerMock";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { PartnerHotel } from "../../types/partner.types";

type OpenMenu = "hotel" | "notifications" | "account" | null;

interface PartnerTopbarProps {
  userName: string;
  onOpenSidebar: () => void;
  onLogout: () => void;
}

const HotelBadge = ({ hotel }: { hotel: PartnerHotel }) => (
  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-[#004CCD]">
    {hotel.name.split(" ").slice(0, 2).map((word) => word[0]).join("")}
  </span>
);

export const PartnerTopbar = ({ userName, onOpenSidebar, onLogout }: PartnerTopbarProps) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const hotelRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpenMenu(null), []);

  useClickOutside(hotelRef, openMenu === "hotel", close);
  useClickOutside(notificationRef, openMenu === "notifications", close);
  useClickOutside(accountRef, openMenu === "account", close);

  const toggle = (menu: Exclude<OpenMenu, null>) => setOpenMenu((current) => (current === menu ? null : menu));
  const unreadCount = notifications.filter((item) => item.unread).length;
  const hotel = PARTNER_DEMO_ACCOUNT.hotels[0];

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const keyword = query.trim();
    if (!keyword) return;
    navigate(`/partner/bookings?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button type="button" onClick={onOpenSidebar} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Mở menu">
        <MenuOutlined fontSize="small" />
      </button>

      {/* Chọn cơ sở lưu trú */}
      <div ref={hotelRef} className="relative min-w-0">
        <button
          type="button"
          onClick={() => toggle("hotel")}
          aria-expanded={openMenu === "hotel"}
          className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-2.5 text-left hover:bg-slate-50"
        >
          <HotelBadge hotel={hotel} />
          <span className="hidden min-w-0 sm:block">
            <span className="flex items-center gap-1 truncate text-sm font-bold text-slate-900">
              {hotel.name}
              <span className="flex text-amber-400" aria-label={`${hotel.stars} sao`}>
                {Array.from({ length: hotel.stars }, (_, index) => <StarRounded key={index} sx={{ fontSize: 13 }} />)}
              </span>
            </span>
            <span className="block truncate text-[11px] text-slate-500">Mã CS: #{hotel.code} • {hotel.city}</span>
          </span>
          <KeyboardArrowDownOutlined sx={{ fontSize: 18 }} className="text-slate-400" />
        </button>
        {openMenu === "hotel" && (
          <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Cơ sở bạn quản lý</p>
            {PARTNER_DEMO_ACCOUNT.hotels.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl bg-blue-50/60 px-3 py-2">
                <HotelBadge hotel={item} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{item.name}</span>
                  <span className="block text-[11px] text-slate-500">#{item.code} • {item.city}</span>
                </span>
                <CheckRounded sx={{ fontSize: 18 }} className="text-[#1677FF]" />
              </div>
            ))}
            <button
              type="button"
              onClick={() => { close(); toast.info("Đăng ký thêm cơ sở lưu trú sẽ có khi luồng Onboarding hoàn thành."); }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#1677FF] hover:bg-slate-50"
            >
              <AddBusinessOutlined sx={{ fontSize: 18 }} /> Thêm cơ sở mới
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="ml-auto hidden w-full max-w-xs md:block" role="search">
        <label className="relative block">
          <span className="sr-only">Tìm mã booking hoặc tên khách</span>
          <SearchOutlined sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm mã booking, tên khách..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </form>

      {/* Thông báo */}
      <div ref={notificationRef} className="relative ml-auto md:ml-0">
        <button
          type="button"
          onClick={() => toggle("notifications")}
          aria-expanded={openMenu === "notifications"}
          aria-label={`Thông báo (${unreadCount} chưa đọc)`}
          className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100"
        >
          <NotificationsNoneOutlined fontSize="small" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {openMenu === "notifications" && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">Thông báo</p>
              <button
                type="button"
                disabled={unreadCount === 0}
                onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
                className="text-xs font-semibold text-[#1677FF] hover:underline disabled:text-slate-300 disabled:no-underline"
              >
                Đánh dấu đã đọc
              </button>
            </div>
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {notifications.map((item) => (
                <li key={item.id} className={`flex gap-3 px-4 py-3 ${item.unread ? "bg-blue-50/40" : ""}`}>
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.unread ? "bg-[#1677FF]" : "bg-transparent"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                    <span className="block truncate text-xs text-slate-500">{item.description}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tài khoản */}
      <div ref={accountRef} className="relative">
        <button
          type="button"
          onClick={() => toggle("account")}
          aria-expanded={openMenu === "account"}
          className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004CCD] text-xs font-bold text-white">{PARTNER_DEMO_ACCOUNT.avatarInitials}</span>
          <span className="hidden text-left xl:block">
            <span className="block whitespace-nowrap text-sm font-bold text-slate-900">{userName}</span>
            <span className="block whitespace-nowrap text-[11px] text-slate-500">{PARTNER_DEMO_ACCOUNT.title}</span>
          </span>
          <KeyboardArrowDownOutlined sx={{ fontSize: 18 }} className="hidden text-slate-400 xl:block" />
        </button>
        {openMenu === "account" && (
          <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
            <div className="border-b border-slate-100 px-3 pb-3 pt-1">
              <p className="text-sm font-bold text-slate-900">{userName}</p>
              <p className="truncate text-xs text-slate-500">{PARTNER_DEMO_ACCOUNT.email}</p>
            </div>
            <button
              type="button"
              onClick={() => { close(); navigate("/partner/staff"); }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <PersonOutlineOutlined sx={{ fontSize: 18 }} /> Hồ sơ & bảo mật
            </button>
            <button
              type="button"
              onClick={() => { close(); onLogout(); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogoutOutlined sx={{ fontSize: 18 }} /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PartnerTopbar;
