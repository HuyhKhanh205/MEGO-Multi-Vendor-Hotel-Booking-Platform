import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useBookingHold } from "./useBookingHold";

interface BookingHoldTimerProps {
  holdUntil: string | null;
  variant: "booking-form" | "payment";
}

export default function BookingHoldTimer({
  holdUntil,
  variant,
}: BookingHoldTimerProps) {
  const { remainingSeconds } = useBookingHold(holdUntil);
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl bg-[#eaf2ff] px-4 py-3 text-xs text-[#31527f] shadow-sm">
        <InfoOutlinedIcon
          className="mt-0.5 shrink-0 text-[#1677ff]"
          sx={{ fontSize: 15 }}
        />
      <p>
        <strong>Giữ đơn đặt phòng trong</strong>{" "}
        <strong className="text-[#ed4d65]">
          {minutes}:{seconds}
        </strong>
        {variant === "booking-form" && " phút."}
      </p>
        <span className="ml-auto hidden sm:block">
          🔒 Cam kết giữ phòng yên tâm
        </span>
    </div>
  );
}
