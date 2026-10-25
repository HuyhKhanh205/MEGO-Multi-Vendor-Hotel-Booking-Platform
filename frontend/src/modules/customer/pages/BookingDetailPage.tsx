import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Rating,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  AccountLayout,
  PageHeading,
  panelClass,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerBooking } from "../types/customer.types";
import { calcCancelFee } from "../utils/cancelPolicy";
import { formatDate, formatVnd } from "../utils/formatters";
const steps = ["Đã đặt", "Đã xác nhận", "Đã nhận phòng", "Hoàn tất"];
export default function BookingDetailPage() {
  const { bookingId = "" } = useParams();
  const [booking, setBooking] = useState<CustomerBooking | null>(null);
  const [error, setError] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const load = () => {
    customerApiMethods
      .getBooking(bookingId)
      .then((item) => {
        setBooking(item ?? null);
        setError(item ? "" : "Không tìm thấy đơn đặt phòng.");
      })
      .catch(() => setError("Không thể tải chi tiết đơn."));
  };
  useEffect(load, [bookingId]);
  if (error || !booking)
    return (
      <AccountLayout>
        <div className={`${panelClass} text-center`}>
          <PageHeading
            title="Không tìm thấy đơn"
            subtitle={error || "Đơn đặt phòng không tồn tại."}
          />
          <Button component={Link} to="/customer/bookings">
            Về danh sách đơn
          </Button>
          <Button onClick={load}>Thử lại</Button>
        </div>
      </AccountLayout>
    );
  const quote = calcCancelFee(
    booking.total,
    booking.checkIn,
    booking.paymentStatus === "PAID",
  );
  const activeStep = Math.max(
    0,
    ["PENDING_PAYMENT", "CONFIRMED", "CHECKED_IN", "COMPLETED"].indexOf(
      booking.status,
    ),
  );
  return (
    <AccountLayout>
      <PageHeading
        title={`Đơn ${booking.bookingCode}`}
        subtitle={booking.hotelName}
      />
      <section className={`${panelClass} space-y-5`}>
        <Stepper activeStep={activeStep}>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <img
            src={booking.hotelImageUrl}
            alt={booking.hotelName}
            className="h-40 w-full rounded-xl object-cover"
          />
          <div>
            <h2 className="text-lg font-bold">{booking.hotelName}</h2>
            <p>{booking.hotelAddress}</p>
            <p>
              {booking.roomName} · {booking.numberOfRooms} phòng ·{" "}
              {booking.numberOfGuests} khách
            </p>
            <p>
              {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
            </p>
            <p>
              Người đặt: {booking.contactName} · {booking.contactPhone}
            </p>
            <p>Khách lưu trú: {booking.guestName}</p>
            <p>Yêu cầu: {booking.specialRequest || "Không có"}</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          <p className="flex justify-between">
            <span>Giá phòng × {booking.numberOfNights} đêm</span>
            <span>
              {formatVnd(
                booking.pricePerNight *
                  booking.numberOfNights *
                  booking.numberOfRooms,
              )}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Thuế phí / giảm giá</span>
            <span>{formatVnd(booking.taxes - booking.discount)}</span>
          </p>
          <p className="mt-2 flex justify-between text-base font-bold">
            <span>Tổng cộng</span>
            <span>{formatVnd(booking.total)}</span>
          </p>
          <p className="mt-2">
            Thanh toán: {booking.paymentMethod} · {booking.paymentStatus}
          </p>
        </div>
        <p className="text-sm text-slate-600">{booking.cancellationPolicy}</p>
        <div className="flex flex-wrap gap-3">
          {["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status) && (
            <Button
              color="error"
              variant="outlined"
              onClick={() => setCancelOpen(true)}
            >
              Hủy đặt phòng
            </Button>
          )}
          {booking.status === "COMPLETED" && !booking.reviewed && (
            <Button variant="contained" onClick={() => setReviewOpen(true)}>
              Viết đánh giá
            </Button>
          )}
        </div>
      </section>
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>Xác nhận hủy phòng</DialogTitle>
        <DialogContent>
          <p>{quote.message}</p>
          <p>
            Phí hủy: {formatVnd(quote.fee)} · Hoàn dự kiến:{" "}
            {formatVnd(quote.refund)}
          </p>
          <TextField
            select
            fullWidth
            label="Lý do hủy"
            defaultValue="Thay đổi kế hoạch"
            className="mt-3"
          >
            <MenuItem value="Thay đổi kế hoạch">Thay đổi kế hoạch</MenuItem>
            <MenuItem value="Đặt nhầm">Đặt nhầm</MenuItem>
            <MenuItem value="Lý do khác">Lý do khác</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Không hủy</Button>
          <Button
            color="error"
            disabled={!quote.eligible}
            onClick={() =>
              void customerApiMethods
                .cancelBooking(booking.id)
                .then((item) => {
                  setBooking(item);
                  setCancelOpen(false);
                  toast.success("Đã hủy đặt phòng.");
                })
                .catch((reason: unknown) =>
                  toast.error(
                    reason instanceof Error
                      ? reason.message
                      : "Không thể hủy đơn.",
                  ),
                )
            }
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogTitle>Đánh giá kỳ nghỉ</DialogTitle>
        <DialogContent>
          <Rating defaultValue={5} />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Nhận xét phòng và dịch vụ"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Đóng</Button>
          <Button
            onClick={() => {
              setBooking({ ...booking, reviewed: true });
              setReviewOpen(false);
              toast.success("Cảm ơn bạn đã đánh giá.");
            }}
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </AccountLayout>
  );
}
