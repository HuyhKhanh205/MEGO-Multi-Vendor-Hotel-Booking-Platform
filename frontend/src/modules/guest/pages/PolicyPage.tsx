import { useParams, Link } from "react-router-dom";

const POLICIES_META: Record<
  string,
  { title: string; category: string; description: string }
> = {
  refund: {
    title: "Chính sách hoàn tiền nhanh",
    category: "Chính sách & An tâm",
    description:
      "Quy trình xử lý hoàn tiền cho khách hàng khi hủy phòng theo đúng quy định hủy miễn phí của cơ sở lưu trú.",
  },
  "best-price": {
    title: "Đảm bảo giá tốt nhất",
    category: "Chính sách & An tâm",
    description:
      "Cam kết giá phòng trực tiếp từ đối tác khách sạn, không qua phí hoa hồng trung gian.",
  },
  terms: {
    title: "Điều khoản & Điều kiện đặt phòng",
    category: "Pháp lý & Thỏa thuận",
    description:
      "Các điều khoản ràng buộc quyền và nghĩa vụ giữa khách hàng, đối tác cơ sở lưu trú và nền tảng MeGo.",
  },
  privacy: {
    title: "Bảo mật thông tin thanh toán",
    category: "Bảo mật & Quyền riêng tư",
    description:
      "Tiêu chuẩn bảo mật dữ liệu giao dịch trực tuyến và mã hóa thông tin tài khoản theo tiêu chuẩn.",
  },
  "operating-regulations": {
    title: "Quy chế hoạt động MeGo",
    category: "Pháp lý & Vận hành",
    description:
      "Quy chế sàn thương mại điện tử / website cung cấp dịch vụ đặt phòng khách sạn trực tiếp MeGo.",
  },
  cookies: {
    title: "Chính sách Cookie",
    category: "Quyền riêng tư",
    description:
      "Cách thức MeGo sử dụng cookie để tối ưu trải nghiệm duyệt web và ghi nhớ tùy chọn tiền tệ, ngôn ngữ.",
  },
  "mego-club": {
    title: "Chính sách quyền lợi MeGo Club",
    category: "Chương trình thành viên",
    description:
      "Quyền lợi và điều kiện áp dụng cho Hội viên MeGo Club: giảm giá 15% đơn đặt đầu tiên, tích điểm đổi đêm nghỉ, nâng hạng VIP và check-in sớm miễn phí tại các resort đối tác.",
  },
};

export const PolicyPage = () => {
  const { policyId = "terms" } = useParams();
  const currentPolicy = POLICIES_META[policyId] || {
    title: "Thông tin chính sách",
    category: "Chính sách MeGo",
    description: "Trang thông tin chính sách của nền tảng.",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-50 text-[#1677FF] px-3 py-1 rounded-full font-semibold">
            {currentPolicy.category}
          </span>
          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
            Nội dung mẫu (Đang chờ duyệt pháp lý)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
          {currentPolicy.title}
        </h1>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {currentPolicy.description}
        </p>

        {/* Notice for legal disclaimer as requested */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Lưu ý:</strong> Văn bản chính thức của chính sách này đang được đội ngũ pháp lý hoàn thiện. MeGo cam kết tuân thủ quy định pháp luật thương mại điện tử hiện hành của Việt Nam.
        </div>

        <div className="mt-8 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-900 text-base">1. Phạm vi áp dụng</h2>
          <p>
            Quy định này áp dụng cho toàn bộ các giao dịch đặt phòng, lưu trú phát sinh giữa khách hàng (Customer/Guest) và các đối tác khách sạn (Partner) thông qua nền tảng MeGo.
          </p>

          <h2 className="font-bold text-gray-900 text-base">2. Quyền lợi và trách nhiệm</h2>
          <p>
            Mọi thông tin về tình trạng phòng, tiện ích và giá niêm yết được cập nhật trực tiếp bởi cơ sở lưu trú. MeGo chịu trách nhiệm bảo đảm kết nối thông tin minh bạch, bảo mật và hỗ trợ giải quyết thắc mắc 24/7.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            to="/"
            className="text-xs sm:text-sm text-[#1677FF] hover:underline font-semibold"
          >
            &larr; Về trang chủ
          </Link>
          <span className="text-[11px] text-gray-400">
            Route: /policies/{policyId}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
