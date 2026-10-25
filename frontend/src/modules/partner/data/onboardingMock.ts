import type { ApplicationStatus, DocumentCategory, HotelCategory, OnboardingForm, PayoutCycle } from "../types/partner.types";

export const ONBOARDING_SPECIALIST = {
  name: "Ms. Phương Thảo",
  title: "Quản lý Thị trường MeGo Đông Nam Á",
  region: "Khu vực TP.HCM & Đông Nam Bộ",
  rating: "4,98/5,0",
  reviews: "340+ khách sạn",
  extension: "Nhánh 2",
  email: "onboarding@mego.vn",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
};

export const HOTEL_CATEGORIES: Array<{ value: HotelCategory; title: string; description: string }> = [
  { value: "RESORT", title: "Resort ven sông / biển", description: "Khu nghỉ dưỡng cảnh quan thiên nhiên & tiện ích cao cấp" },
  { value: "HOTEL_4_5_STAR", title: "Khách sạn 4–5 sao", description: "Khách sạn trung tâm thành phố, tháp cao tầng" },
  { value: "VILLA", title: "Biệt thự / Villa", description: "Villa nguyên căn, bể bơi biệt lập, sân vườn riêng" },
  { value: "BOUTIQUE", title: "Boutique Hotel", description: "Thiết kế phong cách nghệ thuật, phòng độc bản" },
];

export const STAR_RATINGS = [
  { value: "5", label: "5 sao – Luxury Resort / Hotel" },
  { value: "4", label: "4 sao – Upscale" },
  { value: "3", label: "3 sao – Midscale" },
  { value: "UNRATED", label: "Chưa xếp hạng" },
];

export const VN_BANKS = [
  { code: "VCB", name: "Vietcombank – Ngân hàng TMCP Ngoại thương Việt Nam" },
  { code: "BIDV", name: "BIDV – Ngân hàng TMCP Đầu tư và Phát triển Việt Nam" },
  { code: "CTG", name: "VietinBank – Ngân hàng TMCP Công Thương Việt Nam" },
  { code: "TCB", name: "Techcombank – Ngân hàng TMCP Kỹ Thương Việt Nam" },
  { code: "ACB", name: "ACB – Ngân hàng TMCP Á Châu" },
  { code: "MB", name: "MB – Ngân hàng TMCP Quân đội" },
];

export const PAYOUT_CYCLES: Array<{ value: PayoutCycle; title: string; description: string }> = [
  { value: "WEEKLY", title: "Hằng tuần (thứ Hai)", description: "Dòng tiền về nhanh, đối soát tự động qua API" },
  { value: "MONTHLY", title: "Hằng tháng (ngày 05 tháng kế tiếp)", description: "Tổng hợp sao kê một lần cho phòng Kế toán doanh nghiệp" },
];

export const REQUIRED_DOCUMENTS: Array<{ category: DocumentCategory; group: string; label: string }> = [
  { category: "ID_FRONT", group: "Căn cước công dân / Hộ chiếu người đại diện", label: "Mặt trước" },
  { category: "ID_BACK", group: "Căn cước công dân / Hộ chiếu người đại diện", label: "Mặt sau" },
  { category: "BUSINESS_LICENSE", group: "Giấy chứng nhận Đăng ký Doanh nghiệp (ĐKKD)", label: "Bản scan đầy đủ các trang" },
  { category: "FIRE_SAFETY", group: "Giấy chứng nhận Đủ điều kiện An toàn PCCC", label: "Bản scan còn hiệu lực" },
];

export const DOCUMENT_LABELS: Record<DocumentCategory, string> = {
  ID_FRONT: "CCCD / Hộ chiếu người đại diện – mặt trước",
  ID_BACK: "CCCD / Hộ chiếu người đại diện – mặt sau",
  BUSINESS_LICENSE: "Giấy chứng nhận Đăng ký Doanh nghiệp (ĐKKD)",
  FIRE_SAFETY: "Giấy chứng nhận Đủ điều kiện An toàn PCCC",
};

export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;

export const REVIEW_STEPS = [
  { title: "Tiếp nhận hồ sơ trực tuyến", description: "Hồ sơ được lưu trữ an toàn trên máy chủ MeGo." },
  { title: "Thẩm định pháp lý & tiêu chuẩn PCCC", description: "Đối chiếu mã số thuế và thẩm duyệt tiêu chuẩn an toàn PCCC (trong 12 giờ)." },
  { title: "Ký hợp đồng điện tử e-Contract", description: "Ký số qua nền tảng FPT.eContract / VNPT SmartCA." },
  { title: "Kích hoạt tài khoản Extranet & đón khách", description: "Đồng bộ tồn phòng tự động và bắt đầu nhận booking." },
];

export const OPERATING_COMMITMENTS = [
  "Xét duyệt hồ sơ trong 24 giờ làm việc",
  "Miễn phí thiết lập & kết nối Channel Manager",
  "Hỗ trợ chuyên trách 1:1 từ Market Manager địa phương",
];

export const SECURITY_COMMITMENTS = ["Mã hóa dữ liệu chuẩn ngân hàng", "Tuân thủ PCI-DSS Level 1 & PDPA", "Hợp đồng điện tử có giá trị pháp lý"];

export const ONBOARDING_FAQ = [
  { question: "Nếu quá hạn SLA 24 giờ thì sao?", answer: "Hồ sơ tự động chuyển sang mức ưu tiên cao và chuyên viên sẽ gọi điện trực tiếp cho bạn." },
  { question: "Làm thế nào để đổi tài khoản ngân hàng nhận tiền?", answer: "Bạn cập nhật trong mục Cài đặt tài chính sau khi tài khoản Extranet được kích hoạt." },
];

/** Ghi chú mẫu khi chuyên viên yêu cầu bổ sung hồ sơ. */
export const SAMPLE_REVIEW_NOTES = [
  "Giấy chứng nhận PCCC đã hết hiệu lực, vui lòng tải lên bản cấp mới.",
  "Tên chủ tài khoản ngân hàng chưa trùng khớp với tên trên Giấy ĐKKD.",
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING_REVIEW: "Đang chờ duyệt",
  NEEDS_INFO: "Cần bổ sung",
  APPROVED: "Đã phê duyệt",
};

export const EMPTY_ONBOARDING_FORM: OnboardingForm = {
  representativeName: "",
  phone: "",
  email: "",
  password: "",
  propertyName: "",
  starRating: "",
  hotelCategory: "",
  address: "",
  totalRooms: "",
  bankCode: "",
  accountNumber: "",
  accountHolder: "",
  bankBranch: "",
  payoutCycle: "WEEKLY",
  acceptedTerms: false,
};
