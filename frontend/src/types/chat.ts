export type ChatRole = "user" | "assistant";

export type ChatUserRole = "GUEST" | "CUSTOMER" | "PARTNER" | "ADMIN";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatHistoryMessage[];
  role: ChatUserRole;
  language: "vi" | "en";
}

export interface ChatResponse {
  reply: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
