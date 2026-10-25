import type { SvgIconComponent } from "@mui/icons-material";
import HeadsetMicOutlined from "@mui/icons-material/HeadsetMicOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import StarRounded from "@mui/icons-material/StarRounded";
import SyncAltOutlined from "@mui/icons-material/SyncAltOutlined";

interface Feature {
  icon: SvgIconComponent;
  iconClass: string;
  title: string;
  tag: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: SyncAltOutlined,
    iconClass: "bg-[#1677FF]",
    title: "Phân phối thông minh",
    tag: "Channel Manager",
    description: "Tự động đồng bộ tồn phòng và bảng giá tới tất cả các kênh bán hàng đa nền tảng.",
  },
  {
    icon: PaymentsOutlined,
    iconClass: "bg-teal-600",
    title: "Thanh toán & Payout linh hoạt",
    tag: "Phí từ 10%",
    description: "Đối soát minh bạch hằng tuần, chu kỳ thanh toán nhanh giúp bảo toàn dòng vốn lưu động.",
  },
  {
    icon: HeadsetMicOutlined,
    iconClass: "bg-slate-500",
    title: "Hỗ trợ vận hành chuyên sâu 24/7",
    tag: "Market Manager",
    description: "Chuyên viên quản lý thị trường tư vấn chiến lược doanh thu ADR & RevPAR riêng cho từng cơ sở.",
  },
];

const HERO_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80";

export const PartnerLoginHero = () => (
  <div className="relative flex h-full min-h-[600px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#0B1B3F] p-10 text-white">
    <img src={HERO_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" draggable={false} />
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B1B3F]/95 via-[#0B1B3F]/75 to-[#0B1B3F]/40" />

    <div className="relative space-y-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-100">
        <StarRounded sx={{ fontSize: 14 }} /> MeGo Partner Ecosystem • Dành cho Khách sạn & Resort
      </span>
      <h2 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-[42px]">
        Đồng hành phát triển kinh doanh dịch vụ lưu trú bền vững.
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-blue-100/90">
        Tiếp cận hơn 2.500.000 khách du lịch tiềm năng, tối ưu hóa công suất phòng và dòng tiền kinh doanh thông minh với hạ tầng quản trị thời gian thực của MeGo.
      </p>
    </div>

    <ul className="relative my-8 space-y-3">
      {FEATURES.map(({ icon: Icon, iconClass, title, tag, description }) => (
        <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon sx={{ fontSize: 20 }} />
          </span>
          <span className="space-y-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">{title}</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-blue-100">{tag}</span>
            </span>
            <span className="block text-xs leading-relaxed text-blue-100/80">{description}</span>
          </span>
        </li>
      ))}
    </ul>

    {/* Social proof: cho phép xuống dòng để không tràn khỏi card như bản Figma */}
    <div className="relative flex items-center gap-3">
      <div className="flex -space-x-2">
        {["#1677FF", "#00A389", "#F59E0B"].map((color, index) => (
          <span key={color} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B1B3F] text-[10px] font-bold" style={{ backgroundColor: color }}>
            {["5★", "4★", "+"][index]}
          </span>
        ))}
      </div>
      <p className="text-sm leading-snug text-blue-100">
        Hơn <strong className="text-white">12.000+</strong> đối tác khách sạn & chuỗi resort tin dùng khắp Đông Nam Á
      </p>
    </div>
  </div>
);

export default PartnerLoginHero;
