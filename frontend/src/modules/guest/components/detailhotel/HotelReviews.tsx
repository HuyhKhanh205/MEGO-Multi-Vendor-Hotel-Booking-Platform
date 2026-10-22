import { useState } from "react";
import { Star, ThumbsUp, Sparkles, ChevronRight } from "../../../../components/common/Icons";
import type { HotelReview } from "../../../../types/hotel";

interface HotelReviewsProps {
  rating: number;
  ratingText: string;
  reviewCount: number;
}

const DEFAULT_REVIEWS: HotelReview[] = [
  {
    id: "rev-1",
    authorName: "Nguyễn Hoàng Nam",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    rating: 10,
    ratingText: "Kỳ nghỉ tuyệt vời ngoài mong đợi",
    stayDate: "Tháng 10/2026",
    roomType: "Ocean Suite Hướng Biển",
    travelerType: "Gia đình",
    comment:
      "Khách sạn rất đẹp, khuôn viên xanh mát và hồ bơi nhìn thẳng ra biển cực kỳ ấn tượng. Nhân viên phục vụ rất chu đáo và thân thiện. Bữa sáng buffet phong phú và ngon miệng. Chắc chắn sẽ quay lại!",
    likes: 24,
  },
  {
    id: "rev-2",
    authorName: "Trần Minh Anh",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 9.6,
    ratingText: "Dịch vụ đẳng cấp, phòng sạch sẽ",
    stayDate: "Tháng 09/2026",
    roomType: "Deluxe Hướng Vườn",
    travelerType: "Cặp đôi",
    comment:
      "Vị trí ngay sát bãi biển Mỹ Khê, đi lại rất thuận tiện. Phòng ốc rộng rãi, nội thất gỗ sang trọng và ban công đón gió biển rất thoáng. Rất đáng giá tiền bỏ ra.",
    likes: 18,
  },
  {
    id: "rev-3",
    authorName: "Lê Quốc Bảo",
    authorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    rating: 9.2,
    ratingText: "Rất hài lòng về chất lượng",
    stayDate: "Tháng 08/2026",
    roomType: "Deluxe Giường Đôi",
    travelerType: "Công tác",
    comment:
      "Hệ thống Wi-Fi rất nhanh và ổn định, tiện cho việc họp trực tuyến. Đồ ăn sáng ngon, nhân viên lễ tân hỗ trợ check-in rất nhanh chóng.",
    likes: 12,
  },
];

export const HotelReviews = ({
  rating,
  ratingText,
  reviewCount,
}: HotelReviewsProps) => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedKeys, setLikedKeys] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, initialLikes: number) => {
    if (likedKeys[id]) return;
    setLikedKeys((prev) => ({ ...prev, [id]: true }));
    setLikesMap((prev) => ({ ...prev, [id]: (prev[id] ?? initialLikes) + 1 }));
  };

  return (
    <section id="reviews-section" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* ── Section Title ── */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Đánh giá từ khách hàng thực tế
        </h2>
        <div className="h-1 w-12 bg-[#1677FF] rounded-full" />
      </div>

      {/* ── Rating Score Breakdown Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
        {/* Overall Big Badge */}
        <div className="md:col-span-4 text-center md:text-left flex flex-col sm:flex-row md:flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <span className="w-16 h-16 rounded-2xl bg-[#1677FF] text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
              {rating.toFixed(1)}
            </span>
            <div>
              <p className="text-base font-extrabold text-slate-900">
                {ratingText || "Xuất sắc"}
              </p>
              <p className="text-xs text-slate-500">
                Dựa trên {reviewCount.toLocaleString("vi-VN")} lượt đánh giá
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            100% đánh giá từ khách đã lưu trú thật
          </span>
        </div>

        {/* Detailed Category Bars */}
        <div className="md:col-span-8 space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Vị trí & Cảnh quan xung quanh</span>
              <span className="text-[#1677FF]">9.8 / 10</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1677FF] rounded-full w-[98%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Vệ sinh & Độ sạch sẽ</span>
              <span className="text-[#1677FF]">9.7 / 10</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1677FF] rounded-full w-[97%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Thái độ phục vụ của nhân viên</span>
              <span className="text-[#1677FF]">9.8 / 10</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1677FF] rounded-full w-[98%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span>Tiện nghi & Dịch vụ đi kèm</span>
              <span className="text-[#1677FF]">9.5 / 10</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#1677FF] rounded-full w-[95%]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews Cards List ── */}
      <div className="space-y-4 pt-2">
        {DEFAULT_REVIEWS.map((rev) => {
          const currentLikes = likesMap[rev.id] ?? rev.likes;
          const isLiked = likedKeys[rev.id];

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all space-y-3"
            >
              {/* Author info + Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.authorAvatar}
                    alt={rev.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {rev.authorName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Đã nghỉ dưỡng vào {rev.stayDate} • Hạng phòng: {rev.roomType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-[#1677FF] font-extrabold text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#1677FF]" />
                  <span>{rev.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Helpful footer button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Loại chuyến đi: {rev.travelerType}
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(rev.id, rev.likes)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isLiked
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-blue-600" : ""}`} />
                  <span>Hữu ích ({currentLikes})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View more reviews CTA */}
      <div className="text-center pt-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <span>Xem thêm tất cả đánh giá ({reviewCount})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
