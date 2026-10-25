import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logout } from "./authSlice";
import type { ChatMessage, ChatState } from "../types/chat";

const CHAT_STORAGE_KEY = "mego_chat_messages";

const readMessages = (): ChatMessage[] => {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is ChatMessage =>
        typeof message === "object" &&
        message !== null &&
        typeof message.id === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        typeof message.createdAt === "string",
    );
  } catch {
    return [];
  }
};

const initialState: ChatState = {
  messages: readMessages(),
  isOpen: false,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setChatLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setChatError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(logout, () => ({
      messages: [],
      isOpen: false,
      isLoading: false,
      error: null,
    }));
  },
});

export const { setChatOpen, addMessage, setChatLoading, setChatError, clearChat } =
  chatSlice.actions;

export const persistChatMessages = (messages: ChatMessage[]): void => {
  try {
    if (messages.length === 0) {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Continue without session persistence when storage is unavailable.
  }
};

export default chatSlice.reducer;
