import React, { useState } from "react";
import { toast } from "react-toastify";

interface PartnerRevenueItem {
  id: string;
  code: string;
  name: string;
  hotelCode: string;
  location: string;
  orderCount: number;
  totalGmv: number;
  commissionRate: number;
  commissionAmount: number;
  netPayout: number;
  status: "paid" | "pending_w4" | "reconciling";
  statusLabel: string;
}

const P45_PARTNERS: PartnerRevenueItem[] = [
  {
    id: "p-01",
    code: "GS",
    name: "Grand Sunrise Boutique Hotel",
    hotelCode: "#HTL-8942",
    location: "Đà Nẵng",
    orderCount: 142,
    totalGmv: 128450000,
    commissionRate: 15.0,
    commissionAmount: 19267500,
    netPayout: 109182500,
    status: "paid",
    statusLabel: "Đã chi trả Payout",
  },
  {
    id: "p-02",
    code: "GO",
    name: "Grand Ocean Luxury Resort & Villas",
    hotelCode: "#HTL-0891",
    location: "Phú Quốc",
    orderCount: 348,
    totalGmv: 856300000,
    commissionRate: 15.9,
    commissionAmount: 137900000,
    netPayout: 722500000,
    status: "pending_w4",
    statusLabel: "Chờ duyệt lệnh Payout",
  },
  {
    id: "p-03",
    code: "DG",
    name: "Danang Golden Bay Luxury Hotel",
    hotelCode: "#HTL-7721",
    location: "Đà Nẵng",
    orderCount: 216,
    totalGmv: 361200000,
    commissionRate: 14.0,
    commissionAmount: 50568000,
    netPayout: 310632000,
    status: "paid",
    statusLabel: "Đã chi trả Payout",
  },
  {
    id: "p-04",
    code: "VP",
    name: "Vinpearl Resort & Spa Nha Trang Bay",
    hotelCode: "#HTL-5504",
    location: "Nha Trang",
    orderCount: 310,
    totalGmv: 589200000,
    commissionRate: 13.5,
    commissionAmount: 79555000,
    netPayout: 509645000,
    status: "paid",
    statusLabel: "Đã chi trả Payout",
  },
  {
    id: "p-05",
    code: "DE",
    name: "Dalat Edensee Lake Resort & Spa",
    hotelCode: "#HTL-1328",
    location: "Đà Lạt",
    orderCount: 76,
    totalGmv: 114000000,
    commissionRate: 12.0,
    commissionAmount: 13680000,
    netPayout: 100320000,
    status: "reconciling",
    statusLabel: "Đang đối soát ngân hàng",
  },
  {
    id: "p-06",
    code: "SM",
    name: "Sapa Misty Valley Ecoterm & Homestay",
    hotelCode: "#HTL-9912",
    location: "Lào Cai",
    orderCount: 52,
    totalGmv: 62400000,
    commissionRate: 10.0,
    commissionAmount: 6240000,
    netPayout: 56160000,
    status: "paid",
    statusLabel: "Đã chi trả Payout",
  },
];

