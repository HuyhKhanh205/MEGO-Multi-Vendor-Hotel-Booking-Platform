import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress } from "@mui/material";
import type { CustomerData, CustomerProfile } from "../types/customer.types";
import { customerApiMethods } from "../services/customerApi";
import { useAppDispatch } from "../../../stores/store";
import { logout } from "../../../stores/authSlice";

export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </header>
  );
}
export function EmptyState({
  title,
  action = "Khám phá khách sạn",
  to = "/hotels",
}: {
  title: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-slate-600">{title}</p>
      <Button component={Link} to={to} sx={{ mt: 2 }}>
        {action}
      </Button>
    </div>
  );
}
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" onClick={onRetry}>
          Thử lại
        </Button>
      }
    >
      Không thể tải dữ liệu. Vui lòng thử lại.
    </Alert>
  );
}
export function LoadingState() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <CircularProgress aria-label="Đang tải" />
    </div>
  );
}
export function AccountLayout({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    let active = true;
    void Promise.all([
      customerApiMethods.getProfile(),
      customerApiMethods.getData(),
    ])
      .then(([value, data]: [CustomerProfile, CustomerData]) => {
        if (active) {
          setProfile(value);
          setPoints(data.loyalty.points);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  const links = [
    ["♙ Hồ sơ cá nhân", "/customer/profile"],
    ["▣ Đơn đặt phòng", "/customer/bookings"],
    ["♡ Danh sách yêu thích", "/customer/wishlist"],
    ["✧ Điểm thưởng & Voucher", "/customer/loyalty"],
    ["◉ Đổi mật khẩu", "/customer/change-password"],
    ["▱ Phương thức thanh toán", "/customer/payment-methods"],
  ];
  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-3 py-6 text-slate-800 sm:px-5 md:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
      <aside className="hidden space-y-4 md:block">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="h-14 bg-gradient-to-r from-blue-100 to-cyan-50" />
          <div className="px-4 pb-4 text-center">
            <img
              src={
                profile?.avatarUrl ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
              }
              alt="Ảnh đại diện"
              className="mx-auto -mt-8 h-16 w-16 rounded-full border-4 border-white object-cover"
            />
            <p className="mt-1 font-bold">
              {profile?.fullName || "Tài khoản MeGo"}
            </p>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              ⭐ MEGO CLUB MEMBER
            </span>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-xs">
              <span>
                Điểm tích lũy
                <br />
                <b className="text-blue-700">
                  {points.toLocaleString("vi-VN")} pts
                </b>
              </span>
              <Link className="text-blue-700" to="/customer/loyalty">
                Xem ví›
              </Link>
            </div>
          </div>
        </div>
        <nav
          aria-label="Tài khoản"
          className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm"
        >
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `mb-1 block rounded-lg px-3 py-2 text-xs ${isActive ? "border-l-2 border-blue-600 bg-blue-50 font-semibold text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="block w-full border-t border-slate-100 px-3 py-3 text-left text-xs text-red-600"
          >
            ↪ Đăng xuất
          </button>
        </nav>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-4 text-xs">
          <b>◉ Hỗ trợ riêng 24/7</b>
          <p className="mt-1 text-slate-600">
            Chuyên viên hỗ trợ dành cho thành viên.
          </p>
          <strong className="mt-2 block text-lg text-blue-700">
            1900 1234
          </strong>
        </div>
      </aside>
      <div className="md:hidden">
        <nav
          aria-label="Tài khoản"
          className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm"
        >
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-xs ${isActive ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-600"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <section className="min-w-0">{children}</section>
    </main>
  );
}
export const panelClass =
  "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm";
