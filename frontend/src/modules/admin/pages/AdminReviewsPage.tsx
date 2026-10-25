import React, { useState } from "react";
import { toast } from "react-toastify";

interface FlaggedReview {
  id: string;
  code: string;
  bookingCode: string;
  hotelName: string;
  hotelAddress: string;
  customerName: string;
  customerEmail: string;
  customerBookingsCount: number;
  hotelComplaintRate: string;
  stayDates: string;
  roomType: string;
  stayPrice: string;
  rating: number;
  subRatings: { location: number; clean: number; service: number; price: number };
  comment: string;
  violationsDetected: string[];
  customerPhotos: string[];
  hotelResponseManager: string;
  hotelExplanation: string;
  hotelEvidence: { filename: string; size: string; note: string }[];
  aiAnalysisConfidence: number;
  aiRecommendation: string;
  status: "pending" | "hidden" | "dismissed" | "user_warned";
  urgencyBadge: string;
  timeAgo: string;
}

const MOCK_FLAGGED_REVIEWS: FlaggedReview[] = [
  {
    id: "rev-01",
    code: "#REV-2026-10492",
    bookingCode: "#BK-89420",
    hotelName: "Grand Sunrise Boutique Hotel Da Nang",
    hotelAddress: "Sơn Trà, Đà Nẵng",
    customerName: "Hoàng Nguyễn",
    customerEmail: "hoang.nguyen92@gmail.com",
    customerBookingsCount: 2,
    hotelComplaintRate: "0.12%",
    stayDates: "14/10 - 21/10/2026",
    roomType: "Deluxe Ocean View (King Bed)",
    stayPrice: "3.420.000 đ",
    rating: 1.0,
    subRatings: { location: 2.0, clean: 1.0, service: 1.0, price: 1.0 },
    comment:
      "lừa đảo , đồ ăn sáng như cho người ăn . Ai đi du lịch Đà Nẵng hãy sang khách sạn XYZ đối diện tốt hơn gấp vạn lần , nhân viên lịch thiệp và không bao giờ chặt chém khách như bọn này!",
    violationsDetected: [
      '1. Sử dụng từ ngữ miệt thị xúc phạm ("như cho người ăn", "chặt chém").',
      '2. Quảng cáo định hướng khách sang cơ sở đối thủ trực tiếp ("khách sạn XYZ đối diện").',
    ],
    customerPhotos: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format&fit=crop&q=60",
    ],
    hotelResponseManager: "Mai Phương (Quản lý Điều hành)",
    hotelExplanation:
      "Khách quy định trả phòng lúc 12:00 nhưng yêu cầu lưu trú tại phòng Deluxe tới 16:00 hoàn toàn miễn phí. Khách sạn đã linh hoạt hỗ trợ giảm 50% tiền phụ thu nhưng khách không đồng ý, đe dọa viết đánh giá xấu bôi nhọ trên mạng xã hội. Đối tác có camera ghi lại hình ảnh nhân viên giải thích ôn hòa.",
    hotelEvidence: [
      { filename: "CCTV_SanhLetan_14h30.mp4", size: "48.2 MB", note: "Bằng chứng camera sảnh" },
      { filename: "Bien_ban_bao_cao_su_viec.pdf", size: "2.1 MB", note: "Có chữ ký đối chất" },
    ],
    aiAnalysisConfidence: 94.8,
    aiRecommendation:
      "Đánh giá có dấu hiệu trả đũa (Retaliatory Reviews) do tranh chấp phụ thu check-out theo đúng quy định niêm yết. Vi phạm trực tiếp điều 8.3 Quy chế Sàn MeGo. Đề xuất: ẨN ĐÁNH GIÁ & BẢO VỆ CHỈ SỐ KHÁCH SẠN.",
    status: "pending",
    urgencyBadge: "Khẩn cấp",
    timeAgo: "12 phút trước",
  },
  {
    id: "rev-02",
    code: "#REV-2026-10448",
    bookingCode: "#BK-77129",
    hotelName: "Sapa Misty Valley Homestay",
    hotelAddress: "Sa Pa, Lào Cai",
    customerName: "Trần Minh",
    customerEmail: "minhtran.vn@outlook.com",
    customerBookingsCount: 5,
    hotelComplaintRate: "0.25%",
    stayDates: "10/10 - 12/10/2026",
    roomType: "Mộc Châu Bungalow",
    stayPrice: "1.250.000 đ",
    rating: 2.0,
    subRatings: { location: 4.0, clean: 2.0, service: 1.0, price: 2.0 },
    comment:
      "Quảng cáo dịch vụ tour bên ngoài, lôi kéo khách giao dịch riêng qua Zalo cá nhân không thông qua sàn MeGo...",
    violationsDetected: [
      "1. Chứa thông tin số điện thoại / lôi kéo giao dịch ngoài nền tảng.",
    ],
    customerPhotos: [],
    hotelResponseManager: "Hoàng Thị Mai (Chủ cơ sở)",
    hotelExplanation: "Nhân viên lễ tân giới thiệu dịch vụ xe ôm bản địa giúp khách, không cố ý lách sàn.",
    hotelEvidence: [
      { filename: "Tinnhan_Zalo_Tour.png", size: "1.4 MB", note: "Ảnh chụp tin nhắn" },
    ],
    aiAnalysisConfidence: 89.2,
    aiRecommendation: "Yêu cầu chỉnh sửa lược bỏ thông tin liên hệ riêng.",
    status: "pending",
    urgencyBadge: "AI Flag",
    timeAgo: "2 giờ trước",
  },
];

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<FlaggedReview[]>(MOCK_FLAGGED_REVIEWS);
  const [selectedId, setSelectedId] = useState<string>("rev-01");
  const [decision, setDecision] = useState<"dismiss" | "hide" | "request_edit" | "warn_user">("hide");
  const [auditNote, setAuditNote] = useState(
    "Đánh giá có hành vi trả đũa phụ thu check-out theo quy định. Vi phạm điều 8.3 Quy chế Sàn MeGo (quảng cáo đối thủ và xúc phạm nhân viên lễ tân)."
  );

  const selectedReview = reviews.find((r) => r.id === selectedId) || reviews[0];

  const handleConfirmDecision = () => {
    if (decision === "hide") {
      setReviews((prev) =>
        prev.map((r) => (r.id === selectedId ? { ...r, status: "hidden" } : r))
      );
      toast.success(`Đã ẩn và gỡ bỏ đánh giá ${selectedReview.code} khỏi giao diện người dùng!`);
    } else if (decision === "dismiss") {
      setReviews((prev) =>
        prev.map((r) => (r.id === selectedId ? { ...r, status: "dismissed" } : r))
      );
      toast.info(`Đã bác bỏ khiếu nại, giữ nguyên đánh giá.`);
    } else if (decision === "warn_user") {
      setReviews((prev) =>
        prev.map((r) => (r.id === selectedId ? { ...r, status: "user_warned" } : r))
      );
      toast.warn(`Đã gửi cảnh cáo và khóa quyền đánh giá của khách hàng ${selectedReview.customerName} trong 30 ngày.`);
    } else {
      toast.info(`Đã gửi thông báo yêu cầu khách hàng chỉnh sửa lại đánh giá.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 mb-1">
            Quản trị Hệ thống &gt; Vận hành Nội dung &gt; Kiểm duyệt Đánh giá Vi phạm (P44)
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kiểm duyệt Đánh giá &amp; Xử lý Khiếu nại Vi phạm
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Module P44
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thẩm định phản hồi của khách hàng, giải quyết khiếu nại từ khách sạn và bảo vệ tính khách quan minh bạch chuẩn MeGo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Đang xuất tệp danh sách vi phạm (.xlsx)...")}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Xuất Báo cáo vi phạm (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={() => toast.success("Đang đồng bộ Quy tắc kiểm duyệt tự động AI Filter Config (99.8% Precision)")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>Quy tắc kiểm duyệt tự động (AI Filter Config)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics matching Image 4 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CHỜ KIỂM DUYỆT</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Khẩn cấp
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            28 <span className="text-xs font-bold text-slate-400">trường hợp</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="font-semibold text-rose-600">18 khiếu nại</span>
            <span>•</span>
            <span className="font-semibold text-amber-600">10 AI-flag</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">ĐÃ XỬ LÝ TUẦN NÀY</span>
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">✓</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-slate-900">312</span>
            <span className="text-xs font-bold text-emerald-600">+12.4%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Thời gian phản hồi TB: <strong>14.2 phút</strong>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">ĐÃ ẨN / GỠ BỎ VI PHẠM</span>
            <span className="p-1 rounded-lg bg-rose-50 text-rose-600">🚫</span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            42 <span className="text-xs font-bold text-slate-400">đánh giá</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 truncate">
            Trần tục, bôi nhọ, tống tiền hoàn vé
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">TỶ LỆ KHIẾU NẠI SÀN</span>
            <span className="p-1 rounded-lg bg-blue-50 text-blue-600">🛡️</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-600">0.18%</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Đạt chuẩn
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Mức độ tin cậy nền tảng: <strong>99.82%</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 rounded-xl font-bold bg-blue-600 text-white shadow-xs">
            Tất cả báo cáo (28)
          </button>
          <button className="px-3 py-1.5 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200">
            Khách sạn khiếu nại (18)
          </button>
          <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700">
            <option>Mức ưu tiên: Tất cả</option>
            <option>Khẩn cấp</option>
            <option>Trung bình</option>
          </select>
          <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700">
            <option>Số sao: Tất cả</option>
            <option>1 sao</option>
            <option>2 sao</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Mã đặt phòng, User ID, Khách sạn..."
            className="w-full pl-3 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 2-Column Master-Detail Layout matching Image 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Flagged Reviews (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>DANH SÁCH ĐÁNH GIÁ BỊ BÁO CÁO</span>
            <span className="text-slate-500">Cập nhật 1 phút trước</span>
          </div>

          <div className="space-y-3">
            {reviews.map((r) => {
              const isSelected = r.id === selectedId;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-blue-50/40 border-blue-600 shadow-md ring-1 ring-blue-600/30"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-blue-700">{r.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {r.urgencyBadge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {r.hotelName}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{r.customerName}</span>
                    <span>•</span>
                    <span className="font-bold text-amber-500">★ {r.rating.toFixed(1)}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-semibold">Khiếu nại từ Đối tác</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                    "{r.comment}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{r.timeAgo}</span>
                    <span className="text-blue-600 font-bold">Đang kiểm duyệt →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dispute Investigation Dossier (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
          {/* Dossier Header */}
          <div className="pb-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">HỒ SƠ THẨM ĐỊNH</span>
                <span className="text-base font-mono font-black text-slate-900">{selectedReview.code}</span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-mono font-bold text-blue-700">Mã đơn: {selectedReview.bookingCode}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Tranh chấp bồi hoàn phòng
              </span>
            </div>

            {/* Parties info row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">BÊN KHIẾU NẠI: KHÁCH HÀNG</span>
                <div className="font-bold text-slate-900">{selectedReview.customerName}</div>
                <div className="text-[11px] text-slate-500">{selectedReview.customerEmail}</div>
                <div className="text-[11px] text-blue-600 font-semibold">Đã hoàn tất {selectedReview.customerBookingsCount} booking</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">BÊN BỊ TỐ CÁO: ĐỐI TÁC</span>
                <div className="font-bold text-slate-900">{selectedReview.hotelName}</div>
                <div className="text-[11px] text-slate-500">{selectedReview.hotelAddress}</div>
                <div className="text-[11px] text-emerald-600 font-semibold">Tỷ lệ khiếu nại: {selectedReview.hotelComplaintRate}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">THÔNG TIN LƯU TRÚ</span>
                <div className="font-bold text-slate-900">{selectedReview.stayDates}</div>
                <div className="text-[11px] text-slate-500">{selectedReview.roomType}</div>
                <div className="text-[11px] font-black text-slate-900">Tổng: {selectedReview.stayPrice}</div>
              </div>
            </div>
          </div>

          {/* 1. Nội dung Đánh giá của Khách hàng */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>1. Nội dung Đánh giá của Khách hàng</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Gửi lúc: 19:42 • 21/10/2026</span>
            </div>

            {/* Rating scores bar */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-rose-600">★ {selectedReview.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600 font-medium">
                <span>Vị trí: <strong>{selectedReview.subRatings.location}</strong></span>
                <span>Vệ sinh: <strong>{selectedReview.subRatings.clean}</strong></span>
                <span>Dịch vụ: <strong>{selectedReview.subRatings.service}</strong></span>
                <span>Giá cả: <strong>{selectedReview.subRatings.price}</strong></span>
              </div>
            </div>

            {/* Comment snippet */}
            <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-200/80 text-xs text-slate-800 leading-relaxed space-y-2">
              <p>
                <strong className="text-rose-600 font-black">lừa đảo</strong> , đồ ăn sáng <strong className="text-rose-600 font-black">như cho người ăn</strong> . Ai đi du lịch Đà Nẵng <strong className="text-rose-600 font-black">hãy sang khách sạn XYZ đối diện tốt hơn gấp vạn lần</strong> , nhân viên lịch thiệp và không bao giờ <strong className="text-rose-600 font-black">chặt chém</strong> khách như bọn này!
              </p>
            </div>

            {/* Violations Box */}
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5 text-xs text-rose-800">
              <strong className="block font-bold">⚠️ Phát hiện 2 vi phạm Tiêu chuẩn Cộng đồng MeGo:</strong>
              {selectedReview.violationsDetected.map((v, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed pl-2 font-medium">
                  {v}
                </div>
              ))}
            </div>

            {/* Attached customer photos */}
            {selectedReview.customerPhotos.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Ảnh đính kèm từ khách hàng (2 ảnh):</span>
                <div className="flex items-center gap-2">
                  {selectedReview.customerPhotos.map((url, idx) => (
                    <div key={idx} className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt="Ảnh vi phạm" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Báo cáo & Bằng chứng giải trình từ Khách sạn */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>2. Báo cáo &amp; Bằng chứng giải trình từ Khách sạn</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Gửi bởi: {selectedReview.hotelResponseManager}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
              <strong className="block text-slate-900 font-bold">Bản tường trình sự việc:</strong>
              <p>{selectedReview.hotelExplanation}</p>
            </div>

            {/* Attachments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {selectedReview.hotelEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/70 flex items-center justify-between cursor-pointer hover:bg-blue-50"
                  onClick={() => toast.info(`Đang tải tệp chứng cứ: ${ev.filename}`)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>📹</span>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{ev.filename}</div>
                      <div className="text-[10px] text-slate-400">{ev.size} • {ev.note}</div>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold text-xs shrink-0">Xem</span>
                </div>
              ))}
            </div>

            {/* AI Trust Engine Analysis Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <strong className="text-blue-900 font-bold flex items-center gap-1.5">
                  <span>🤖</span> Phân tích AI MeGo AI Trust Engine
                </strong>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Độ tin cậy: {selectedReview.aiAnalysisConfidence}%
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px] pt-1">
                {selectedReview.aiRecommendation}
              </p>
            </div>
          </div>

          {/* 3. Thao Tác Quyết Định Quyền Hạn */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>3. Thao Tác Quyết Định Quyền Hạn</span>
            </h3>

            {/* 4 Decision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  decision === "dismiss" ? "border-blue-600 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Bác bỏ khiếu nại (Giữ review)</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "dismiss"}
                    onChange={() => setDecision("dismiss")}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-normal">Đánh giá không vi phạm quy chuẩn hiển thị</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  decision === "hide" ? "border-rose-600 bg-rose-50/40 text-rose-900 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>Ẩn / Gỡ bỏ đánh giá</span>
                    <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-extrabold uppercase">KHUYÊN DÙNG</span>
                  </span>
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "hide"}
                    onChange={() => setDecision("hide")}
                    className="w-4 h-4 text-rose-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-normal">Gỡ khỏi trang công khai ngay lập tức và bảo lưu điểm sao</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  decision === "request_edit" ? "border-blue-600 bg-blue-50/40 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Yêu cầu khách sửa đổi</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "request_edit"}
                    onChange={() => setDecision("request_edit")}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-normal">Gửi thông báo yêu cầu người dùng biên tập lại trong 48h</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  decision === "warn_user" ? "border-rose-600 bg-rose-50/40 text-rose-900 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Cảnh cáo &amp; Khóa quyền review</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={decision === "warn_user"}
                    onChange={() => setDecision("warn_user")}
                    className="w-4 h-4 text-rose-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-normal">Khóa quyền đánh giá tài khoản 30 ngày do bôi nhọ cố ý</span>
              </label>
            </div>

            {/* Audit note textarea */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block text-xs">
                Ghi chú lưu vết Kiểm duyệt (Lưu tự động vào Audit Log P42):
              </label>
              <textarea
                rows={2}
                value={auditNote}
                onChange={(e) => setAuditNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Action buttons footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toast.info("Đã chuyển hồ sơ sang bộ phận Trọng tài Pháp chế xem xét độc lập")}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                ⚖️ Trọng tài Pháp chế
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toast.info("Đã đóng khiếu nại")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Bác bỏ báo cáo
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecision}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-rose-500/20 transition-colors flex items-center gap-1.5"
                >
                  <span>✓</span>
                  <span>Xác nhận Ẩn / Xóa đánh giá ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