export const AdminFinancePage: React.FC = () => {
  const [partners, setPartners] = useState<PartnerRevenueItem[]>(P45_PARTNERS);
  const [periodTab, setPeriodTab] = useState<string>("month");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const filtered = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.hotelCode.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === "all" || p.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  const handleApprovePayout = (partner: PartnerRevenueItem) => {
    setPartners((prev) =>
      prev.map((item) =>
        item.id === partner.id
          ? { ...item, status: "paid", statusLabel: "Đã chi trả Payout" }
          : item
      )
    );
    toast.success(`Đã ký duyệt lệnh chi trả Payout ${partner.netPayout.toLocaleString("vi-VN")} đ cho "${partner.name}"!`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Tài chính &amp; Kế toán Sàn &gt; Thống kê Doanh thu Hoa hồng (P45)
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Thống kê Doanh thu Hoa hồng Sàn
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Module P45
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống vận hành đối soát thanh toán định kỳ thứ 4 hàng tuần. Dữ liệu dòng tiền GMV, hoa hồng thực nhận và lịch giải ngân đối tác.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Đang xuất bảng đối soát tài chính (.xlsx)...")}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Xuất Báo cáo tài chính (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info("Đang tạo tệp Báo cáo thuế GTGT sàn (.pdf)...")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>Xuất Báo cáo PDF / Thuế</span>
          </button>
        </div>
      </div>

      {/* Filter Bar matching Image 5 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-2">KỲ XEM:</span>
            <button
              onClick={() => setPeriodTab("today")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                periodTab === "today" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setPeriodTab("7days")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                periodTab === "7days" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setPeriodTab("month")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                periodTab === "month" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Tháng này (10/2026)
            </button>
            <button
              onClick={() => setPeriodTab("quarter")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                periodTab === "quarter" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Quý 4/2026
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            • Chu kỳ đối soát kế toán: <strong>Thứ 4 hàng tuần</strong>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">KHOẢNG THỜI GIAN GIAO DỊCH</span>
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
              📅 01/10/2026 - 31/10/2026
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ĐỐI TÁC / CHUỖI LƯU TRÚ</span>
            <select className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none">
              <option>Tất cả đối tác &amp; chuỗi (1.24K)</option>
              <option>Vinpearl Hospitality</option>
              <option>Accor Group</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PHÂN KHÚC KHÁCH SẠN</span>
            <select className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none">
              <option>Tất cả phân khúc</option>
              <option>Resort 5 Sao</option>
              <option>Khách sạn 3-4 Sao</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">TRẠNG THÁI ĐỐI SOÁT</span>
            <select className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none">
              <option>Tất cả trạng thái</option>
              <option>Đã chi trả Payout</option>
              <option>Chờ duyệt lệnh Payout</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => toast.success("Đã đồng bộ bộ lọc tài chính P45!")}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors text-center"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={() => toast.info("Đã làm mới dữ liệu")}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics matching Image 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">TỔNG GMV HOÀN TẤT</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">📊</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              48.650.000.000 <span className="text-xs font-bold text-slate-400">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span><strong>14.820 lượt</strong> đặt thành công</span>
            <span className="text-emerald-600 font-bold">+18.8%</span>
          </div>
        </div>

        {/* Hoa hồng sàn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">HOA HỒNG SÀN THỰC NHẬN</span>
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">%</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-600 mt-2">
              6.081.250.000 <span className="text-xs font-bold text-slate-400">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span><strong>12.5%</strong> Take-rate TB</span>
            <span className="text-blue-600 font-bold">+15.6%</span>
          </div>
        </div>

        {/* Hoa hồng chờ đối soát */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">HOA HỒNG CHỜ ĐỐI SOÁT</span>
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">⏳</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              1.245.800.000 <span className="text-xs font-bold text-slate-400">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>86 đơn tạm giữ Tuần 4</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
              Payout 24/10
            </span>
          </div>
        </div>

        {/* Dòng tiền chi trả đối tác */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">DÒNG TIỀN CHI TRẢ ĐỐI TÁC</span>
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">🏦</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              41.322.950.000 <span className="text-xs font-bold text-slate-400">đ</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Đã chi: <strong>37.8B đ</strong></span>
            <span className="text-teal-600 font-bold">Giữ: 3.5B đ</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Column Chart (Left) + Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tăng trưởng GMV &amp; Hoa hồng theo Tuần
              </h3>
              <p className="text-xs text-slate-400">Tháng 10/2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-700"></span>
                <span className="text-slate-700">GMV Đặt phòng (Tỷ đ)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400"></span>
                <span className="text-slate-700">Hoa hồng sàn (Tỷ đ)</span>
              </span>
            </div>
          </div>

          {/* Bars */}
          <div className="grid grid-cols-4 gap-4 sm:gap-8 pt-6 pb-2 items-end h-56 border-b border-slate-100">
            {[
              { week: "Tuần 1", sub: "01 - 07/10", gmv: 11.45, comm: 1.45 },
              { week: "Tuần 2", sub: "08 - 14/10", gmv: 12.65, comm: 1.58 },
              { week: "Tuần 3 [Đỉnh điểm]", sub: "15 - 21/10", gmv: 14.15, comm: 1.78, highlight: true },
              { week: "Tuần 4", sub: "22 - 31/10", gmv: 10.4, comm: 1.27 },
            ].map((col) => (
              <div key={col.week} className="flex flex-col items-center gap-2 h-full justify-end">
                <div className="flex items-end gap-1.5 sm:gap-2.5 h-full">
                  <div
                    className={`w-6 sm:w-10 rounded-t-lg transition-all ${
                      col.highlight ? "bg-blue-700 ring-2 ring-blue-500/30" : "bg-blue-700"
                    }`}
                    style={{ height: `${(col.gmv / 16) * 100}%` }}
                  ></div>
                  <div
                    className="w-6 sm:w-10 bg-cyan-400 rounded-t-lg transition-all"
                    style={{ height: `${(col.comm / 16) * 100 * 3}%` }}
                  ></div>
                </div>
                <div className="text-center w-full">
                  <div className={`text-xs font-bold ${col.highlight ? "text-blue-700" : "text-slate-800"}`}>
                    {col.week}
                  </div>
                  <div className="text-[10px] text-slate-400">{col.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>ℹ️</span>
              <span>Hoa hồng ghi nhận khi khách check-out thành công vào phòng không bị hủy hoàn phí.</span>
            </span>
            <span className="font-bold text-slate-900">GMV TB: 12.16 Tỷ/Tuần</span>
          </div>
        </div>

        {/* Right Card: Tỷ trọng theo Phân khúc */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Tỷ trọng theo Phân khúc</h3>
              <span className="text-xs text-slate-400">ℹ️</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Segment 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
                  Resort &amp; KS 5 sao
                </span>
                <span className="text-blue-700 font-black">52.6%</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">3.198.737.500 đ</div>
            </div>

            {/* Segment 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  Khách sạn 3 - 4 sao
                </span>
                <span className="text-teal-600 font-black">35.3%</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">2.146.681.250 đ</div>
            </div>

            {/* Segment 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Boutique &amp; Homestay
                </span>
                <span className="text-amber-600 font-black">12.1%</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900">735.831.250 đ</div>
            </div>
          </div>

          {/* Tax deduction box */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">THUẾ GTGT &amp; PHÍ PAYMENT</span>
              <span className="text-slate-600 text-[11px]">Khấu trừ tự động cổng VNPay</span>
            </div>
            <strong className="text-rose-600 font-black">-486.500.000 đ</strong>
          </div>
        </div>
      </div>

      {/* Bottom: Bảng Thống kê Hoa hồng theo Từng Đối tác matching Image 5 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bảng Thống kê Hoa hồng theo Từng Đối tác</h3>
            <p className="text-xs text-slate-400">Danh sách lệnh đối soát hoa hồng MeGo và chi trả giải ngân Payout</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên khách sạn, mã đối tác..."
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-60 focus:outline-none"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">Tất cả khu vực</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Phú Quốc">Phú Quốc</option>
              <option value="Nha Trang">Nha Trang</option>
              <option value="Đà Lạt">Đà Lạt</option>
              <option value="Lào Cai">Sa Pa (Lào Cai)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Đối tác &amp; Cơ sở lưu trú</th>
                <th className="py-3 px-4 font-semibold">Số đơn hoàn tất</th>
                <th className="py-3 px-4 font-semibold">Tổng GMV phòng</th>
                <th className="py-3 px-4 font-semibold">Tỷ lệ HH</th>
                <th className="py-3 px-4 font-semibold">Hoa hồng sàn thu</th>
                <th className="py-3 px-4 font-semibold">Net Payout đối tác</th>
                <th className="py-3 px-4 text-right font-semibold">Trạng thái đối soát</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 font-bold text-blue-700 flex items-center justify-center shrink-0 text-xs">
                        {item.code}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.hotelCode} • {item.location}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">{item.orderCount} đơn</td>

                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {item.totalGmv.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.commissionRate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-blue-700">
                    {item.commissionAmount.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {item.netPayout.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {item.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đã chi trả Payout
                      </span>
                    ) : item.status === "pending_w4" ? (
                      <button
                        type="button"
                        onClick={() => handleApprovePayout(item)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Ký lệnh Payout
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Đang đối soát
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Hiển thị 1 - {filtered.length} trong tổng số 1.240 đối tác khách sạn • Trang 1 / 208</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
            <span>...</span>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">208</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancePage;
