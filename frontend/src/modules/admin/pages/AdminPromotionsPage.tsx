import React, { useState } from "react";
import { toast } from "react-toastify";

interface CampaignItem {
  id: string;
  code: string;
  name: string;
  tierBadge?: string;
  scopeBadge: string;
  discountType: "percent" | "fixed";
  discountDisplay: string;
  discountMaxDisplay?: string;
  minSpendDisplay: string;
  usageCount: number;
  usageLimit: number;
  usagePercent: number;
  budgetUsedDisplay: string;
  budgetTotalDisplay: string;
  warningAlert?: string;
  status: "active" | "scheduled" | "paused";
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: "c-01",
    code: "MEGOCLUBVIP",
    name: "Tri ân Hội viên MeGo Club VIP",
    tierBadge: "Gold / Platinum",
    scopeBadge: "Đặc quyền VIP • Toàn quốc",
    discountType: "percent",
    discountDisplay: "Giảm 20%",
    discountMaxDisplay: "Tối đa 1.000.000đ",
    minSpendDisplay: "Từ 3.000.000đ (Khách sạn 4* - 5*)",
    usageCount: 1200,
    usageLimit: 2000,
    usagePercent: 60.0,
    budgetUsedDisplay: "850 Tr",
    budgetTotalDisplay: "1.5 Tỷ",
    status: "active",
  },
  {
    id: "c-02",
    code: "FLASHWEEKEND",
    name: "Flash Sale Cuối Tuần Bùng Nổ",
    tierBadge: "Flash Sale 48H",
    scopeBadge: "Mọi khách hàng • Cháy kho nhanh",
    discountType: "fixed",
    discountDisplay: "Giảm 250.000đ",
    discountMaxDisplay: "Cố định tiền mặt",
    minSpendDisplay: "Từ 1.200.000đ (Check-in Thứ 6 - CN)",
    usageCount: 9980,
    usageLimit: 10000,
    usagePercent: 99.8,
    budgetUsedDisplay: "2.49 Tỷ",
    budgetTotalDisplay: "2.5 Tỷ",
    warningAlert: "Cảnh báo: Sắp hết lượt!",
    status: "active",
  },
  {
    id: "c-03",
    code: "STAYCATION50K",
    name: "Ưu đãi Đặt Phòng Homestay & Boutique",
    tierBadge: "Nội thành Hà Nội & HCM",
    scopeBadge: "Đơn trong ngày / Staycation",
    discountType: "fixed",
    discountDisplay: "Giảm 50.000đ",
    discountMaxDisplay: "Cố định / đơn",
    minSpendDisplay: "Từ 800.000đ (Áp dụng Homestay)",
    usageCount: 490,
    usageLimit: 1000,
    usagePercent: 49.0,
    budgetUsedDisplay: "22.5 Tr",
    budgetTotalDisplay: "50 Tr",
    status: "active",
  },
  {
    id: "c-04",
    code: "AUTUMNLUXURY",
    name: "Mùa Thu Vàng Nghỉ Dưỡng Cao Cấp",
    tierBadge: "Chiến dịch Q4",
    scopeBadge: "Resort & Spa 5 Sao",
    discountType: "percent",
    discountDisplay: "Giảm 18%",
    discountMaxDisplay: "Tối đa 2.000.000đ",
    minSpendDisplay: "Từ 5.000.000đ (Gói nghỉ dưỡng cao cấp)",
    usageCount: 0,
    usageLimit: 3000,
    usagePercent: 0,
    budgetUsedDisplay: "0 đ",
    budgetTotalDisplay: "3.0 Tỷ",
    status: "scheduled",
  },
];

