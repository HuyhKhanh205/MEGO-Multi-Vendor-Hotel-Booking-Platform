import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CHAT_SUGGESTIONS } from "../../data/chatSuggestions";
import type { ChatUserRole } from "../../types/chat";

interface SuggestedPromptsProps {
  role: ChatUserRole;
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ role, onSelect }: SuggestedPromptsProps) {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        {t("chat.suggestions.heading")}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {CHAT_SUGGESTIONS[role].map((key) => (
          <Button
            key={key}
            variant="outlined"
            size="small"
            onClick={() => onSelect(t(key))}
            sx={{
              borderRadius: "10px",
              px: 1.25,
              py: 0.5,
              fontSize: "0.72rem",
              lineHeight: 1.35,
              textAlign: "left",
              "&:focus-visible": { outline: "2px solid", outlineOffset: 2 },
            }}
          >
            {t(key)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
