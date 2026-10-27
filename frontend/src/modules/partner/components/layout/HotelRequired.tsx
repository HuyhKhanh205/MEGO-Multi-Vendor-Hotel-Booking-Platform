import type { ReactNode } from "react";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import type { HotelSummaryDto } from "../../types/backend.types";
import { usePartnerHotel } from "./hotelContext";

/**
 * Chỉ hiển thị nội dung khi đã có khách sạn đang chọn; nếu chưa tải xong / lỗi / chưa có khách sạn
 * thì hiện trạng thái tương ứng. Dùng cho mọi trang quản trị cần hotelId.
 */
export const HotelRequired = ({ children }: { children: (hotel: HotelSummaryDto) => ReactNode }) => {
  const { selectedHotel, loading, error, reload } = usePartnerHotel();

  if (selectedHotel) return <>{children(selectedHotel)}</>;

  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải khách sạn" />;
  }

  if (error) {
    return (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center">
        <ErrorOutlineOutlined className="text-red-500" sx={{ fontSize: 40 }} />
        <p className="font-semibold text-slate-800">{error}</p>
        <button type="button" onClick={reload} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white">
          <RefreshOutlined sx={{ fontSize: 18 }} /> Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-white px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1677FF]">
        <ApartmentOutlined sx={{ fontSize: 30 }} />
      </span>
      <h1 className="text-xl font-extrabold text-slate-900">Tài khoản chưa có cơ sở lưu trú nào</h1>
      <p className="text-sm leading-relaxed text-slate-500">
        Cơ sở lưu trú sẽ xuất hiện tại đây sau khi hồ sơ được MeGo phê duyệt và gán cho tài khoản của bạn.
      </p>
    </div>
  );
};

export default HotelRequired;
