import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authReducer from "./authSlice";
import chatReducer, { persistChatMessages } from "./chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

let previousMessages = store.getState().chat.messages;
store.subscribe(() => {
  const messages = store.getState().chat.messages;
  if (messages !== previousMessages) {
    previousMessages = messages;
    persistChatMessages(messages);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
