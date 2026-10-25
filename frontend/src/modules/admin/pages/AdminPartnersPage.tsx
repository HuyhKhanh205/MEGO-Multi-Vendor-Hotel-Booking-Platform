import React, { useState } from "react";
import { toast } from "react-toastify";

interface PartnerApplication {
  id: string;
  code: string;
  hotelName: string;
  category: string;
  repName: string;
  companyName: string;
  taxCode: string;
  idCardNumber: string;
  idCardDate: string;
  phone: string;
  email: string;
  address: string;
  roomCount: number;
  priceRange: string;
  channelManager: string;
  bankAccount: string;
  bankName: string;
  bankAccountOwner: string;
  legalScore: number;
  legalCount: string;
  submittedAt: string;
  status: "pending" | "verifying" | "need_docs" | "approved" | "rejected";
  statusLabel: string;
  statusBadgeColor: string;
  priorityNote?: string;
  warningText?: string;
  images: { title: string; url: string }[];
  documents: { title: string; filename: string; size: string }[];
}

const MOCK_APPLICATIONS: PartnerApplication[] = [
  {
    id: "app-01",
    code: "#PRQ-2026-0891",
    hotelName: "Grand Ocean Luxury Resort & Villas",
    category: "Resort nghỉ dưỡng 5 sao",
    repName: "Lê Thanh Hùng",
    companyName: "Công ty TNHH Đầu tư & Du lịch Biển Xanh Phú Quốc",
    taxCode: "0314892182",
    idCardNumber: "079089001234",
    idCardDate: "12/05/2021 (C06)",
    phone: "0918 234 567",
    email: "contact@grandoceanphuquoc.vn",
    address: "Khu phức hợp Bãi Trường, Xã Dương Tơ, TP. Phú Quốc, Tỉnh Kiên Giang",
    roomCount: 120,
    priceRange: "2.2tr - 8.5tr VND/đêm",
    channelManager: "SiteMinder API (Đã kết nối Webhook)",
    bankAccount: "0071000989999",
    bankName: "Vietcombank - CN Phú Quốc",
    bankAccountOwner: "CTY TNHH DAU TU VA DU LICH BIEN XANH PHU QUOC",
    legalScore: 98.5,
    legalCount: "Đã 4/4 tài liệu pháp lý",
    submittedAt: "09:30 hôm nay",
    status: "pending",
    statusLabel: "Chờ duyệt thẩm định",
    statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    images: [
      { title: "Sảnh đón Grand Foyer", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60" },
      { title: "Buồng ngủ Ocean Suite", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60" },
      { title: "Hồ bơi vô cực", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60" },
      { title: "Khuôn viên bãi biển", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60" },
    ],
    documents: [
      { title: "1. Giấy phép Đăng ký Kinh doanh", filename: "GPKD_PhuQuoc_2021.pdf", size: "2.4 MB" },
      { title: "2. Thẩm duyệt An toàn PCCC", filename: "PCCC_OON_2024.pdf", size: "3.8 MB" },
      { title: "3. Vệ sinh ATTP & Dịch vụ Spa", filename: "VSATTP_2024.pdf", size: "1.9 MB" },
      { title: "4. CCCD Gắn Chip 2 Mặt", filename: "CCCD_LeThanhHung.jpg", size: "1.1 MB" },
    ],
  },
  {
    id: "app-02",
    code: "#PRQ-2026-0887",
    hotelName: "Danang Riverside Boutique Hotel",
    category: "Khách sạn 4 sao",
    repName: "Bà Nguyễn Mai Chi",
    companyName: "Công ty CP Dịch Vụ Du Lịch Sông Hàn",
    taxCode: "0401827491",
    idCardNumber: "048188009876",
    idCardDate: "20/08/2022 (C06)",
    phone: "0905 889 912",
    email: "gm@danangriverside.com",
    address: "45 Trần Hưng Đạo, Phường An Hải Tây, Quận Sơn Trà, Đà Nẵng",
    roomCount: 45,
    priceRange: "950k - 2.8tr VND/đêm",
    channelManager: "Channex Sync API",
    bankAccount: "19034827165012",
    bankName: "Techcombank - CN Đà Nẵng",
    bankAccountOwner: "CTY CP DICH VU DU LICH SONG HAN",
    legalScore: 94.0,
    legalCount: "Đã 3/4 tài liệu hợp lệ",
    submittedAt: "16:15 hôm qua",
    status: "verifying",
    statusLabel: "Đang xác minh",
    statusBadgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    images: [
      { title: "Mặt tiền khách sạn", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60" },
      { title: "Phòng Deluxe View Cầu Rồng", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60" },
    ],
    documents: [
      { title: "1. Giấy phép Đăng ký Kinh doanh", filename: "GPKD_Danang_2020.pdf", size: "1.8 MB" },
      { title: "2. Biên bản kiểm tra PCCC", filename: "PCCC_Danang_2023.pdf", size: "2.2 MB" },
      { title: "3. CCCD Đại diện pháp luật", filename: "CCCD_NguyenMaiChi.jpg", size: "0.9 MB" },
    ],
  },
  {
    id: "app-03",
    code: "#PRQ-2026-0882",
    hotelName: "Sapa Misty Valley Homestay",
    category: "Homestay & Villa",
    repName: "Hộ KD Hoàng Thị Mai",
    companyName: "Hộ Kinh Doanh Du Lịch Bản Mây Sapa",
    taxCode: "8271649201",
    idCardNumber: "010192003456",
    idCardDate: "10/01/2023 (C06)",
    phone: "0944 555 777",
    email: "sapamistyvalley@gmail.com",
    address: "Bản Cát Cát, Xã San Sả Hồ, Thị xã Sa Pa, Lào Cai",
    roomCount: 18,
    priceRange: "650k - 1.5tr VND/đêm",
    channelManager: "Thủ công (Extranet)",
    bankAccount: "1028374659",
    bankName: "VietinBank - Sa Pa",
    bankAccountOwner: "HOANG THI MAI",
    legalScore: 68.0,
    legalCount: "Thiếu thẩm duyệt PCCC mới",
    submittedAt: "2 ngày trước",
    status: "need_docs",
    statusLabel: "Cần bổ sung",
    statusBadgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    warningText: "Thiếu giấy chứng nhận đủ điều kiện an ninh trật tự và PCCC cấp mới năm 2024.",
    images: [
      { title: "Toàn cảnh thung lũng Mường Hoa", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60" },
    ],
    documents: [
      { title: "1. Giấy chứng nhận Đăng ký HKD", filename: "HKD_BảnMay_2022.pdf", size: "1.5 MB" },
      { title: "2. CCCD Chủ cơ sở", filename: "CCCD_HoangThiMai.jpg", size: "1.0 MB" },
    ],
  },
  {
    id: "app-04",
    code: "#PRQ-2026-0879",
    hotelName: "Nha Trang Sunset Hotel & Suites",
    category: "Khách sạn 3 sao",
    repName: "Cty TNHH MTV Hoàng Gia",
    companyName: "Công ty TNHH MTV Khách Sạn Biển Hoàng Gia",
    taxCode: "4201982736",
    idCardNumber: "056088001122",
    idCardDate: "05/06/2022 (C06)",
    phone: "0972 334 455",
    email: "booking@nhatrangsunset.com",
    address: "60 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa",
    roomCount: 60,
    priceRange: "800k - 2.1tr VND/đêm",
    channelManager: "Cloudbeds API",
    bankAccount: "02345678901",
    bankName: "MBBank - CN Nha Trang",
    bankAccountOwner: "CTY TNHH MTV KHANH SAN BIEN HOANG GIA",
    legalScore: 88.0,
    legalCount: "Hồ sơ chờ phân công",
    submittedAt: "2 ngày trước",
    status: "pending",
    statusLabel: "Xếp hàng chờ",
    statusBadgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    images: [
      { title: "Khách sạn hướng biển Trần Phú", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60" },
    ],
    documents: [
      { title: "1. Giấy phép ĐKKD", filename: "GPKD_HoangGia_2021.pdf", size: "2.0 MB" },
      { title: "2. Thẩm duyệt PCCC", filename: "PCCC_HoangGia_2023.pdf", size: "3.1 MB" },
    ],
  },
];

export const AdminPartnersPage: React.FC = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>(MOCK_APPLICATIONS);
  const [selectedId, setSelectedId] = useState<string>("app-01");
  const [activeTab, setActiveTab] = useState<"all" | "priority">("all");
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  const selectedApp = applications.find((a) => a.id === selectedId) || applications[0];

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      app.code.toLowerCase().includes(search.toLowerCase()) ||
      app.taxCode.includes(search) ||
      app.repName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || app.legalScore >= 90;
    const matchesRegion = regionFilter === "all" || app.address.includes(regionFilter);
    return matchesSearch && matchesTab && matchesRegion;
  });

  const handleApprove = (id: string, name: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "approved", statusLabel: "Đã phê duyệt", statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" }
          : a
      )
    );
    toast.success(`Hồ sơ đối tác "${name}" đã được phê duyệt và kích hoạt tài khoản Partner thành công!`);
  };

  const handleRequestDocs = (name: string) => {
    toast.info(`Đã phát lệnh yêu cầu bổ sung hồ sơ tới "${name}" qua Email & SMS.`);
  };

  const handleReject = (id: string, name: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "rejected", statusLabel: "Đã từ chối", statusBadgeColor: "bg-rose-50 text-rose-700 border-rose-200" }
          : a
      )
    );
    toast.error(`Đã từ chối cấp phép đối tác cho "${name}".`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Vận hành Đối tác &gt; Xét duyệt Hồ sơ Đăng ký Đối tác (P41)
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Xét duyệt Hồ sơ Đối tác &amp; Cơ sở lưu trú
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Quy chuẩn SLA Thẩm định 24h
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thẩm định tính hợp pháp của Giấy phép ĐKKD, PCCC, thông tin tài khoản thụ hưởng doanh thu và kích hoạt quyền kinh doanh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Đang xuất báo cáo tuân thủ chỉ số SLA thẩm định...")}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>📄</span>
            <span>Xuất báo cáo SLA</span>
          </button>
          <button
            type="button"
            onClick={() => toast.info("Mở bảng phân công hồ sơ cho chuyên viên thẩm định nội bộ")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>👥</span>
            <span>Phân công thẩm định</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CHỜ DUYỆT THẨM ĐỊNH</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">📋</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">18</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              +3 mới hôm nay
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            5 hồ sơ phân loại ưu tiên cao
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">ĐÃ DUYỆT TUẦN NÀY</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-600">34</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +18.15% so tuần trước
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            100% đã ký hợp đồng điện tử
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CẦN BỔ SUNG / TRẢ LẠI</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">⚠️</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-amber-600">06</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Cảnh báo tồn đọng
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Chủ yếu thiếu PCCC &amp; ATTP
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">THỜI GIAN XỬ LÝ TB</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">⏱</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">3.8</span>
            <span className="text-xs font-bold text-slate-400">h/hồ sơ</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 ml-auto">
              SLA &lt; 24h
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Nhanh hơn quy chuẩn sàn 6.2 lần
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tất cả chờ duyệt ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("priority")}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === "priority" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Ưu tiên cao / 4-5 sao
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm Mã hồ sơ, MST, tên khách sạn..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả khu vực</option>
            <option value="Phú Quốc">Phú Quốc (Kiên Giang)</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Lào Cai">Sa Pa (Lào Cai)</option>
            <option value="Khánh Hòa">Nha Trang (Khánh Hòa)</option>
          </select>
        </div>
      </div>

      {/* 2-Column Master-Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Applications (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>HỒ SƠ CHỜ TIẾP NHẬN THẨM ĐỊNH</span>
            <span className="text-slate-600">Xếp xếp: Mới nhất</span>
          </div>

          <div className="space-y-3">
            {filteredApps.map((app) => {
              const isSelected = app.id === selectedId;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-blue-50/40 border-blue-600 shadow-md ring-1 ring-blue-600/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-blue-700">{app.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${app.statusBadgeColor}`}>
                      {app.statusLabel}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {app.hotelName}
                  </h3>

                  <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>👤</span>
                      <span>{app.repName} ({app.category})</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span>📍</span>
                      <span>{app.roomCount} phòng • {app.address.split(",").slice(-2).join(",").trim()}</span>
                    </div>
                  </div>

                  {app.warningText && (
                    <div className="mt-2 text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                      ⚠️ {app.warningText}
                    </div>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold">{app.legalCount}</span>
                    <span className="text-slate-400">{app.submittedAt}</span>
                  </div>

                  {isSelected && (
                    <div className="mt-2.5 w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-xs">
                      Đang xem xét hồ sơ này →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Hiển thị 1 - {filteredApps.length} trong 18 hồ sơ</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-0.5 rounded border border-slate-200 bg-blue-600 text-white font-bold">1</button>
              <button className="px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50">2</button>
              <button className="px-2 py-0.5 rounded border border-slate-200 hover:bg-slate-50">3</button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Application Dossier (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          {/* Dossier Header */}
          <div className="pb-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                  {selectedApp.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span>✓</span> eKYC Doanh nghiệp Khớp 100%
                </span>
              </div>

              {/* Trust Score */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                <span className="text-blue-600">🛡️</span>
                <span>CHỈ SỐ TIN CẬY MEGO:</span>
                <span className="text-blue-700 text-sm font-black">{selectedApp.legalScore}</span>
                <span className="text-slate-400">/ 100</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedApp.hotelName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Mã hồ sơ: <strong className="text-slate-700 font-mono">{selectedApp.code}</strong></span>
                <span>•</span>
                <span>Nộp: <strong className="text-slate-700">{selectedApp.submittedAt}</strong></span>
                <span>•</span>
                <span>Thẩm định viên: <strong className="text-blue-700">Vũ Hoàng Nam</strong></span>
              </div>
            </div>
          </div>

          {/* Phần A: Thông tin Doanh nghiệp & Người đại diện */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>🏢</span>
                <span>Phần A: Thông tin Doanh nghiệp &amp; Người đại diện</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <span>✓</span> Đã xác thực dữ liệu Cổng Thuế &amp; C06
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TÊN PHÁP NHÂN ĐĂNG KÝ</span>
                <div className="font-bold text-slate-900">{selectedApp.companyName}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">MÃ SỐ THUẾ DOANH NGHIỆP</span>
                  <div className="font-mono font-black text-sm text-slate-900">{selectedApp.taxCode}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  HỢP LỆ
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">NGƯỜI ĐẠI DIỆN PHÁP LUẬT</span>
                <div className="font-bold text-slate-900">{selectedApp.repName} - Chức vụ: Tổng Giám Đốc</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">SỐ CCCD GẮN CHIP</span>
                  <div className="font-mono font-bold text-slate-900">{selectedApp.idCardNumber}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                  BCA XÁC MINH
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">LIÊN HỆ CHÍNH THỨC</span>
                <div className="font-medium text-slate-800">Hotline: <strong>{selectedApp.phone}</strong></div>
                <div className="text-slate-500">{selectedApp.email}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">ĐỊA CHỈ TRỤ SỞ CHÍNH</span>
                <div className="font-medium text-slate-800 leading-snug">{selectedApp.address}</div>
              </div>
            </div>
          </div>

          {/* Phần B: Quy mô Cơ sở & Tài khoản Ngân hàng nhận Doanh thu */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>🏦</span>
              <span>Phần B: Quy mô Cơ sở &amp; Tài khoản Ngân hàng nhận Doanh thu</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">PHÂN HẠNG &amp; QUY MÔ</span>
                <div className="text-base font-black text-slate-900">{selectedApp.roomCount} phòng/villas</div>
                <div className="text-[11px] text-slate-500">{selectedApp.category}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">BIÊN ĐỘ GIÁ NIÊM YẾT</span>
                <div className="text-base font-black text-slate-900">{selectedApp.priceRange}</div>
                <div className="text-[11px] text-blue-600 font-semibold">% hoa hồng sàn: 14.0% OTA</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">ĐỒNG BỘ CHANNEL MANAGER</span>
                <div className="font-bold text-slate-900 leading-tight">{selectedApp.channelManager}</div>
                <div className="text-[11px] text-emerald-600 font-semibold">✓ Đã kích hoạt webhook</div>
              </div>
            </div>

            {/* Bank account card */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-base shrink-0">
                  💳
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    TÀI KHOẢN THỤ HƯỞNG DOANH THU TỰ ĐỘNG (MEGO PAYOUT)
                  </span>
                  <div className="font-mono font-black text-base text-slate-900 mt-0.5">
                    {selectedApp.bankAccount} • {selectedApp.bankName}
                  </div>
                  <div className="text-slate-600 font-medium">
                    Chủ TK: <strong className="text-slate-900">{selectedApp.bankAccountOwner}</strong>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto flex items-center gap-1">
                <span>✓</span> Khớp 100% ĐKKD Doanh nghiệp
              </span>
            </div>
          </div>

          {/* Phần C: Bộ Xem Văn Bản Pháp Lý & Ảnh Khảo Sát Thực Tế */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>📁</span>
                <span>Phần C: Bộ Xem Văn Bản Pháp Lý &amp; Ảnh Khảo Sát Thực Tế</span>
              </h3>
              <span className="text-xs text-slate-400">
                {selectedApp.documents.length} hồ sơ PDF • {selectedApp.images.length + 15} ảnh hiện trường
              </span>
            </div>

            {/* Document PDF Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedApp.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition-colors cursor-pointer"
                  onClick={() => toast.info(`Mở xem văn bản: ${doc.filename}`)}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-rose-600 text-lg">📄</span>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-800 truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{doc.filename} • {doc.size}</div>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold text-xs px-2 py-1 rounded hover:bg-white shrink-0">
                    Xem
                  </span>
                </div>
              ))}
            </div>

            {/* Photos Thumbnails */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">
                Ảnh khảo sát thực địa &amp; phòng mẫu thực tế:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {selectedApp.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 rounded-xl overflow-hidden group cursor-pointer border border-slate-200"
                    onClick={() => toast.info(`Phóng to hình ảnh: ${img.title}`)}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold p-1 text-center">
                      {img.title}
                    </div>
                    {idx === 3 && (
                      <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-white text-xs font-bold">
                        <span>+15 ảnh</span>
                        <span className="text-[9px] font-normal text-slate-300">Album 4K</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-600 text-xl">🛡️</span>
              <div className="text-xs">
                <strong className="text-slate-900 block font-bold">
                  Hồ sơ thẩm định hoàn tất 4/4 tiêu chuẩn
                </strong>
                <span className="text-slate-500">
                  Sẵn sàng kích hoạt tài khoản Partner và đồng bộ kho phòng MeGo.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto">
              <button
                type="button"
                onClick={() => handleRequestDocs(selectedApp.hotelName)}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Yêu cầu Bổ sung
              </button>
              <button
                type="button"
                onClick={() => handleReject(selectedApp.id, selectedApp.hotelName)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Từ chối Hồ sơ
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedApp.id, selectedApp.hotelName)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-500/20 transition-colors flex items-center gap-1.5"
              >
                <span>✓</span>
                <span>Phê duyệt &amp; Kích hoạt Đối tác</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPartnersPage;
