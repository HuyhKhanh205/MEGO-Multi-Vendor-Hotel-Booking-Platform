import { Link } from "react-router-dom";

const ExplorePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
        <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-medium">
          Route: /explore
        </span>
        <h1 className="text-2xl font-bold text-gray-900 mt-3">
          Khám phá điểm đến du lịch hàng đầu
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Tìm kiếm cảm hứng du lịch tại các thành phố xinh đẹp trên khắp Việt Nam.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {["Hà Nội", "Đà Nẵng", "Nha Trang", "Phú Quốc"].map((dest) => (
            <div
              key={dest}
              className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-300 transition-colors"
            >
              <h3 className="font-bold text-gray-800">{dest}</h3>
              <p className="text-xs text-gray-500 mt-1">Hơn 120+ khách sạn đối tác</p>
            </div>
          ))}
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

export default ExplorePage;
