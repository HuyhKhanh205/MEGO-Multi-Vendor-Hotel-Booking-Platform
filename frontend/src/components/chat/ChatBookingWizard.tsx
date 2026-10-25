import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { toast } from "react-toastify";
import { useAppSelector } from "../../stores/store";
import { chatService } from "../../services/chatService";
import { customerApiMethods } from "../../modules/customer/services/customerApi";
import type { ChatBookingResponse, ChatRoomCard } from "../../types/chat";

interface ChatBookingWizardProps {
  card: ChatRoomCard;
  onCancel: () => void;
  onSuccess: (result: ChatBookingResponse) => void;
}

const getIsoDateOffset = (daysToAdd: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split("T")[0];
};

const formatVnd = (amount: number): string =>
  `${Math.round(amount || 0).toLocaleString("vi-VN")}₫`;

const PAYMENT_METHODS = [
  { value: "Thanh toán tại khách sạn", label: "🏨 Thanh toán trực tiếp tại khách sạn" },
  { value: "Ví điện tử MoMo", label: "📱 Ví điện tử MoMo (Xác nhận tức thì)" },
  { value: "Cổng VNPay QR", label: "💳 Quét mã VNPay QR" },
  { value: "Chuyển khoản ngân hàng", label: "🏦 Chuyển khoản ngân hàng 24/7" },
] as const;

