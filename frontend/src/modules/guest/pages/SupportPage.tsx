import { Link } from "react-router-dom";
import { SUPPORT_INFO } from "../../../components/headerCustomer/headerData";

const SupportPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-medium">
          Route: /support
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">
          Trung tâm hỗ trợ khách hàng MeGo
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 trong suốt hành trình đặt phòng.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-gray-900">Hotline 24/7</h3>
            <p className="text-2xl font-extrabold text-[#1677FF] mt-2">
              {SUPPORT_INFO.hotline}
            </p>
            <p className="text-xs text-gray-500 mt-1">{SUPPORT_INFO.hotlineTime}</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="font-bold text-gray-900">Email phản hồi</h3>
            <p className="text-base font-bold text-gray-800 mt-2">
              {SUPPORT_INFO.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">Phản hồi trong vòng 30 phút</p>
          </div>

          <div className="p-6 bg-green-50/50 rounded-2xl border border-green-200">
            <h3 className="font-bold text-gray-900">Tư vấn trực tuyến</h3>
            <p className="text-sm font-semibold text-green-700 mt-2">
              ● {SUPPORT_INFO.onlineStaff} tư vấn viên trực tuyến
            </p>
            <p className="text-xs text-gray-500 mt-1">Sẵn sàng giải đáp thắc mắc</p>
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

export default SupportPage;
