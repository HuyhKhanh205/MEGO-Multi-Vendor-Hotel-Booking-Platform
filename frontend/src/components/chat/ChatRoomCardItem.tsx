import { Box, Button, Chip, Typography, useTheme } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BoltIcon from "@mui/icons-material/Bolt";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../stores/store";
import type { ChatRoomCard } from "../../types/chat";

interface ChatRoomCardItemProps {
  card: ChatRoomCard;
  onStartQuickBook: (card: ChatRoomCard) => void;
}

const formatPriceVnd = (value: number): string =>
  `${Math.round(value || 0).toLocaleString("vi-VN")}₫`;

export default function ChatRoomCardItem({
  card,
  onStartQuickBook,
}: ChatRoomCardItemProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const detailUrl = `/hotels/${card.hotelId}/rooms/${card.roomId}`;

  const handleGoToRoomDetail = () => {
    navigate(detailUrl);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
        transition: "transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 8px 20px rgba(22, 119, 255, 0.14)",
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      {/* Thanh tiêu đề Khách sạn & Điểm đến */}
      <Box
        onClick={handleGoToRoomDetail}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 1.35,
          py: 0.75,
          bgcolor: "#F8FAFC",
          borderBottom: "1px solid #F1F5F9",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: 0 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.75rem",
              color: "#0F172A",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.hotelName}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.3,
            px: 0.75,
            py: 0.15,
            borderRadius: "6px",
            bgcolor: "#FEF3C7",
            color: "#B45309",
            fontSize: "0.68rem",
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          <StarRoundedIcon sx={{ fontSize: 13, color: "#F59E0B" }} />
          <span>
            {card.stars} sao • {card.city}
          </span>
        </Box>
      </Box>

      {/* Vùng ảnh & thông tin hạng phòng — Click vào để xem trang chi tiết phòng */}
      <Box
        onClick={handleGoToRoomDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleGoToRoomDetail();
          }
        }}
        sx={{
          display: "flex",
          gap: 1.25,
          p: 1.25,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Ảnh đại diện phòng */}
        <Box
          sx={{
            position: "relative",
            width: 88,
            height: 88,
            borderRadius: "10px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={card.imageUrl}
            alt={card.roomName}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Nội dung thông số phòng & giá */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            {/* Tên hạng phòng nổi bật */}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                fontSize: "0.9rem",
                lineHeight: 1.25,
                color: "#1E40AF",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {card.roomName}
            </Typography>

            {/* Thông số diện tích, khách, giường */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 0.85,
                mt: 0.5,
                color: "#475569",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
                <SquareFootOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} />
                <span>{card.areaM2}m²</span>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
                <PeopleOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} />
                <span>{card.maxAdults} người lớn</span>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
                <KingBedOutlinedIcon sx={{ fontSize: 13, color: "#64748B" }} />
                <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {card.bedType}
                </span>
              </Box>
            </Box>
          </Box>

          {/* Giá nổi bật & số phòng trống */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.75 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 0.35,
                px: 0.85,
                py: 0.25,
                borderRadius: "8px",
                bgcolor: "rgba(225, 29, 72, 0.08)",
                border: "1px solid rgba(225, 29, 72, 0.18)",
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  color: "#BE123C",
                  letterSpacing: "-0.01em",
                }}
              >
                {formatPriceVnd(card.pricePerNight)}
              </Typography>
              <Typography component="span" sx={{ fontSize: "0.68rem", color: "#9F1239", fontWeight: 600 }}>
                /đêm
              </Typography>
            </Box>

            <Chip
              size="small"
              label={card.availableRooms > 0 ? `Còn ${card.availableRooms} phòng` : "Hết phòng"}
              color={card.availableRooms > 0 ? "success" : "default"}
              sx={{
                height: 21,
                fontSize: "0.68rem",
                fontWeight: 800,
                bgcolor: card.availableRooms > 0 ? "#ECFDF5" : undefined,
                color: card.availableRooms > 0 ? "#047857" : undefined,
                border: card.availableRooms > 0 ? "1px solid #A7F3D0" : undefined,
                "& .MuiChip-label": { px: 0.8 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Thanh 2 nút hành động: Xem chi tiết (Đặt thủ công) & Đặt từng bước trên Chat */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.75,
          px: 1.25,
          pb: 1,
          pt: 0.65,
          bgcolor: "#F8FAFC",
          borderTop: "1px solid #F1F5F9",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={handleGoToRoomDetail}
          endIcon={<OpenInNewIcon sx={{ fontSize: "13px !important" }} />}
          sx={{
            textTransform: "none",
            fontSize: "0.73rem",
            fontWeight: 700,
            py: 0.45,
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
          }}
        >
          Chi tiết & Đặt
        </Button>

        <Button
          size="small"
          variant="contained"
          disabled={card.availableRooms <= 0}
          onClick={() => onStartQuickBook(card)}
          startIcon={
            isAuthenticated ? (
              <BoltIcon sx={{ fontSize: "14px !important" }} />
            ) : (
              <LockOutlinedIcon sx={{ fontSize: "13px !important" }} />
            )
          }
          title={
            isAuthenticated
              ? "Đặt phòng từng bước ngay trên khung Chat"
              : "Yêu cầu đăng nhập tài khoản để đặt phòng trên Chat"
          }
          sx={{
            textTransform: "none",
            fontSize: "0.73rem",
            fontWeight: 700,
            py: 0.45,
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          {isAuthenticated ? "Đặt trên Chat" : "Đăng nhập để đặt"}
        </Button>
      </Box>
    </Box>
  );
}
