import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  vi: {
    translation: {
      chat: {
        assistantName: "Trợ lý MEGO",
        open: "Mở trò chuyện với trợ lý MEGO",
        close: "Đóng trò chuyện",
        clear: "Xóa cuộc trò chuyện",
        greeting: "Xin chào! Tôi có thể giúp gì cho bạn?",
        intro: "Hãy hỏi tôi về đặt phòng, khách sạn hoặc cách sử dụng MEGO.",
        inputLabel: "Nhập tin nhắn",
        inputPlaceholder: "Nhập câu hỏi của bạn…",
        send: "Gửi tin nhắn",
        typing: "Trợ lý MEGO đang trả lời…",
        retry: "Thử lại",
        requestError: "Không thể gửi tin nhắn lúc này. Vui lòng thử lại.",
        mockError: "Lỗi mô phỏng để kiểm tra thao tác thử lại.",
        suggestions: {
          heading: "Truy vấn nhanh từ CSDL khách sạn",
          guest: {
            search: "Khách sạn 5 sao nào ở Đà Nẵng và Phú Quốc còn phòng trống?",
            booking: "Báo giá các hạng phòng Deluxe, Suite, Villa hiện có trong CSDL?",
            cancellation: "Chính sách giờ nhận/trả phòng và hủy phòng miễn phí của các khách sạn?",
          },
          customer: {
            search: "Gợi ý khách sạn 5 sao kèm giá phòng và số phòng còn trống hôm nay?",
            booking: "Quyền lợi và mức giảm giá các hạng thẻ MeGo Club (Silver, Gold, Platinum)?",
            cancellation: "Chính sách hủy phòng, hoàn tiền và mang theo thú cưng/trẻ em?",
          },
          partner: {
            hotels: "Thống kê số lượng khách sạn, hạng phòng và phòng trống trong CSDL?",
            rooms: "Cơ chế giữ chỗ chống đặt trùng phòng (anti-overbooking) hoạt động thế nào?",
            bookings: "Tỷ lệ hoa hồng đối tác và quy trình duyệt khách sạn trên MeGo?",
          },
          admin: {
            users: "Báo cáo tổng quan CSDL: số lượng người dùng, đối tác và khách sạn hiện có?",
            hotels: "Có bao nhiêu hồ sơ đối tác và khách sạn đang ở trạng thái chờ duyệt (PENDING)?",
            system: "Danh sách các hạng thành viên MeGo Club và cấu hình ưu đãi trong hệ thống?",
          },
        },
      },
      auth: {
        login: {
          title: "Đăng nhập",
          subtitle: "Đăng nhập để tiếp tục hành trình đặt phòng cùng MeGo",
          step1Badge: "Bước 1 / 2",
          step2Badge: "Bước 2 / 2",
          step1Title: "Định danh tài khoản",
          step2Title: "Xác thực mật khẩu",
          step2Subtitle: "Nhập mật khẩu cho tài khoản của bạn để hoàn tất đăng nhập",
          continueBtn: "Tiếp tục",
          changeAccount: "Đổi tài khoản",
          backToStep1: "Quay lại bước 1",
          emailLabel: "Địa chỉ Email",
          emailPlaceholder: "name@example.com",
          passwordLabel: "Mật khẩu",
          passwordPlaceholder: "Nhập mật khẩu của bạn",
          showPassword: "Hiện mật khẩu",
          hidePassword: "Ẩn mật khẩu",
          rememberMe: "Ghi nhớ đăng nhập",
          forgotPassword: "Quên mật khẩu?",
          submit: "Đăng nhập ngay",
          submitting: "Đang xác thực...",
          noAccount: "Chưa có tài khoản MeGo?",
          registerNow: "Đăng ký thành viên ngay",
          errorPrefix: "⚠️ Lỗi:",
          success: "Đăng nhập thành công!",
          securityNote: "Kết nối được mã hóa bảo mật SSL 256-bit",
          validation: {
            emailRequired: "Vui lòng nhập địa chỉ email",
            emailInvalid: "Định dạng email không hợp lệ (ví dụ: name@example.com)",
            passwordRequired: "Vui lòng nhập mật khẩu của bạn",
          },
          errors: {
            invalidCredentials: "Sai tài khoản hoặc mật khẩu",
            partnerPending: "Tài khoản đang chờ duyệt",
            partnerRejected: "Tài khoản đã bị từ chối",
            loginFailed: "Đăng nhập thất bại.",
          },
        },
        partnerLogin: {
          pageTitle: "Cổng đối tác | MeGo Khách sạn & Resort",
          title: "Cổng đối tác",
          subtitle: "Dành cho chủ khách sạn — Quản lý chỗ nghỉ, giá phòng và đặt phòng cùng MeGo",
          noAccount: "Chưa là đối tác của MeGo?",
          registerLinkText: "Đăng ký làm đối tác",
          backToGuest: "← Quay lại trang đặt phòng cho khách",
          hero: {
            badgeTopLeft: "Đối tác tại 63 tỉnh thành",
            badgeTopRight: "Tối ưu công suất phòng 2026",
            tag: "CỔNG ĐỐI TÁC • DÀNH CHO CHỦ KHÁCH SẠN",
            heading: "Đồng hành phát triển kinh doanh lưu trú bền vững cùng MeGo.",
            description:
              "Đăng nhập cổng đối tác để quản lý quỹ phòng thời gian thực, cập nhật giá linh hoạt, xử lý đặt phòng tức thì và theo dõi báo cáo doanh thu minh bạch 24/7.",
            benefit1: "Quản lý phòng & giá thời gian thực",
            benefit2: "Đối soát doanh thu minh bạch 24/7",
            trustSubtitle: "Hơn 12,000+ chủ khách sạn & resort tin tưởng hợp tác",
            verifiedBadge: "Đối tác xác thực",
          },
        },
        adminLogin: {
          pageTitle: "Đăng nhập Quản trị | MeGo System Admin",
          badge: "CỔNG QUẢN TRỊ HỆ THỐNG",
          title: "Đăng nhập Quản trị",
          subtitle: "Khu vực dành riêng cho quản trị viên hệ thống MeGo",
          backToHome: "← Quay lại trang chủ MeGo",
        },
      },
    },
  },
  en: {
    translation: {
      chat: {
        assistantName: "MEGO Assistant",
        open: "Open chat with the MEGO assistant",
        close: "Close chat",
        clear: "Clear conversation",
        greeting: "Hello! How can I help you?",
        intro: "Ask me about bookings, hotels, or using MEGO.",
        inputLabel: "Enter a message",
        inputPlaceholder: "Type your question…",
        send: "Send message",
        typing: "MEGO Assistant is replying…",
        retry: "Try again",
        requestError: "Your message could not be sent. Please try again.",
        mockError: "Mock failure for testing the retry action.",
        suggestions: {
          heading: "Quick Hotel Database Queries",
          guest: {
            search: "Which 5-star hotels in Da Nang and Phu Quoc have available rooms?",
            booking: "What are the current room rates for Deluxe, Suite, and Villa rooms?",
            cancellation: "What are the check-in/out times and free cancellation policies?",
          },
          customer: {
            search: "Show 5-star hotels with today's room prices and availability?",
            booking: "What are the MeGo Club member tiers (Silver, Gold, Platinum) and discounts?",
            cancellation: "What are the cancellation, refund, child, and pet policies?",
          },
          partner: {
            hotels: "Database stats: total hotels, room types, and available rooms today?",
            rooms: "How does the anti-overbooking room inventory hold mechanism work?",
            bookings: "What is the partner commission rate and hotel approval workflow?",
          },
          admin: {
            users: "System database overview: total users, partners, and hotels?",
            hotels: "How many partner profiles and hotels are currently PENDING approval?",
            system: "What MeGo Club member tiers and discounts are configured in the database?",
          },
        },
      },
      auth: {
        login: {
          title: "Sign In",
          subtitle: "Sign in to continue your booking journey with MeGo",
          step1Badge: "Step 1 / 2",
          step2Badge: "Step 2 / 2",
          step1Title: "Account Identifier",
          step2Title: "Password Verification",
          step2Subtitle: "Enter your password to complete sign in",
          continueBtn: "Continue",
          changeAccount: "Change",
          backToStep1: "Back to step 1",
          emailLabel: "Email Address",
          emailPlaceholder: "name@example.com",
          passwordLabel: "Password",
          passwordPlaceholder: "Enter your password",
          showPassword: "Show password",
          hidePassword: "Hide password",
          rememberMe: "Remember me",
          forgotPassword: "Forgot password?",
          submit: "Sign in now",
          submitting: "Authenticating...",
          noAccount: "Don't have a MeGo account?",
          registerNow: "Register as a member now",
          errorPrefix: "⚠️ Error:",
          success: "Signed in successfully!",
          securityNote: "Secured with 256-bit SSL encryption",
          validation: {
            emailRequired: "Please enter your email address",
            emailInvalid: "Invalid email format (e.g. name@example.com)",
            passwordRequired: "Please enter your password",
          },
          errors: {
            invalidCredentials: "Invalid email or password",
            partnerPending: "Your account is pending approval",
            partnerRejected: "Your account has been rejected",
            loginFailed: "Sign in failed.",
          },
        },
        partnerLogin: {
          pageTitle: "Partner Portal | MeGo Hotels & Resorts",
          title: "Partner Portal",
          subtitle: "For hotel owners — Manage your properties, room rates, and bookings with MeGo",
          noAccount: "Not a MeGo partner yet?",
          registerLinkText: "Register as a partner",
          backToGuest: "← Back to guest booking page",
          hero: {
            badgeTopLeft: "Partners in 63 provinces",
            badgeTopRight: "Occupancy Boost 2026",
            tag: "PARTNER PORTAL • FOR HOTEL OWNERS",
            heading: "Grow your hospitality business sustainably with MeGo.",
            description:
              "Sign in to the Partner Portal to manage real-time room inventory, adjust rates flexibly, handle bookings instantly, and track transparent revenue reports 24/7.",
            benefit1: "Real-time room & rate management",
            benefit2: "24/7 transparent payout tracking",
            trustSubtitle: "Trusted by 12,000+ hotel & resort partners",
            verifiedBadge: "Verified Partner",
          },
        },
        adminLogin: {
          pageTitle: "Admin Sign In | MeGo System Admin",
          badge: "SYSTEM ADMINISTRATION",
          title: "Admin Sign In",
          subtitle: "Restricted portal for MeGo system administrators",
          backToHome: "← Back to MeGo Home",
        },
      },
    },
  },
} as const;

const savedLanguage = (() => {
  try {
    return localStorage.getItem("mego_language") === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
})();

void i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "vi",
  interpolation: { escapeValue: false },
});

export default i18n;