export const AdminPromotionsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Modal Form State
  const [formCode, setFormCode] = useState("MEGOMATION2026");
  const [formName, setFormName] = useState("Chiến dịch Khám phá Biển đảo Mùa Hè 2026");
  const [formDiscountType, setFormDiscountType] = useState<"percent" | "fixed">("percent");
  const [formPercent, setFormPercent] = useState("15");
  const [formMaxDiscount, setFormMaxDiscount] = useState("500.000");
  const [formMinOrder, setFormMinOrder] = useState("1.200.000");
  const [formBudget, setFormBudget] = useState("1.500.000.000");
  const [formTarget, setFormTarget] = useState<"all" | "vip" | "new">("all");

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: CampaignItem = {
      id: `c-${Date.now()}`,
      code: formCode.toUpperCase().trim(),
      name: formName,
      tierBadge: "Chiến dịch mới",
      scopeBadge: formTarget === "vip" ? "Đặc quyền VIP" : formTarget === "new" ? "Khách hàng mới" : "Toàn quốc",
      discountType: formDiscountType,
      discountDisplay: formDiscountType === "percent" ? `Giảm ${formPercent}%` : `Giảm ${formMaxDiscount} đ`,
      discountMaxDisplay: formDiscountType === "percent" ? `Tối đa ${formMaxDiscount} đ` : "Cố định / đơn",
      minSpendDisplay: `Từ ${formMinOrder} đ`,
      usageCount: 0,
      usageLimit: 3000,
      usagePercent: 0,
      budgetUsedDisplay: "0 đ",
      budgetTotalDisplay: "1.5 Tỷ",
      status: "active",
    };

    setCampaigns([newCampaign, ...campaigns]);
    toast.success(`Đã phát hành Voucher "${formCode.toUpperCase()}" toàn sàn thành công!`);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Kinh doanh &amp; Tài chính &gt; Quản lý Khuyến mại Toàn sàn (P43)
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Khuyến mại Nền tảng Toàn sàn
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Voucher &amp; Campaigns P43
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập chiến dịch kích cầu, phân bổ quỹ ngân sách tài trợ 100% từ sàn MeGo và kiểm soát gian lận đặt phòng chéo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+</span>
          <span>Tạo Voucher Sàn mới</span>
        </button>
      </div>

      {/* Top Banner Rate Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">TỶ LỆ KÉO BOOKING MỚI</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">32.6%</span>
            <span className="text-xs font-bold text-emerald-600">+4.1% MoM</span>
          </div>
          <span className="text-[11px] text-slate-500">Doanh thu kéo theo: <strong>89.2 Tỷ VND</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Lọc theo mã:</span>
          <input
            type="text"
            placeholder="Nhập mã voucher..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
          />
        </div>
      </div>

      {/* Campaigns Table matching Image 3 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã Voucher &amp; Chiến dịch</th>
                <th className="py-3.5 px-4 font-semibold">Phạm vi áp dụng</th>
                <th className="py-3.5 px-4 font-semibold">Mức giảm giá</th>
                <th className="py-3.5 px-4 font-semibold">Điều kiện đơn tối thiểu</th>
                <th className="py-3.5 px-4 font-semibold">Tiến độ lượt dùng</th>
                <th className="py-3.5 px-4 text-right font-semibold">Ngân sách sàn cấp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Voucher code & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.code}
                      </span>
                      {c.tierBadge && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {c.tierBadge}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 mt-1">{c.name}</div>
                  </td>

                  {/* Scope */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {c.scopeBadge}
                    </span>
                  </td>

                  {/* Discount value */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-blue-700">{c.discountDisplay}</div>
                    <div className="text-[11px] text-slate-400">{c.discountMaxDisplay}</div>
                  </td>

                  {/* Min spend */}
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {c.minSpendDisplay}
                  </td>

                  {/* Usage Progress */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">
                        {c.usageCount.toLocaleString("vi-VN")} / {c.usageLimit.toLocaleString("vi-VN")} lượt
                      </span>
                      <span className={`font-bold ${c.usagePercent > 90 ? "text-rose-600" : "text-slate-600"}`}>
                        {c.usagePercent}%
                      </span>
                    </div>
                    <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          c.usagePercent > 90 ? "bg-rose-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${Math.min(c.usagePercent, 100)}%` }}
                      ></div>
                    </div>
                    {c.warningAlert && (
                      <span className="text-[10px] font-bold text-rose-600 mt-1 block">
                        {c.warningAlert}
                      </span>
                    )}
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-bold text-slate-900">
                      {c.budgetUsedDisplay} / {c.budgetTotalDisplay}
                    </div>
                    <span className="text-[10px] text-slate-400">Giải ngân</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Hiển thị 1 - {campaigns.length} của 24 chiến dịch toàn sàn • 100% ngân sách do MeGo bảo lãnh</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Phân bổ Ngân sách (Left) + Quy tắc Phòng chống Gian lận (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Budget allocation */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Phân bổ Ngân sách Trợ giá theo Danh mục Khách sạn
              </h3>
              <p className="text-xs text-slate-400">Tỷ lệ trợ giá hấp thụ trong 90 ngày qua trên toàn bộ 63 tỉnh thành</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
              Q3/2026 Actual
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Resort &amp; KS 5*</span>
                <span className="text-xs font-bold text-blue-600">52%</span>
              </div>
              <div className="text-lg font-black text-slate-900">6.50 Tỷ VND</div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Boutique &amp; City 3-4*</span>
                <span className="text-xs font-bold text-teal-600">33%</span>
              </div>
              <div className="text-lg font-black text-slate-900">4.12 Tỷ VND</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Homestay &amp; Villa</span>
                <span className="text-xs font-bold text-amber-600">15%</span>
              </div>
              <div className="text-lg font-black text-slate-900">1.88 Tỷ VND</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <span>ℹ️</span>
            <span>Tất cả khoản tài trợ khấu trừ trực tiếp vào hóa đơn thanh toán cho khách, không ảnh hưởng doanh thu thực nhận của đối tác khách sạn.</span>
          </div>
        </div>

        {/* Right Card: Anti-fraud Rules */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Quy tắc Phòng chống Gian lận</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active 100%
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <span className="text-blue-600 font-bold">1</span>
              <div>
                <strong className="text-slate-900 block">1 Tài khoản / 1 Thiết bị duy nhất</strong>
                <span className="text-slate-500 text-[11px]">Khóa nhận tự động nếu phát hiện clone tài khoản sử dụng chung Device ID hoặc IP.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <span className="text-blue-600 font-bold">2</span>
              <div>
                <strong className="text-slate-900 block">Rate Limiting Token</strong>
                <span className="text-slate-500 text-[11px]">Giới hạn 1 voucher / 1 giao dịch thành công trong 24 giờ cho cùng 1 SĐT.</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <span className="text-blue-600 font-bold">3</span>
              <div>
                <strong className="text-slate-900 block">Tự động ngắt khi chạm hạn mức</strong>
                <span className="text-slate-500 text-[11px]">Chiến dịch tức thời chuyển sang trạng thái tạm dừng khi cán mốc 100% ngân sách.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL THIẾT LẬP VOUCHER MỚI (Figma Image 3) ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm shadow-blue-500/20">
                  🎟️
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Thiết lập Voucher Sàn MeGo Mới
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ngân sách chiến dịch do nền tảng MeGo tài trợ 100% cho du khách
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateVoucher} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              {/* Code & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Mã Voucher <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    required
                    placeholder="VD: MEGOSUMMER2026"
                    className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-xl font-mono font-bold text-blue-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-[10px] text-slate-400">Tự động viết hoa không dấu</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Tên Chiến dịch Khuyến mãi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="VD: Chiến dịch Khám phá Biển đảo..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-[10px] text-slate-400">Hiển thị trên toàn bộ touchpoint</span>
                </div>
              </div>

              {/* Loại hình giảm giá */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Loại hình Giảm giá <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col ${
                      formDiscountType === "percent"
                        ? "border-blue-600 bg-blue-50/40 text-blue-900 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Giảm theo phần trăm (%)</span>
                      <input
                        type="radio"
                        name="discType"
                        checked={formDiscountType === "percent"}
                        onChange={() => setFormDiscountType("percent")}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">Khấu trừ tỷ lệ % trên tổng tiền phòng</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col ${
                      formDiscountType === "fixed"
                        ? "border-blue-600 bg-blue-50/40 text-blue-900 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>Giảm số tiền cố định (VND)</span>
                      <input
                        type="radio"
                        name="discType"
                        checked={formDiscountType === "fixed"}
                        onChange={() => setFormDiscountType("fixed")}
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">Trừ trực tiếp số tiền cụ thể vào booking</span>
                  </label>
                </div>
              </div>

              {/* Percent & Max amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Phần trăm Giảm (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formPercent}
                      onChange={(e) => setFormPercent(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Khuyến nghị: 10% - 25%</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Mức giảm tối đa (VND / đơn) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value)}
                      className="w-full px-3 py-2 pr-12 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">VND</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Giới hạn mức trần bảo vệ ngân sách</span>
                </div>
              </div>

              {/* Min order & Total budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Giá trị Đơn hàng Tối thiểu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formMinOrder}
                      onChange={(e) => setFormMinOrder(e.target.value)}
                      className="w-full px-3 py-2 pr-12 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">VND</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Đơn phòng đạt ngưỡng mới được áp mã</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Tổng Ngân sách Sàn MeGo Tài trợ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      className="w-full px-3 py-2 pr-12 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-slate-400">VND</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Ước tính tương đương: ~3,000 lượt sử dụng</span>
                </div>
              </div>

              {/* Đối tượng áp dụng */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Đối tượng Áp dụng voucher <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 rounded-xl border cursor-pointer text-center ${
                      formTarget === "all" ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      className="sr-only"
                      checked={formTarget === "all"}
                      onChange={() => setFormTarget("all")}
                    />
                    <span>Tất cả khách đã đăng nhập</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border cursor-pointer text-center ${
                      formTarget === "vip" ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      className="sr-only"
                      checked={formTarget === "vip"}
                      onChange={() => setFormTarget("vip")}
                    />
                    <span>MeGo Club VIP (Silver/Gold/Plat)</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border cursor-pointer text-center ${
                      formTarget === "new" ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="target"
                      className="sr-only"
                      checked={formTarget === "new"}
                      onChange={() => setFormTarget("new")}
                    />
                    <span>Khách hàng mới (Lần đầu)</span>
                  </label>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-blue-900 flex items-center gap-2">
                <span>ℹ️</span>
                <span>Ngân sách sẽ tự động trừ vào Quỹ Trợ Giá 2026 ngay khi phát hành</span>
              </div>

              {/* Submit footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
                >
                  Phát hành Voucher Toàn sàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;
