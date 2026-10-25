import { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton, Paper, Tooltip, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppSelector } from "../../stores/store";
import type {
  ChatBookingResponse,
  ChatMessage,
  ChatRoomCard,
  ChatUserRole,
} from "../../types/chat";
import ChatBookingWizard from "./ChatBookingWizard";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import SuggestedPrompts from "./SuggestedPrompts";

export const PENDING_CHAT_BOOK_KEY = "mego_pending_chat_book";

interface ChatPanelProps {
  role: ChatUserRole;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onClear: () => void;
  onSend: (message: string) => void;
  onRetry: () => void;
  onBookingComplete: (result: ChatBookingResponse) => void;
}

export default function ChatPanel({
  role,
  messages,
  isLoading,
  error,
  onClose,
  onClear,
  onSend,
  onRetry,
  onBookingComplete,
}: ChatPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [activeWizardCard, setActiveWizardCard] = useState<ChatRoomCard | null>(null);

  // Tự động khôi phục phòng đang chọn để đặt sau khi người dùng đăng nhập xong và quay lại
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const saved = sessionStorage.getItem(PENDING_CHAT_BOOK_KEY);
      if (saved) {
        sessionStorage.removeItem(PENDING_CHAT_BOOK_KEY);
        const parsed = JSON.parse(saved) as ChatRoomCard;
        if (parsed && parsed.hotelId && parsed.roomId) {
          setActiveWizardCard(parsed);
        }
      }
    } catch {
      // Ignore storage error
    }
  }, [isAuthenticated]);

  const handleStartQuickBook = (card: ChatRoomCard) => {
    if (!isAuthenticated) {
      try {
        sessionStorage.setItem(PENDING_CHAT_BOOK_KEY, JSON.stringify(card));
      } catch {
        // Ignore storage error
      }
      toast.info("Vui lòng đăng nhập tài khoản để đặt phòng trực tiếp trên Chatbox.", {
        position: "top-right",
      });
      const redirectUrl = location.pathname + location.search;
      onClose();
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    setActiveWizardCard(card);
  };

  const handleClearAll = () => {
    setActiveWizardCard(null);
    try {
      sessionStorage.removeItem(PENDING_CHAT_BOOK_KEY);
    } catch {
      // Ignore
    }
    onClear();
  };

  return (
    <Paper
      component="section"
      role="dialog"
      aria-labelledby="mego-chat-title"
      elevation={5}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "14px",
        bgcolor: "background.paper",
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 1.75,
          py: 1.25,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <AutoAwesomeIcon aria-hidden="true" />
        <Typography id="mego-chat-title" variant="subtitle1" sx={{ color: "inherit", flex: 1, fontWeight: 700 }}>
          {t("chat.assistantName")}
        </Typography>
        <Tooltip title={t("chat.clear")}>
          <span>
            <IconButton
              onClick={handleClearAll}
              disabled={messages.length === 0 && !error}
              aria-label={t("chat.clear")}
              color="inherit"
              size="small"
              sx={{ "&:focus-visible": { outline: "2px solid currentColor" } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t("chat.close")}>
          <IconButton
            onClick={onClose}
            aria-label={t("chat.close")}
            color="inherit"
            size="small"
            sx={{ "&:focus-visible": { outline: "2px solid currentColor" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {messages.length === 0 ? (
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>{t("chat.greeting")}</Typography>
            <Typography variant="body2" color="text.secondary">{t("chat.intro")}</Typography>
          </Box>
          <SuggestedPrompts role={role} onSelect={onSend} />
        </Box>
      ) : (
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          onStartQuickBook={handleStartQuickBook}
        />
      )}

      {/* Khung Đặt phòng từng bước (3 bước) ngay trong Chatbox — chỉ mở khi đã đăng nhập */}
      {isAuthenticated && activeWizardCard && (
        <ChatBookingWizard
          card={activeWizardCard}
          onCancel={() => setActiveWizardCard(null)}
          onSuccess={(result) => {
            setActiveWizardCard(null);
            onBookingComplete(result);
          }}
        />
      )}

      {error && (
        <Alert
          severity="error"
          role="alert"
          action={
            <Button color="inherit" size="small" onClick={onRetry} disabled={isLoading}>
              {t("chat.retry")}
            </Button>
          }
          sx={{ mx: 1.25, mb: 1, alignItems: "center", "& .MuiAlert-message": { overflowWrap: "anywhere" } }}
        >
          {error}
        </Alert>
      )}

      <ChatInput disabled={isLoading} onSend={onSend} />
    </Paper>
  );
}
