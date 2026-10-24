import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import type { ChatMessage } from "../../types/chat";
import ChatMessageItem from "./ChatMessageItem";
import TypingIndicator from "./TypingIndicator";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length, isLoading]);

  return (
    <Box
      ref={listRef}
      component="ol"
      aria-live="polite"
      aria-relevant="additions text"
      sx={{
        listStyle: "none",
        m: 0,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        flex: 1,
        overflowY: "auto",
      }}
    >
      {messages.map((message) => <ChatMessageItem key={message.id} message={message} />)}
      {isLoading && <Box component="li"><TypingIndicator /></Box>}
    </Box>
  );
}
