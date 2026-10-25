import { useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../stores/store";
import {
  addMessage,
  clearChat,
  setChatError,
  setChatLoading,
} from "../stores/chatSlice";
import { CHAT_MOCK_FAILURE_CODE, chatService } from "../services/chatService";
import type {
  ChatBookingResponse,
  ChatHistoryMessage,
  ChatMessage,
  ChatRoomCard,
  ChatUserRole,
} from "../types/chat";

interface FailedAttempt {
  message: string;
  history: ChatHistoryMessage[];
}

const createMessage = (
  role: ChatMessage["role"],
  content: string,
  extra?: {
    cards?: ChatRoomCard[];
    bookingConfirmation?: ChatBookingResponse;
  },
): ChatMessage => ({
  id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
  ...(extra?.cards && extra.cards.length > 0 ? { cards: extra.cards } : {}),
  ...(extra?.bookingConfirmation ? { bookingConfirmation: extra.bookingConfirmation } : {}),
});

export const useChat = (role: ChatUserRole) => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { t, i18n } = useTranslation();
  const controllerRef = useRef<AbortController | null>(null);
  const requestVersionRef = useRef(0);
  const failedAttemptRef = useRef<FailedAttempt | null>(null);

  const cancelPendingRequest = useCallback(() => {
    requestVersionRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    dispatch(setChatLoading(false));
  }, [dispatch]);

  useEffect(() => {
    failedAttemptRef.current = null;
    cancelPendingRequest();
    return cancelPendingRequest;
  }, [cancelPendingRequest, isAuthenticated, role]);

  const runRequest = useCallback(
    async (message: string, history: ChatHistoryMessage[], addUserMessage: boolean) => {
      const requestVersion = ++requestVersionRef.current;
      const controller = new AbortController();
      controllerRef.current?.abort();
      controllerRef.current = controller;
      failedAttemptRef.current = { message, history };
      if (addUserMessage) dispatch(addMessage(createMessage("user", message)));
      dispatch(setChatError(null));
      dispatch(setChatLoading(true));

      try {
        const language = i18n.resolvedLanguage?.toLowerCase().startsWith("en") ? "en" : "vi";
        const response = await chatService.sendMessage(
          { message, history, role, language },
          { signal: controller.signal },
        );
        if (requestVersion !== requestVersionRef.current) return;
        dispatch(
          addMessage(
            createMessage("assistant", response.reply, {
              cards: response.cards,
            }),
          ),
        );
        failedAttemptRef.current = null;
      } catch (error: unknown) {
        if (requestVersion !== requestVersionRef.current || controller.signal.aborted) return;
        const fallback = t("chat.requestError");
        if (error instanceof Error && error.message === CHAT_MOCK_FAILURE_CODE) {
          dispatch(setChatError(t("chat.mockError")));
        } else if (axios.isAxiosError<{ message?: unknown }>(error)) {
          const serverMessage = error.response?.data?.message;
          dispatch(setChatError(typeof serverMessage === "string" ? serverMessage : fallback));
        } else {
          dispatch(setChatError(fallback));
        }
      } finally {
        if (requestVersion === requestVersionRef.current) {
          controllerRef.current = null;
          dispatch(setChatLoading(false));
        }
      }
    },
    [dispatch, i18n.resolvedLanguage, role, t],
  );

  const sendMessage = useCallback(
    (content: string) => {
      const message = content.trim();
      if (!message || isLoading) return;
      const history = messages.map(({ role: messageRole, content: messageContent }) => ({
        role: messageRole,
        content: messageContent,
      }));
      void runRequest(message, history, true);
    },
    [isLoading, messages, runRequest],
  );

  const addBookingSuccessMessage = useCallback(
    (result: ChatBookingResponse) => {
      dispatch(
        addMessage(
          createMessage(
            "assistant",
            `MeGo đã ghi nhận yêu cầu đặt phòng ${result.roomName} tại ${result.hotelName}. Mã xác nhận của quý khách là ${result.bookingCode}.`,
            { bookingConfirmation: result },
          ),
        ),
      );
    },
    [dispatch],
  );

  const retry = useCallback(() => {
    const failedAttempt = failedAttemptRef.current;
    if (!failedAttempt || isLoading) return;
    void runRequest(failedAttempt.message, failedAttempt.history, false);
  }, [isLoading, runRequest]);

  const clearConversation = useCallback(() => {
    cancelPendingRequest();
    failedAttemptRef.current = null;
    dispatch(clearChat());
  }, [cancelPendingRequest, dispatch]);

  return { sendMessage, addBookingSuccessMessage, retry, clearConversation };
};
