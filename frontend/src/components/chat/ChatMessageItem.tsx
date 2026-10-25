import { Fragment, type ReactNode } from "react";
import { Box, Button, Chip, Typography, useTheme } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";
import type { ChatMessage, ChatRoomCard } from "../../types/chat";
import ChatRoomCardItem from "./ChatRoomCardItem";

interface ChatMessageItemProps {
  message: ChatMessage;
  onStartQuickBook: (card: ChatRoomCard) => void;
}

const formatVnd = (value: number): string =>
  `${Math.round(value || 0).toLocaleString("vi-VN")}₫`;

/**
 * Làm sạch ký tự thừa nhưng giữ lại cấu trúc dòng để parser render style nổi bật cho Tên & Giá.
 */
const normalizeRawText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/[📊🏨🌟📍🕒🛏️👇✨💎🏅🏊🛡️🏢⚙️💡📌🎉]/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^ +/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/**
 * Tô đậm & tạo điểm nhấn màu sắc cho Giá tiền (VNĐ/đêm), Phần trăm ưu đãi, Hạng sao và Tên khách sạn/phòng.
 */
const renderStyledInline = (line: string): ReactNode[] => {
  // Trước hết tách các cụm **in đậm** (nếu AI trả về) để chuyển thành thẻ in đậm thật, không lộ dấu **
  const cleanLine = line.replace(/\*\*(.*?)\*\*/g, "⟪B⟫$1⟪/B⟫").replace(/\*/g, "");

  // Regex nhận diện:
  // 1. Cụm được đánh dấu ⟪B⟫...⟪/B⟫
  // 2. Giá tiền VNĐ (ví dụ: 3.350.000 VNĐ/đêm, 1.450.000₫, từ 2.190.000 VNĐ/đêm)
  // 3. Mức giảm giá / phần trăm (ví dụ: Giảm 10%, 15%, -10%)
  // 4. Hạng sao (5 sao, 4 sao)
  // 5. Mã đặt phòng (MEGO-2026-XXXXXXXX)
  const tokenRegex =
    /(⟪B⟫.*?⟪\/B⟫|(?:\b(?:từ\s+)?)?\d{1,3}(?:\.\d{3})+(?:\s*(?:VNĐ|VND|đ|₫)(?:\/đêm)?)?|(?:Giảm(?:\s+trực\s+tiếp)?\s+\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?%\b)|\b[45]\s*sao\b|\bMEGO-\d{4}-[A-Z0-9]+\b)/gi;

  const parts = cleanLine.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("⟪B⟫") && part.endsWith("⟪/B⟫")) {
      const inner = part.slice(3, -4);
      return (
        <Box
          key={idx}
          component="span"
          sx={{ fontWeight: 700, color: "#0F172A" }}
        >
          {inner}
        </Box>
      );
    }

    // Giá tiền VNĐ -> Nổi bật với màu đỏ hồng sang trọng & nền pill nhẹ
    if (/\d{1,3}(?:\.\d{3})+\s*(?:VNĐ|VND|đ|₫)/i.test(part)) {
      return (
        <Box
          key={idx}
          component="span"
          sx={{
            display: "inline-block",
            px: 0.7,
            py: 0.1,
            mx: 0.2,
            borderRadius: "6px",
            bgcolor: "rgba(225, 29, 72, 0.08)",
            color: "#BE123C",
            fontWeight: 800,
            fontSize: "0.82rem",
          }}
        >
          {part}
        </Box>
      );
    }

    // Phần trăm ưu đãi -> Màu xanh ngọc lục bảo
    if (/%/.test(part)) {
      return (
        <Box
          key={idx}
          component="span"
          sx={{
            display: "inline-block",
            px: 0.6,
            py: 0.05,
            borderRadius: "5px",
            bgcolor: "rgba(16, 185, 129, 0.12)",
            color: "#047857",
            fontWeight: 800,
          }}
        >
          {part}
        </Box>
      );
    }

    // Hạng sao (5 sao, 4 sao) -> Màu vàng hổ phách sang trọng
    if (/^[45]\s*sao$/i.test(part.trim())) {
      return (
        <Box
          key={idx}
          component="span"
          sx={{
            display: "inline-block",
            px: 0.6,
            py: 0.05,
            borderRadius: "5px",
            bgcolor: "rgba(245, 158, 11, 0.14)",
            color: "#B45309",
            fontWeight: 700,
            fontSize: "0.76rem",
          }}
        >
          ★ {part.trim()}
        </Box>
      );
    }

    // Mã đặt phòng MEGO-2026-...
    if (/^MEGO-\d{4}-/i.test(part.trim())) {
      return (
        <Box
          key={idx}
          component="span"
          sx={{
            px: 0.7,
            py: 0.1,
            borderRadius: "5px",
            bgcolor: "rgba(22, 119, 255, 0.1)",
            color: "#1D4ED8",
            fontWeight: 800,
            fontFamily: "monospace",
          }}
        >
          {part}
        </Box>
      );
    }

    return <Fragment key={idx}>{part}</Fragment>;
  });
};

/**
 * Render một dòng bullet (• Tên khách sạn — Giá...) với bố cục tách biệt Tên & Nội dung rõ ràng.
 */
