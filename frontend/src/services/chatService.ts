import apiClient from "./apiClient";
import type {
  ChatBookingRequest,
  ChatBookingResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat";

export const CHAT_API_ENDPOINT = "/chat";
export const CHAT_BOOK_ENDPOINT = "/chat/book";
export const CHAT_MOCK_FAILURE_CODE = "CHAT_MOCK_FAILURE";

const useMock = import.meta.env.VITE_CHAT_USE_MOCK === "true";
const failMockOnce = import.meta.env.VITE_CHAT_MOCK_FAIL_ONCE === "true";
let mockFailureConsumed = false;

const waitForMockResponse = (signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timeoutId = globalThis.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, 800);
    const onAbort = () => {
      globalThis.clearTimeout(timeoutId);
      reject(new DOMException("Request aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });

const getMockReply = (request: ChatRequest): string => {
  const roleReplies = {
    vi: {
      GUEST: "Tôi có thể hướng dẫn bạn tìm khách sạn, xem phòng trống và bắt đầu đặt phòng trên MEGO.",
      CUSTOMER: "Tôi có thể giúp bạn tìm thông tin đơn đặt, thanh toán và kiểm tra chính sách của khách sạn.",
      PARTNER: "Tôi có thể hướng dẫn bạn quản lý khách sạn, tình trạng phòng và các đơn đặt mới.",
      ADMIN: "Tôi có thể hỗ trợ bạn tìm các khu vực quản trị người dùng, khách sạn và hoạt động hệ thống.",
    },
    en: {
      GUEST: "I can guide you through finding hotels, checking room availability, and starting a booking on MEGO.",
      CUSTOMER: "I can help you find booking details, payment options, and hotel cancellation terms.",
      PARTNER: "I can guide you through managing hotels, room availability, and new bookings.",
      ADMIN: "I can help you find the areas for managing users, hotels, and system activity.",
    },
  } as const;
  const intro = roleReplies[request.language][request.role];
  return request.language === "en"
    ? `${intro}\n\nYou asked: “${request.message}”`
    : `${intro}\n\nBạn vừa hỏi: “${request.message}”`;
};

export const chatService = {
  async sendMessage(
    request: ChatRequest,
    options: { signal?: AbortSignal } = {},
  ): Promise<ChatResponse> {
    if (useMock) {
      await waitForMockResponse(options.signal);
      if (failMockOnce && !mockFailureConsumed) {
        mockFailureConsumed = true;
        throw new Error(CHAT_MOCK_FAILURE_CODE);
      }
      return { reply: getMockReply(request) };
    }

    const response = await apiClient.post<ChatResponse>(
      CHAT_API_ENDPOINT,
      request,
      { signal: options.signal },
    );
    if (typeof response.data?.reply !== "string") {
      throw new Error("CHAT_INVALID_RESPONSE");
    }
    return response.data;
  },

  async bookRoomFromChat(
    payload: ChatBookingRequest,
  ): Promise<ChatBookingResponse> {
    const response = await apiClient.post<ChatBookingResponse>(
      CHAT_BOOK_ENDPOINT,
      payload,
    );
    return response.data;
  },
};
