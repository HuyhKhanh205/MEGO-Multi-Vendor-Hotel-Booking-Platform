import { Box, Typography, useTheme } from "@mui/material";
import type { ChatMessage } from "../../types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const theme = useTheme();
  const isUser = message.role === "user";

  return (
    <Box
      component="li"
      sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}
    >
      <Box
        sx={{
          maxWidth: "85%",
          px: 1.5,
          py: 1,
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
          color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}
