import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TypingIndicator() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 1, px: 0.5 }}>
      <Box sx={{ display: "flex", gap: 0.4 }} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              animation: "mego-chat-pulse 1s infinite ease-in-out",
              animationDelay: `${index * 120}ms`,
              "@keyframes mego-chat-pulse": {
                "0%, 60%, 100%": { opacity: 0.35, transform: "translateY(0)" },
                "30%": { opacity: 1, transform: "translateY(-3px)" },
              },
              "@media (prefers-reduced-motion: reduce)": { animation: "none", opacity: 1 },
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">{t("chat.typing")}</Typography>
    </Box>
  );
}
