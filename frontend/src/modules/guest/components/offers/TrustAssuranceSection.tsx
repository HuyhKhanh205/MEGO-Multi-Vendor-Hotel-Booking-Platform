import React from "react";

export const TrustAssuranceSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14 sm:py-16 w-full">
      <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface-container-lowest shadow-xs border border-slate-100">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            Cam Kết An Tâm Tuyệt Đối Từ MeGo
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Minh bạch giá thành, không phí ẩn và hỗ trợ tận tâm trên từng bước chân hành trình của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-on-surface">
                Cam Kết Giá Tốt Nhất
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Nếu tìm thấy giá phòng cùng điều kiện rẻ hơn ở bất kỳ đâu, MeGo sẽ hoàn trả 100% phần tiền chênh lệch ngay lập tức.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">event_repeat</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-on-surface">
                Hủy Phòng Linh Hoạt
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Hầu hết các phòng ưu đãi đều hỗ trợ hủy phòng hoặc dời ngày linh hoạt miễn phí trước 48 giờ để quý khách luôn chủ động lịch trình.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">headset_mic</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-on-surface">
                Hỗ Trợ 24/7 Tận Tâm
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Đội ngũ trợ lý hành trình chuyên trách luôn túc trực hỗ trợ giải quyết nhận phòng, khiếu nại dịch vụ mọi thời điểm qua hotline và chat app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAssuranceSection;
