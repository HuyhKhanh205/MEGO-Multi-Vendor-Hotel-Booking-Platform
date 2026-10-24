import type { ChatUserRole } from "../types/chat";

export const CHAT_SUGGESTIONS: Record<ChatUserRole, readonly string[]> = {
  GUEST: [
    "chat.suggestions.guest.search",
    "chat.suggestions.guest.booking",
    "chat.suggestions.guest.cancellation",
  ],
  CUSTOMER: [
    "chat.suggestions.customer.search",
    "chat.suggestions.customer.booking",
    "chat.suggestions.customer.cancellation",
  ],
  PARTNER: [
    "chat.suggestions.partner.hotels",
    "chat.suggestions.partner.rooms",
    "chat.suggestions.partner.bookings",
  ],
  ADMIN: [
    "chat.suggestions.admin.users",
    "chat.suggestions.admin.hotels",
    "chat.suggestions.admin.system",
  ],
};

export const getChatRole = (role: string | undefined, isAuthenticated: boolean): ChatUserRole => {
  if (!isAuthenticated) return "GUEST";
  switch (role) {
    case "CUSTOMER":
    case "PARTNER":
    case "ADMIN":
    case "GUEST":
      return role;
    default:
      return "GUEST";
  }
};
