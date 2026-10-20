import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const HOTELS_DATA = [
  {
    id: 1,
    name: "Furama Resort Đà Nẵng",
    city: "Đà Nẵng",
    area: "Bãi biển Bắc Mỹ An",
    type: "resort",
    price: "2.850.000₫",
    rating: "4.9",
    img: "🏨",
    distance: "50m ra biển",
  },
  {
    id: 2,
    name: "Vinpearl Resort & Spa Nha Trang",
    city: "Nha Trang",
    area: "Đảo Hòn Tre",
    type: "resort",
    price: "2.690.000₫",
    rating: "4.8",
    img: "🏖️",
    distance: "Mặt biển",
  },
  {
    id: 3,
    name: "JW Marriott Emerald Bay Phú Quốc",
    city: "Phú Quốc",
    area: "Bãi Khem",
    type: "resort",
    price: "4.890.000₫",
    rating: "4.9",
    img: "🏝️",
    distance: "Sát bờ cát",
  },
  {
    id: 4,
    name: "The Imperial Hotel Vũng Tàu",
    city: "Vũng Tàu",
    area: "Bãi Sau",
    type: "hotel",
    price: "1.850.000₫",
    rating: "4.7",
    img: "🌅",
    distance: "100m ra biển",
  },
  {
    id: 5,
    name: "Dalat Edensee Lake Resort & Spa",
    city: "Đà Lạt",
    area: "Hồ Tuyền Lâm",
    type: "resort",
    price: "2.190.000₫",
    rating: "4.8",
    img: "🌲",
    distance: "Ven hồ Tuyền Lâm",
  },
  {
    id: 6,
    name: "Khách sạn Sài Gòn Luxury",
    city: "Hồ Chí Minh",
    area: "Quận 1",
    type: "hotel",
    price: "1.250.000₫",
    rating: "4.8",
    img: "🏙️",
    distance: "Trung tâm Quận 1",
  },
];

const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const destination = searchParams.get("destination") || "";
  const hotelType = searchParams.get("type") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";
  const rooms = searchParams.get("rooms") || "";
  const isMapViewParam = searchParams.get("view") === "map";

  const [isMapView, setIsMapView] = useState<boolean>(isMapViewParam);

  const toggleMapView = () => {
    const nextMode = !isMapView;
    setIsMapView(nextMode);
    const updated = new URLSearchParams(searchParams);
    if (nextMode) {
      updated.set("view", "map");
    } else {
      updated.delete("view");
    }
    setSearchParams(updated);
  };

  const filteredHotels = HOTELS_DATA.filter((hotel) => {
    let matches = true;
    if (keyword) {
      const q = keyword.toLowerCase();
      matches =
        matches &&
        (hotel.name.toLowerCase().includes(q) ||
          hotel.city.toLowerCase().includes(q));
    }
    if (destination) {
      const d = destination.toLowerCase().replace(/\s+/g, "");
      const hotelCity = hotel.city.toLowerCase().replace(/\s+/g, "");
      matches = matches && (hotelCity.includes(d) || d.includes(hotelCity));
    }
    if (hotelType && hotelType !== "deals" && hotelType !== "5-star") {
      matches = matches && hotel.type === hotelType;
    }
    return matches;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        {/* Top Header & Search Criteria Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-bold">
                Tìm kiếm khách sạn
              </span>
              {checkIn && checkOut && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  📅 {checkIn} &rarr; {checkOut}
                </span>
              )}
              {guests && (
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  👥 {guests} khách {rooms ? `• ${rooms} phòng` : ""}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {destination ? `Khách sạn tại ${destination}` : "Tất cả khách sạn & Resort đối tác"}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {keyword ? (
                <span>
                  Từ khóa tìm kiếm: <strong className="text-[#1677FF]">"{keyword}"</strong>
                </span>
              ) : (
                "Hiển thị danh sách khách sạn đối tác trực tiếp, cam kết giá tốt nhất"
              )}
            </p>
          </div>

          {/* Toggle Map View and Filters */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleMapView}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isMapView
                  ? "bg-[#1677FF] text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <span>🗺️</span>
              <span>{isMapView ? "Chế độ danh sách" : "Xem bản đồ MeGo Radar"}</span>
            </button>

            {(destination || keyword || hotelType || isMapView) && (
              <Link
                to="/hotels"
                onClick={() => setIsMapView(false)}
                className="text-xs text-gray-500 hover:text-red-600 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-colors"
              >
                ✕ Xóa lọc
              </Link>
            )}
          </div>
        </div>

        {/* View Mode: Map View vs Grid View */}
        {isMapView ? (
          <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 relative aspect-[16/9] min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"
              alt="Bản đồ khách sạn MeGo Radar"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Radar Pins */}
            <div className="absolute top-1/4 left-1/3 p-2 bg-white rounded-xl shadow-lg border border-blue-200 text-xs font-bold text-[#1677FF] flex items-center gap-1.5">
              <span>🏨</span> Furama Resort • 2.850.000₫
            </div>
            <div className="absolute top-1/2 right-1/4 p-2 bg-[#1677FF] rounded-xl shadow-lg text-white text-xs font-bold flex items-center gap-1.5">
              <span>★ 4.9</span> Vinpearl Nha Trang • 2.690.000₫
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-gray-900">
                  MeGo Radar Map Preview (Dữ liệu bản đồ minh họa)
                </span>
                <span className="text-gray-400 hidden md:inline">
                  • Khoảng cách tính toán tự động đến biển và trung tâm
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMapView(false)}
                className="text-xs font-bold text-[#1677FF] hover:underline"
              >
                &larr; Quay lại danh sách thẻ
              </button>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div>
            {filteredHotels.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-base font-bold text-gray-800">Không tìm thấy khách sạn phù hợp.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Thử tìm kiếm với tên thành phố khác hoặc bỏ bớt tiêu chí lọc.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="p-5 border border-gray-100 rounded-2xl bg-gray-50/60 hover:bg-white hover:border-blue-200 transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-4xl mb-3">{hotel.img}</div>
                      <h3 className="font-bold text-gray-900 text-base">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>📍 {hotel.area}, {hotel.city}</span>
                        <span>•</span>
                        <span className="text-[#00A389] font-medium">{hotel.distance}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-gray-200/70">
                      <div>
                        <span className="text-sm sm:text-base font-extrabold text-[#1677FF]">
                          {hotel.price}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/đêm</span>
                      </div>
                      <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                        ★ {hotel.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-[#1677FF] hover:underline font-semibold"
          >
            &larr; Về trang chủ
          </Link>
          <span className="text-xs text-gray-400">
            Dữ liệu kết nối động với thanh tìm kiếm Hero và MeGo Radar
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
