import { Link } from "react-router-dom";

const OffersPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-medium">
          Route: /offers
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">
          Ưu đãi & Khuyến mãi MeGo
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Tổng hợp các chương trình giảm giá và mã voucher độc quyền từ các đối tác khách sạn.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-full shadow-xs">
              MÃ: MEGOFIRST
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-3">Giảm 15% cho người dùng mới</h3>
            <p className="text-xs text-gray-600 mt-1">Áp dụng cho mọi khách sạn trên toàn quốc.</p>
          </div>

          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
            <span className="text-xs font-bold text-amber-700 bg-white px-2.5 py-1 rounded-full shadow-xs">
              MÃ: SUMMER2026
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-3">Giảm tới 30% phòng nghỉ ven biển</h3>
            <p className="text-xs text-gray-600 mt-1">Dành riêng cho các đối tác tại Nha Trang, Phú Quốc, Đà Nẵng.</p>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-[#1677FF] hover:underline font-medium">
            &larr; Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
