import {
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
} from "../../../../components/common/Icons";

interface HotelOverviewProps {
  description: string;
  hotelName: string;
  city: string;
}

export const HotelOverview = ({
  description,
  hotelName,
  city,
}: HotelOverviewProps) => {
  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Tổng quan về {hotelName}
        </h2>
        <div className="h-1 w-12 bg-[#1677FF] rounded-full" />
      </div>

      {/* Description Content */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
        <p className="whitespace-pre-line">{description}</p>
        <p>
          Tọa lạc tại vị trí đắc địa thuộc {city}, nơi đây mang đến không gian
          nghỉ dưỡng đẳng cấp với tầm nhìn tuyệt đẹp, kiến trúc kết hợp hài hòa
          giữa vẻ đẹp hiện đại và nét quyến rũ bản địa. Dịch vụ chăm sóc khách
          hàng chu đáo và các tiện ích phong phú giúp kỳ nghỉ của bạn trở nên trọn
          vẹn và đáng nhớ.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Chất lượng dịch vụ 5 sao
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Đội ngũ nhân viên tận tình, dịch vụ phòng 24/7 chuyên nghiệp.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Cam kết giá tốt nhất MeGo
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Đảm bảo giá minh bạch, không phí ẩn và tích điểm MeGo Club.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Xác nhận đặt phòng tức thì
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhận voucher đặt phòng qua email và SMS trong vòng 60 giây.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Trải nghiệm nghỉ dưỡng chuẩn mực
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống phòng sạch sẽ, tiện nghi đầy đủ, view thoáng đãng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
