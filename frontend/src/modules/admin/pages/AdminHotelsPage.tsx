import React, { useState } from "react";
import { toast } from "react-toastify";

interface HotelDetail {
  id: string;
  code: string;
  name: string;
  starRating: number;
  category: string;
  address: string;
  partnerName: string;
  partnerPhone: string;
  roomTypesCount: number;
  totalKeys: number;
  status: "live" | "pending_review" | "suspended";
  statusLabel: string;
  statusBadgeColor: string;
  description: string;
  heroImage: string;
  foyerImage: string;
  roomImage: string;
}

const MOCK_P42_HOTELS: HotelDetail[] = [
  {
    id: "h-01",
    code: "#HTL-2026-09",
    name: "Grand Ocean Luxury Resort & Villas",
    starRating: 5,
    category: "Resort nghỉ dưỡng 5 sao",
    address: "Bãi Trường, Xã Dương Tơ, TP. Phú Quốc, Tỉnh Kiên Giang (Cách sân bay quốc tế 12 phút)",
    partnerName: "Lê Thanh Hùng",
    partnerPhone: "0918.442.xxx",
    roomTypesCount: 8,
    totalKeys: 120,
    status: "pending_review",
    statusLabel: "Chờ duyệt mở bán",
    statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description:
      "Grand Ocean Luxury Resort & Villas tọa lạc tại dải bờ biển phía Tây đảo ngọc Phú Quốc. Sở hữu 82 phòng nghỉ và biệt thự biệt lập với ngôn ngữ kiến trúc Indochine đương đại kết hợp gỗ tự nhiên và đá bazan nguyên khối. Khu nghỉ dưỡng cung ứng tiện ích trọn gói chuẩn 5 sao với bãi biển cát trắng riêng biệt dài 400m, hệ thống 3 nhà hàng ẩm thực quốc tế, và trung tâm trị liệu An Wellness.",
    heroImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
    foyerImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "h-02",
    code: "#HTL-08239",
    name: "Danang Bay Sapphire Retreat",
    starRating: 5,
    category: "5 Sao Ven Biển • Boutique Wellness",
    address: "115 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng",
    partnerName: "Sapphire Hospitality JSC (Trần Mai Phương)",
    partnerPhone: "0905.119.xxx",
    roomTypesCount: 5,
    totalKeys: 140,
    status: "live",
    statusLabel: "Đang hiển thị Live",
    statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description:
      "Khu nghỉ dưỡng ven biển Mỹ Khê với phong cách Scandinavian tối giản, hồ bơi vô cực dát vàng trên tầng thượng và hệ thống spa trị liệu thảo dược bản địa.",
    heroImage:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
    foyerImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "h-03",
    code: "#HTL-04182",
    name: "Ninh Van Heritage Cliff Eco-Resort",
    starRating: 5,
    category: "Eco Luxury Resort • Biệt lập & Riêng tư",
    address: "Bán đảo Vịnh Ninh Vân, Ninh Hòa, Khánh Hòa",
    partnerName: "Heritage Eco Resorts VN (Hoàng Minh Quân)",
    partnerPhone: "0982.551.xxx",
    roomTypesCount: 4,
    totalKeys: 35,
    status: "pending_review",
    statusLabel: "Chờ duyệt mở bán",
    statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description:
      "Khu nghỉ dưỡng biệt lập tựa lưng vào vách núi đá tự nhiên nhìn thẳng ra vịnh Ninh Vân, chỉ có thể tiếp cận bằng tàu cao tốc riêng của resort.",
    heroImage:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
    foyerImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "h-04",
    code: "#HTL-44120",
    name: "Fansipan Horizon Boutique Hotel",
    starRating: 4,
    category: "4 Sao Cao Cấp • Núi rừng & Nghỉ dưỡng",
    address: "Đường Mường Hoa, Phường Sa Pa, Lào Cai",
    partnerName: "Cty CP Khách sạn Hoàng Liên (Phạm Thu Ngân)",
    partnerPhone: "0944.331.xxx",
    roomTypesCount: 6,
    totalKeys: 65,
    status: "suspended",
    statusLabel: "Tạm ngưng / Vi phạm",
    statusBadgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    description:
      "Khách sạn ngắm toàn cảnh thung lũng Mường Hoa và đỉnh Fansipan, đang tạm dừng nhận đặt chỗ do đối tác tiến hành bảo trì hệ thống sưởi sàn mùa đông.",
    heroImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
    foyerImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
    roomImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=80",
  },
];

