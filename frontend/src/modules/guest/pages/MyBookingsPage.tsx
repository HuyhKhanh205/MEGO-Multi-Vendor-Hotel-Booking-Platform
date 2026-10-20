import { Link } from "react-router-dom";
import { useAppSelector } from "../../../stores/store";

const MyBookingsPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-medium">
              Route: /my-bookings
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Đặt chỗ của tôi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi tình trạng đơn đặt phòng và lịch sử lưu trú của bạn.
            </p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="mt-8 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-base font-bold text-gray-800">
              Vui lòng đăng nhập để xem danh sách đặt chỗ
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Đăng nhập tài khoản MeGo để quản lý mã đặt chỗ, kiểm tra xác nhận từ khách sạn và cập nhật thanh toán.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-[#1677FF] bg-white border border-[#1677FF] rounded-xl hover:bg-blue-50 transition-colors"
              >
                Đăng nhập ngay
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-[#1677FF] rounded-xl hover:bg-blue-700 transition-colors"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 mb-4">
              <p className="text-sm text-blue-900 font-semibold">
                Chào mừng trở lại, {user?.name || "Quý khách"}!
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Dưới đây là các đơn đặt phòng mẫu của bạn:
              </p>
            </div>

            <div className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1677FF] bg-blue-50 px-2.5 py-0.5 rounded-full">
                    #MG8923
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    Đà Lạt Mountain View Resort
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Nhận phòng: 24/10/2026 - Trả phòng: 26/10/2026 (2 đêm)
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg">
                  Chờ xác nhận
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100">
          <Link to="/" className="text-sm text-[#1677FF] hover:underline font-medium">
            &larr; Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
