import { Link } from "react-router-dom";

export const SitemapPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
        <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-semibold">
          Sitemap
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
          Sơ đồ website MeGo (Sitemap)
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Danh mục điều hướng toàn bộ các trang và chức năng chính trên nền tảng.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              Khám phá & Đặt phòng
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><Link to="/" className="hover:text-blue-600">• Trang chủ</Link></li>
              <li><Link to="/explore" className="hover:text-blue-600">• Khám phá điểm đến</Link></li>
              <li><Link to="/hotels" className="hover:text-blue-600">• Danh sách khách sạn</Link></li>
              <li><Link to="/offers" className="hover:text-blue-600">• Ưu đãi hot</Link></li>
              <li><Link to="/my-bookings" className="hover:text-blue-600">• Đặt chỗ của tôi</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              Tài khoản & Hỗ trợ
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><Link to="/login" className="hover:text-blue-600">• Đăng nhập</Link></li>
              <li><Link to="/register" className="hover:text-blue-600">• Đăng ký</Link></li>
              <li><Link to="/customer" className="hover:text-blue-600">• Trang cá nhân</Link></li>
              <li><Link to="/support" className="hover:text-blue-600">• Trung tâm trợ giúp</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
              Chính sách & Pháp lý
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><Link to="/policies/refund" className="hover:text-blue-600">• Hoàn tiền nhanh</Link></li>
              <li><Link to="/policies/best-price" className="hover:text-blue-600">• Giá tốt nhất</Link></li>
              <li><Link to="/policies/terms" className="hover:text-blue-600">• Điều khoản & Điều kiện</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-blue-600">• Bảo mật thanh toán</Link></li>
              <li><Link to="/policies/cookies" className="hover:text-blue-600">• Chính sách Cookie</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link to="/" className="text-sm text-[#1677FF] hover:underline font-semibold">
            &larr; Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
