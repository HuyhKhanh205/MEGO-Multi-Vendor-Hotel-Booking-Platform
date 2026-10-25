import { useEffect, useState } from "react";
import {
  CardGiftcardOutlined,
  CheckCircleOutlined,
  ContentCopyOutlined,
  InfoOutlined,
  LocalDiningOutlined,
  PercentOutlined,
  SpaOutlined,
  StarOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  AccountLayout,
  EmptyState,
  LoadingState,
  panelClass,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerData, RewardVoucher } from "../types/customer.types";
import { formatDate } from "../utils/formatters";

const benefitIcons = [PercentOutlined, LocalDiningOutlined, SpaOutlined];

export default function LoyaltyRewardsPage() {
  const [data, setData] = useState<CustomerData | null>(null);
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<RewardVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    customerApiMethods
      .getData()
      .then(setData)
      .catch(() => setError("Không thể tải điểm thưởng."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    customerApiMethods
      .getData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError("Không thể tải điểm thưởng.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const redeem = async () => {
    if (!selected) return;
    try {
      await customerApiMethods.redeemVoucher(selected.id);
      toast.success("Đã đổi ưu đãi thành công.");
      setSelected(null);
      load();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Không thể đổi ưu đãi.");
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className={panelClass}>
          <LoadingState />
        </div>
      </AccountLayout>
    );
  }

  if (error || !data) {
    return (
      <AccountLayout>
        <div className={`${panelClass} text-center`}>
          <p role="alert" className="text-red-600">{error || "Không có dữ liệu."}</p>
          <Button onClick={load} sx={{ mt: 2 }} variant="outlined">Thử lại</Button>
        </div>
      </AccountLayout>
    );
  }

  const loyalty = data.loyalty;
  const tier = loyalty.tierBenefits.find((item) => item.tier === loyalty.tier);
  const nextTier = loyalty.tierBenefits.find((item) => item.minPoints > loyalty.points);
  const progress = Math.min(
    100,
    (loyalty.points / Math.max(loyalty.nextTierPoints, 1)) * 100,
  );
  const pointsToNextTier = Math.max(0, loyalty.nextTierPoints - loyalty.points);

  return (
    <AccountLayout>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Điểm thưởng & Hạng thành viên
        </h1>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          <InfoOutlined sx={{ fontSize: 15 }} />
          Quy chế tích điểm & điều khoản
        </button>
      </header>

      <section className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-[#f8d57b] via-[#eab34b] to-[#b97809] p-5 text-[#44270a] shadow-lg shadow-amber-900/15 sm:p-7">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                <StarOutlined sx={{ fontSize: 20 }} />
                <span className="rounded-full bg-[#c6922f] px-3 py-1 text-[10px] shadow-inner">
                  Mego {tier?.name ?? loyalty.tier} Member
                </span>
                <span className="text-[#704612]">•</span>
                <span className="text-[#704612]">Hội viên VIP thân thiết</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <strong className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  {loyalty.points.toLocaleString("vi-VN")}
                </strong>
                <span className="text-lg font-bold text-[#44270a]">MeGoPoints</span>
              </div>
              <p className="mt-1 max-w-md text-xs text-[#704612]">
                Tương đương {(loyalty.points * 100).toLocaleString("vi-VN")} VND giá trị trừ trực tiếp khi thanh toán đơn phòng.
              </p>
            </div>
            <div className="min-w-40 rounded-xl border border-[#a86f13]/40 bg-[#c58d2b]/45 px-5 py-3 text-center shadow-inner">
              <p className="text-[9px] font-bold uppercase tracking-wider">Mã thẻ thành viên</p>
              <p className="mt-1 text-lg font-black tracking-widest text-slate-950">MG-8899-VIP</p>
              <p className="mt-1 text-[9px] text-[#704612]">Hiệu lực đến: 31/12/2026</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#a66b0d]/35 p-4">
            <div className="flex flex-wrap justify-between gap-2 text-xs font-semibold">
              <span>↑ Tiến trình nâng hạng thẻ {nextTier?.name ?? "tiếp theo"}</span>
              <span>Còn {pointsToNextTier.toLocaleString("vi-VN")} Points để lên hạng {nextTier?.name ?? "tiếp theo"} ({loyalty.nextTierPoints.toLocaleString("vi-VN")} pts)</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#8c5708]/70">
              <div className="h-full rounded-full bg-[#fff0ad] shadow-sm transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-medium">
              <span>● {tier?.name ?? loyalty.tier}<small className="block text-[#704612]">{tier?.minPoints ?? 0} pts (Đã đạt)</small></span>
              <span className="rounded-full bg-[#f7dda0] px-2 py-1 font-bold">⚑ {nextTier?.name ?? "Mục tiêu"}</span>
              <span className="text-right">Diamond Elite<small className="block text-[#704612]">10.000 pts</small></span>
            </div>
          </div>

          <h2 className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
            <SpaOutlined sx={{ fontSize: 16 }} />
            Đặc quyền hiện tại của hạng {tier?.name ?? loyalty.tier}:
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(tier?.benefits.length ? tier.benefits : ["Giảm 10% trực tiếp", "Buffet sáng miễn phí", "Check-in sớm & Trễ"]).slice(0, 3).map((benefit, index) => {
              const Icon = benefitIcons[index] ?? CheckCircleOutlined;
              return (
                <div key={benefit} className="rounded-xl border border-white/35 bg-white/30 p-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6f3b00] text-white">
                    <Icon sx={{ fontSize: 17 }} />
                  </span>
                  <p className="mt-2 text-xs font-bold">{benefit}</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#704612]">
                    Đặc quyền dành riêng cho thành viên MeGo.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-slate-100 bg-white px-2 shadow-sm">
        <Tabs value={tab} onChange={(_, value: number) => setTab(value)} variant="scrollable">
          <Tab label="Đổi ưu đãi" />
          <Tab label="Lịch sử điểm" />
          <Tab label="Ưu đãi của tôi" />
        </Tabs>
      </div>

      {tab === 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {data.vouchers.map((voucher) => (
            <article key={voucher.id} className={`${panelClass} border-amber-100`}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-slate-900">{voucher.name}</h2>
                <CardGiftcardOutlined className="text-amber-500" />
              </div>
              <p className="mt-1 text-sm text-slate-500">{voucher.condition} · Hạn {formatDate(voucher.expiresAt)}</p>
              <p className="my-4 font-semibold text-[#0F62FE]">{voucher.points.toLocaleString("vi-VN")} điểm</p>
              {loyalty.points < voucher.points && <p className="mb-2 text-xs text-red-600">Số điểm hiện tại không đủ</p>}
              <Button disabled={loyalty.points < voucher.points} variant="contained" onClick={() => setSelected(voucher)} sx={{ borderRadius: "8px", backgroundColor: "#0F62FE" }}>
                Đổi ưu đãi
              </Button>
            </article>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm">
          {loyalty.pointHistory.map((row) => (
            <div key={row.id} className="flex justify-between border-b border-slate-100 p-4 text-sm last:border-0">
              <span>{formatDate(row.date)} · {row.reason}<small className="block text-slate-500">{row.bookingCode}</small></span>
              <strong className={row.points < 0 ? "text-red-600" : "text-emerald-700"}>{row.points > 0 ? "+" : ""}{row.points}</strong>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (data.myVouchers.length ? (
        <div className="mt-4 space-y-3">
          {data.myVouchers.map((voucher) => (
            <article key={voucher.code} className={`${panelClass} flex flex-wrap items-center justify-between gap-3`}>
              <div><strong>{voucher.name}</strong><p className="text-sm text-slate-500">Mã {voucher.code} · Hạn {formatDate(voucher.expiresAt)} · {voucher.status === "ACTIVE" ? "Còn hiệu lực" : "Đã sử dụng"}</p></div>
              <Button onClick={() => { void navigator.clipboard.writeText(voucher.code); toast.success("Đã sao chép mã."); }} startIcon={<ContentCopyOutlined />}>Sao chép</Button>
            </article>
          ))}
        </div>
      ) : <EmptyState title="Bạn chưa đổi ưu đãi nào." />)}

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)}>
        <DialogTitle>Xác nhận đổi ưu đãi</DialogTitle>
        <DialogContent><p>{selected?.name}</p><p>Điểm hiện tại: {loyalty.points} → sau đổi: {loyalty.points - (selected?.points ?? 0)}</p></DialogContent>
        <DialogActions><Button onClick={() => setSelected(null)}>Để sau</Button><Button onClick={() => void redeem()} variant="contained">Xác nhận đổi</Button></DialogActions>
      </Dialog>
    </AccountLayout>
  );
}
