import { useEffect } from "react";
import { Box, Fab, Grow, ThemeProvider, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomTheme from "../../themes/CustomTheme";
import { setChatOpen } from "../../stores/chatSlice";
import { useAppDispatch, useAppSelector } from "../../stores/store";
import { getChatRole } from "../../data/chatSuggestions";
import { useChat } from "../../hooks/useChat";
import ChatPanel from "./ChatPanel";

const CHAT_HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

function ChatWidgetContent() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { isOpen, messages, isLoading, error } = useAppSelector((state) => state.chat);
  const auth = useAppSelector((state) => state.auth);
  const role = getChatRole(auth.user?.role, auth.isAuthenticated);
  const { sendMessage, retry, clearConversation } = useChat(role);
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const hidden = CHAT_HIDDEN_ROUTES.some((route) => currentPath === route);

  useEffect(() => {
    if (hidden) dispatch(setChatOpen(false));
  }, [dispatch, hidden]);

  useEffect(() => {
    if (!isOpen || hidden) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setChatOpen(false));
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, hidden, isOpen]);

  if (hidden) return null;

  const toggle = () => dispatch(setChatOpen(!isOpen));

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          right: "max(16px, env(safe-area-inset-right, 0px))",
          bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          zIndex: theme.zIndex.modal - 1,
        }}
      >
        <Tooltip title={isOpen ? t("chat.close") : t("chat.open")}>
          <Fab
            color="primary"
            size="large"
            onClick={toggle}
            aria-label={isOpen ? t("chat.close") : t("chat.open")}
            aria-expanded={isOpen}
            aria-controls={isOpen ? "mego-chat-panel" : undefined}
            sx={{
              boxShadow: 6,
              "&:focus-visible": { outline: `3px solid ${theme.palette.primary.dark}`, outlineOffset: 3 },
            }}
          >
            {isOpen ? <CloseIcon /> : <AutoAwesomeIcon />}
          </Fab>
        </Tooltip>
      </Box>

      <Grow in={isOpen} timeout={reducedMotion ? 0 : 180} mountOnEnter unmountOnExit>
        <Box
          id="mego-chat-panel"
          sx={{
            position: "fixed",
            right: "max(16px, env(safe-area-inset-right, 0px))",
            bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
            zIndex: theme.zIndex.modal - 1,
            width: 380,
            height: 560,
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100dvh - 104px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
            "@media (max-width: 639px)": {
              right: "max(12px, env(safe-area-inset-right, 0px))",
              bottom: "calc(84px + env(safe-area-inset-bottom, 0px))",
              width: "calc(100vw - 24px)",
              height: "calc(100dvh - 100px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
              maxHeight: "none",
            },
          }}
        >
          <ChatPanel
            role={role}
            messages={messages}
            isLoading={isLoading}
            error={error}
            onClose={() => dispatch(setChatOpen(false))}
            onClear={clearConversation}
            onSend={sendMessage}
            onRetry={retry}
          />
        </Box>
      </Grow>
    </>
  );
}

export default function ChatWidget() {
  return (
    <ThemeProvider theme={CustomTheme}>
      <ChatWidgetContent />
    </ThemeProvider>
  );
}
