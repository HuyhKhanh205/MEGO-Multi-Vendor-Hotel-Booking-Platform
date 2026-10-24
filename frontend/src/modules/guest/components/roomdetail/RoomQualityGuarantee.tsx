import React from "react";
import { Shield, CheckCircle2, Award } from "../../../../components/common/Icons";

interface RoomQualityGuaranteeProps {
  signatureBadge?: string;
}

export const RoomQualityGuarantee: React.FC<RoomQualityGuaranteeProps> = ({
  signatureBadge = "Hạng Signature",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex items-start gap-4">
      {/* Blue shield icon */}
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1677FF] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
        <Shield className="w-5 h-5 text-[#1677FF]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Cam kết hình ảnh thực tế 100%
            </h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>

          {signatureBadge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-3 h-3 text-amber-600" />
              <span>{signatureBadge}</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Tất cả góc nhìn và trang thiết bị phòng đã được đội ngũ thẩm định chất lượng MeGo xác thực trực tiếp tại khách sạn. Cam kết thông tin minh bạch, đúng thực tế 100%.
        </p>
      </div>
    </div>
  );
};

export default RoomQualityGuarantee;