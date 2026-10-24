import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { IconButton, TextField, Tooltip, useTheme } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  disabled: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = value.trim();
    if (disabled || !message) return;
    onSend(message);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.closest("form")?.requestSubmit();
    }
  };

  return (
    <form onSubmit={submit}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: theme.spacing(1),
          padding: theme.spacing(1.25),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          maxRows={4}
          size="small"
          value={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.inputPlaceholder")}
          aria-label={t("chat.inputLabel")}
          slotProps={{ htmlInput: { "aria-label": t("chat.inputLabel") } }}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: "12px", p: 1.25 },
            "& .MuiInputBase-input": { p: 0, lineHeight: 1.5 },
          }}
        />
        <Tooltip title={t("chat.send")}>
          <span>
            <IconButton
              type="submit"
              color="primary"
              disabled={disabled || !value.trim()}
              aria-label={t("chat.send")}
              sx={{
                width: 42,
                height: 42,
                flex: "0 0 auto",
                "&.Mui-focusVisible": { outline: `3px solid ${theme.palette.primary.dark}` },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </form>
  );
}