const renderBulletLine = (contentAfterBullet: string, key: number) => {
  // Nếu dòng có dạng "Tên khách sạn (5 sao, Đà Nẵng) — Giá từ ..." hoặc "Hạng Gold: ..."
  const dashSplit = contentAfterBullet.split(/\s*[—–-]\s+|\s*:\s*/);
  if (dashSplit.length >= 2) {
    const titlePart = dashSplit[0].replace(/\*\*/g, "").trim();
    const restPart = contentAfterBullet.slice(contentAfterBullet.indexOf(dashSplit[0]) + dashSplit[0].length);

    return (
      <Box
        key={key}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          p: 0.9,
          my: 0.4,
          borderRadius: "10px",
          bgcolor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "primary.main",
            mt: 0.85,
            flexShrink: 0,
          }}
        />
        <Box sx={{ flex: 1, fontSize: "0.82rem", lineHeight: 1.55 }}>
          <Box component="span" sx={{ fontWeight: 800, color: "#0F172A" }}>
            {renderStyledInline(titlePart)}
          </Box>
          <Box component="span" sx={{ color: "#334155" }}>
            {renderStyledInline(restPart)}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      key={key}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0.85,
        py: 0.35,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "primary.main",
          mt: 0.85,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, fontSize: "0.83rem", lineHeight: 1.6 }}>
        {renderStyledInline(contentAfterBullet)}
      </Box>
    </Box>
  );
};

export default function ChatMessageItem({
  message,
  onStartQuickBook,
}: ChatMessageItemProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isUser = message.role === "user";
  const hasCards = !isUser && Array.isArray(message.cards) && message.cards.length > 0;
  const booking = !isUser ? message.bookingConfirmation : undefined;
  const normalizedContent = isUser ? message.content : normalizeRawText(message.content);
  const lines = normalizedContent.split("\n");

  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 1,
      }}
    >
      {/* Nội dung tin nhắn văn bản — phân tách rõ Tên, Hạng sao & Giá tiền */}
      <Box
        sx={{
          maxWidth: isUser ? "84%" : "96%",
          px: 1.75,
          py: 1.25,
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          bgcolor: isUser ? theme.palette.primary.main : "#F8FAFC",
          color: isUser ? theme.palette.primary.contrastText : "#1E293B",
          border: isUser ? "none" : "1px solid #E2E8F0",
          boxShadow: isUser ? "none" : "0 2px 6px rgba(15, 23, 42, 0.04)",
        }}
      >
        {isUser ? (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              fontSize: "0.84rem",
              lineHeight: 1.6,
            }}
          >
            {message.content}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
            {lines.map((line, index) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <Box key={index} sx={{ height: 4 }} />;
              }
              if (trimmed.startsWith("•")) {
                return renderBulletLine(trimmed.slice(1).trim(), index);
              }
              return (
                <Typography
                  key={index}
                   component="div"
                  variant="body2"
                  sx={{
                    fontSize: "0.84rem",
                    lineHeight: 1.65,
                    color: "#1E293B",
                    overflowWrap: "anywhere",
                  }}
                >
                  {renderStyledInline(trimmed)}
                </Typography>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Danh sách Card phòng khách sạn từ CSDL (nếu có) */}
      {hasCards && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {message.cards!.map((card) => (
            <ChatRoomCardItem
              key={`${card.hotelId}-${card.roomId}`}
              card={card}
              onStartQuickBook={onStartQuickBook}
            />
          ))}
        </Box>
      )}

      {/* Thẻ vé xác nhận đặt phòng thành công ngay trên Chatbox */}
      {booking && (
        <Box
          sx={{
            width: "100%",
            p: 1.5,
            borderRadius: "12px",
            border: "1px solid #10B981",
            bgcolor: "#F0FDF4",
            color: "#064E3B",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 800, fontSize: "0.8rem" }}>
              <CheckCircleRoundedIcon sx={{ color: "#10B981", fontSize: 17 }} />
              <span>XÁC NHẬN ĐẶT PHÒNG</span>
            </Box>
            <Chip
              size="small"
              label={booking.bookingCode}
              sx={{
                bgcolor: "#059669",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
              }}
            />
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: "#065F46" }}>
            {booking.roomName}
          </Typography>
          <Typography sx={{ fontSize: "0.76rem", color: "#047857", mb: 0.75 }}>
            {booking.hotelName}
          </Typography>

          <Box
            sx={{
              p: 1,
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              fontSize: "0.74rem",
              display: "flex",
              flexDirection: "column",
              gap: 0.4,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Thời gian lưu trú:</span>
              <strong>
                {booking.checkIn} → {booking.checkOut} ({booking.nights} đêm)
              </strong>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Số lượng phòng:</span>
              <strong>{booking.rooms} phòng (Còn trống: {booking.remainingAvailableRooms} phòng)</strong>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tổng thanh toán (gồm thuế 10%):</span>
              <strong style={{ color: "#E11D48" }}>{formatVnd(booking.totalAmount)}</strong>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => navigate(`/hotels/${booking.hotelId}/rooms/${booking.roomId}`)}
              endIcon={<OpenInNewIcon sx={{ fontSize: "13px !important" }} />}
              sx={{ textTransform: "none", fontSize: "0.72rem", fontWeight: 700, borderRadius: "8px", bgcolor: "#fff" }}
            >
              Xem trang phòng
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => navigate("/customer/bookings")}
              startIcon={<ReceiptLongOutlinedIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ textTransform: "none", fontSize: "0.72rem", fontWeight: 700, borderRadius: "8px", boxShadow: "none" }}
            >
              Đơn đặt của tôi
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