export default function ChatBookingWizard({
  card,
  onCancel,
  onSuccess,
}: ChatBookingWizardProps) {
  const theme = useTheme();
  const authUser = useAppSelector((state) => state.auth.user);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkIn, setCheckIn] = useState<string>(() => getIsoDateOffset(1));
  const [checkOut, setCheckOut] = useState<string>(() => getIsoDateOffset(2));
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(Math.min(2, card.maxAdults || 2));
  const [children, setChildren] = useState<number>(0);

  const userObj = authUser as { fullName?: string; name?: string; email?: string } | null;
  const [fullName, setFullName] = useState<string>(userObj?.fullName || userObj?.name || "Nguyễn Văn An");
  const [email, setEmail] = useState<string>(userObj?.email || "khachhang@mego.vn");
  const [phone, setPhone] = useState<string>("0905123456");
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0].value);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const nights = useMemo(() => {
    const start = Date.parse(checkIn);
    const end = Date.parse(checkOut);
    if (!Number.isFinite(start) || !Number.isFinite(end)) return 1;
    const diff = Math.ceil((end - start) / 86400000);
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const subtotal = useMemo(
    () => card.pricePerNight * Math.max(1, nights) * rooms,
    [card.pricePerNight, nights, rooms],
  );
  const tax = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const totalAmount = subtotal + tax;

  const handleNextStep1 = () => {
    setErrorMsg(null);
    if (nights < 1) {
      setErrorMsg("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.");
      return;
    }
    if (rooms < 1 || rooms > card.availableRooms) {
      setErrorMsg(`Hiện chỉ còn tối đa ${card.availableRooms} phòng trống.`);
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người nhận phòng.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMsg("Vui lòng nhập số điện thoại liên hệ hợp lệ.");
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      // 1. Gọi API Backend để trừ tồn kho phòng thực tế trong CSDL MariaDB
      const dbResult = await chatService.bookRoomFromChat({
        roomDbId: card.roomDbId,
        hotelId: card.hotelId,
        roomId: card.roomId,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        specialRequest: specialRequest.trim(),
        paymentMethod,
      });

      // 2. Đồng bộ lưu vào danh sách đơn đặt phòng của khách trên Frontend (/customer/bookings)
      let frontendBookingId: string | undefined;
      try {
        const created = await customerApiMethods.createBooking({
          hotelId: card.hotelId,
          roomTypeId: card.roomId,
          checkIn,
          checkOut,
          rooms,
          adults,
          children,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          guestName: fullName.trim(),
          specialRequest: specialRequest.trim(),
          promoCode: "",
          hotelName: card.hotelName,
          roomName: card.roomName,
          roomPricePerNight: card.pricePerNight,
        });
        await customerApiMethods.confirmPayment(created.id, paymentMethod);
        frontendBookingId = created.id;
      } catch {
        // Bỏ qua nếu localStorage mock có giới hạn riêng, vẫn ưu tiên kết quả từ CSDL Backend
      }

      toast.success(`Đặt phòng thành công! Mã đơn: ${dbResult.bookingCode}`);
      onSuccess({
        ...dbResult,
        frontendBookingId,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Không thể hoàn tất đặt phòng lúc này. Vui lòng thử lại.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = [
    "1. Ngày & Số phòng",
    "2. Thông tin khách",
    "3. Xác nhận & Đặt",
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        mx: 1.25,
        mb: 1,
        p: 1.5,
        borderRadius: "12px",
        border: `1.5px solid ${theme.palette.primary.main}`,
        bgcolor: "background.paper",
      }}
    >
      {/* Header + Nút đóng */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 800, display: "block" }}>
            ⚡ ĐẶT PHÒNG TỪNG BƯỚC TRÊN CHAT
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              fontSize: "0.82rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.roomName} — {card.hotelName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onCancel} aria-label="Đóng đặt phòng nhanh">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Thanh tiến trình 3 cấp bậc */}
      <Box sx={{ mb: 1.25 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.75, mb: 0.5 }}>
          {[1, 2, 3].map((idx) => (
            <Box
              key={idx}
              sx={{
                height: 5,
                borderRadius: 99,
                bgcolor: step >= idx ? "primary.main" : "grey.200",
                transition: "background-color 0.25s ease",
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 700 }}>
          {stepLabels.map((label, i) => (
            <Typography
              key={label}
              variant="caption"
              sx={{
                fontSize: "0.68rem",
                fontWeight: step === i + 1 ? 800 : 600,
                color: step >= i + 1 ? "primary.main" : "text.disabled",
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 1, py: 0.25, fontSize: "0.75rem" }}>
          {errorMsg}
        </Alert>
      )}

      {/* BƯỚC 1: Chọn Ngày & Số lượng phòng */}
      {step === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <TextField
              label="Nhận phòng"
              type="date"
              size="small"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Trả phòng"
              type="date"
              size="small"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
            <TextField
              select
              label="Số phòng"
              size="small"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
            >
              {Array.from({ length: Math.min(5, Math.max(1, card.availableRooms)) }, (_, i) => i + 1).map((n) => (
                <MenuItem key={n} value={n}>
                  {n} phòng
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Người lớn"
              size="small"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} khách
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Trẻ em"
              size="small"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {[0, 1, 2, 3].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} trẻ
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1.25,
              py: 0.75,
              borderRadius: "8px",
              bgcolor: "grey.50",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {nights} đêm × {rooms} phòng ({formatVnd(card.pricePerNight)}/đêm)
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#E11D48" }}>
              {formatVnd(subtotal)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button size="small" onClick={onCancel} sx={{ textTransform: "none" }}>
              Hủy
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleNextStep1}
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
            >
              Tiếp tục: Thông tin khách
            </Button>
          </Box>
        </Box>
      )}

      {/* BƯỚC 2: Thông tin liên hệ */}
      {step === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            label="Họ và tên người nhận phòng *"
            size="small"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <TextField
              label="Số điện thoại *"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              label="Email nhận mã đặt phòng *"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <TextField
            label="Yêu cầu đặc biệt (nhận phòng sớm, tầng cao...)"
            size="small"
            fullWidth
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Button
              size="small"
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={() => setStep(1)}
              sx={{ textTransform: "none" }}
            >
              Quay lại
            </Button>
            <Button
              size="small"
              variant="contained"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={handleNextStep2}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}
            >
              Tiếp tục: Thanh toán
            </Button>
          </Box>
        </Box>
      )}

      {/* BƯỚC 3: Phương thức thanh toán & Xác nhận */}
      {step === 3 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            select
            label="Phương thức thanh toán"
            size="small"
            fullWidth
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {PAYMENT_METHODS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              p: 1,
              borderRadius: "8px",
              bgcolor: "grey.50",
              border: `1px solid ${theme.palette.divider}`,
              fontSize: "0.75rem",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
              <span>Khách nhận phòng:</span>
              <strong>
                {fullName} ({phone})
              </strong>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
              <span>Thời gian lưu trú:</span>
              <strong>
                {checkIn} → {checkOut} ({nights} đêm)
              </strong>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
              <span>Tiền phòng ({rooms} phòng) + Thuế phí 10%:</span>
              <strong style={{ color: "#E11D48" }}>{formatVnd(totalAmount)}</strong>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Button
              size="small"
              disabled={submitting}
              startIcon={<ArrowBackIcon fontSize="small" />}
              onClick={() => setStep(2)}
              sx={{ textTransform: "none" }}
            >
              Quay lại
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              disabled={submitting}
              onClick={handleConfirmBooking}
              startIcon={
                submitting ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <CheckCircleOutlinedIcon fontSize="small" />
                )
              }
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: "8px" }}
            >
              {submitting ? "Đang xử lý..." : "Xác nhận Đặt phòng"}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