export const AdminHotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelDetail[]>(MOCK_P42_HOTELS);
  const [selectedReviewHotel, setSelectedReviewHotel] = useState<HotelDetail | null>(null);
  const [search, setSearch] = useState("");

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.code.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenReviewModal = (hotel: HotelDetail) => {
    setSelectedReviewHotel(hotel);
  };

  const handleApproveLive = (hotelId: string) => {
    setHotels((prev) =>
      prev.map((h) =>
        h.id === hotelId
          ? {
              ...h,
              status: "live",
              statusLabel: "Đang hiển thị Live",
              statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
            }
          : h
      )
    );
    toast.success(`Khách sạn "${selectedReviewHotel?.name}" đã được phê duyệt hiển thị trên sàn MeGo!`);
    setSelectedReviewHotel(null);
  };

  const handleRequestEdit = () => {
    toast.info(`Đã gửi yêu cầu chỉnh sửa hình ảnh & metadata tới đối tác.`);
    setSelectedReviewHotel(null);
  };

  const handleSuspendHotel = (hotelId: string) => {
    setHotels((prev) =>
      prev.map((h) =>
        h.id === hotelId
          ? {
              ...h,
              status: "suspended",
              statusLabel: "Tạm ngưng / Vi phạm",
              statusBadgeColor: "bg-rose-50 text-rose-700 border-rose-200",
            }
          : h
      )
    );
    toast.warn(`Đã tạm ngưng niêm yết cơ sở khách sạn.`);
    setSelectedReviewHotel(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Vận hành Lưu trú &gt; Quản lý &amp; Xét duyệt Khách sạn (P42)
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý &amp; Xét duyệt Khách sạn
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Module P42
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm duyệt album ảnh chuẩn 4K, thông điệp định vị kiến trúc, số lượng chìa khóa phòng và cấp phép hiển thị trên ứng dụng MeGo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenReviewModal(hotels[0])}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>🔍</span>
            <span>Xem nhanh Hồ sơ P42 mẫu</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách sạn, mã HTL-, khu vực..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Trạng thái:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700">Tất cả ({hotels.length})</span>
        </div>
      </div>

      {/* Hotel Review Table matching Image 2 */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Khách sạn &amp; Mã</th>
                <th className="py-3.5 px-4 font-semibold">Đối tác vận hành</th>
                <th className="py-3.5 px-4 font-semibold">Phân hạng sao</th>
                <th className="py-3.5 px-4 font-semibold">Quy mô phòng</th>
                <th className="py-3.5 px-4 font-semibold">Tình trạng niêm yết</th>
                <th className="py-3.5 px-4 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Hotel info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <span className="text-amber-500 text-[11px]">{"★".repeat(item.starRating)}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          <span className="font-mono text-blue-700 font-bold">{item.code}</span> • {item.address.split("(")[0].trim()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Partner */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{item.partnerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.partnerPhone}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.category.split("•")[0]}</div>
                    <div className="text-[11px] text-slate-400">{item.category.split("•")[1] || "Boutique"}</div>
                  </td>

                  {/* Rooms */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.roomTypesCount} hạng phòng</div>
                    <div className="text-[11px] text-slate-400">{item.totalKeys} chìa khóa (Keys)</div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.statusBadgeColor}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.statusLabel}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === "pending_review" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(item)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                        >
                          Xét duyệt
                        </button>
                      ) : item.status === "live" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                        >
                          Chi tiết
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenReviewModal(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                        >
                          Mở khóa / Xem xét
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Hiển thị 1 - {filtered.length} trong tổng số 12 cơ sở chờ duyệt</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 bg-blue-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
          </div>
        </div>
      </div>

      {/* ── MODAL XÉT DUYỆT KHÁCH SẠN P42 (Figma Image 2) ── */}
      {selectedReviewHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Hồ sơ thẩm định P42
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Mã: {selectedReviewHotel.code}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {selectedReviewHotel.name}
                  </h2>
                  <span className="text-amber-500 text-sm">
                    {"★".repeat(selectedReviewHotel.starRating)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <span>📍</span>
                  <span>{selectedReviewHotel.address}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReviewHotel(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              {/* Thư viện hình ảnh đối tác tải lên (Album 4K) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🖼️</span>
                    <span>THƯ VIỆN HÌNH ẢNH ĐỐI TÁC TẢI LÊN (ALBUM 4K)</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Độ phân giải đạt chuẩn UHD &amp; Không watermark
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Hero image (7 cols) */}
                  <div className="md:col-span-7 relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 group">
                    <img
                      src={selectedReviewHotel.heroImage}
                      alt={selectedReviewHotel.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      Ảnh đại diện chính
                    </div>
                  </div>

                  {/* Sub images (5 cols) */}
                  <div className="md:col-span-5 flex flex-col gap-3">
                    <div className="relative h-28 sm:h-30 rounded-2xl overflow-hidden border border-slate-200 group">
                      <img
                        src={selectedReviewHotel.foyerImage}
                        alt="Sảnh đón"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-medium">
                        Sảnh đón Tiệp Grand Foyer
                      </div>
                    </div>
                    <div className="relative h-28 sm:h-30 rounded-2xl overflow-hidden border border-slate-200 group">
                      <img
                        src={selectedReviewHotel.roomImage}
                        alt="Buồng ngủ"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-medium">
                        Buồng ngủ Ocean View
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông điệp định vị & Tổng quan kiến trúc */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  THÔNG ĐIỆP ĐỊNH VỊ &amp; TỔNG QUAN KIẾN TRÚC
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedReviewHotel.description}
                </p>
              </div>

              {/* Checklist review */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Cơ sở lưu trú đã hoàn tất kiểm định thực địa và khớp hồ sơ pháp lý đối tác P41.</span>
                </div>
                <span className="font-mono text-slate-500 font-bold">SLA: 24h</span>
              </div>
            </div>

            {/* Modal Action Buttons Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSuspendHotel(selectedReviewHotel.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors self-start sm:self-auto"
              >
                🚫 Tạm ngưng / Khóa cơ sở
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestEdit}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Yêu cầu sửa thông tin
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveLive(selectedReviewHotel.id)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-blue-500/20 transition-colors flex items-center gap-1.5"
                >
                  <span>✓</span>
                  <span>Phê duyệt Hiển thị trên Sàn</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHotelsPage;
