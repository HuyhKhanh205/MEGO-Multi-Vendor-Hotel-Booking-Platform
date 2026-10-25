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
          heading: "Bạn có thể hỏi",
          guest: {
            search: "Tôi có thể tìm phòng theo địa điểm và ngày như thế nào?",
            booking: "Các bước đặt phòng trên MEGO là gì?",
            cancellation: "Tôi có thể hủy đặt phòng theo chính sách nào?",
          },
          customer: {
            search: "Làm sao tìm phòng phù hợp với chuyến đi của tôi?",
            booking: "Tôi xem và thanh toán đơn đặt phòng ở đâu?",
            cancellation: "Làm sao kiểm tra điều kiện hủy phòng?",
          },
          partner: {
            hotels: "Làm sao cập nhật thông tin khách sạn?",
            rooms: "Tôi quản lý giá và tình trạng phòng ở đâu?",
            bookings: "Làm sao xử lý các đơn đặt phòng mới?",
          },
          admin: {
            users: "Tôi quản lý tài khoản và phân quyền ở đâu?",
            hotels: "Làm sao duyệt khách sạn của đối tác?",
            system: "Tôi xem tình trạng hoạt động của hệ thống ở đâu?",
          },
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
          heading: "You can ask",
          guest: {
            search: "How can I find a room by destination and dates?",
            booking: "How do I book a room on MEGO?",
            cancellation: "What is the cancellation policy for a booking?",
          },
          customer: {
            search: "How can I find a room that fits my trip?",
            booking: "Where can I view and pay for my booking?",
            cancellation: "How do I check the room cancellation terms?",
          },
          partner: {
            hotels: "How can I update my hotel details?",
            rooms: "Where can I manage room prices and availability?",
            bookings: "How do I handle new bookings?",
          },
          admin: {
            users: "Where can I manage accounts and permissions?",
            hotels: "How do I review a partner hotel?",
            system: "Where can I view system activity?",
          },
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
