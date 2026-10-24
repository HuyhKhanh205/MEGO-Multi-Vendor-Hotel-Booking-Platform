import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import type { RoomSelection } from "../types/customer.types";
import { Link } from "react-router-dom";
import { formatVnd } from "../utils/formatters";

interface BookingSummaryProps {
  room: RoomSelection;
  checkIn: string;
  checkOut: string;
  numberOfNights: number;
  numberOfRooms: number;
  numberOfGuests: number;
  roomTotal: number;
  vat: number;
  promotionDiscount: number;
  pointsDiscount: number;
  total: number;
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  formError: string;
  onContinue: () => void;
  isExpired: boolean;
  isSaving: boolean;
}

const BookingSummary = ({
  room,
  checkIn,
  checkOut,
  numberOfNights,
  numberOfRooms,
  numberOfGuests,
  roomTotal,
  vat,
  promotionDiscount,
  pointsDiscount,
  total,
  agreed,
  onAgreeChange,
  formError,
  onContinue,
  isExpired,
  isSaving,
}: BookingSummaryProps) => (
  <aside className="h-fit overflow-hidden rounded-xl bg-white shadow-[0_5px_20px_rgba(30,60,120,0.14)] lg:sticky lg:top-4">
    <img
      src={room.hotelImageUrl}
      alt={room.hotelName}
      className="h-40 w-full object-cover"
    />
    <div className="p-4">
      <p className="text-[10px] font-bold text-[#1769ed]">★ {room.hotelName}</p>
      <h2 className="mt-1 text-base font-bold">{room.hotelName}</h2>
      <p className="text-xs text-slate-500">{room.hotelAddress}</p>

      <div className="my-3 grid grid-cols-2 gap-2 rounded-lg bg-[#f0f4ff] p-2 text-[11px]">
        <span>
          NHẬN PHÒNG
          <br />
          <b>{checkIn}</b>
        </span>
        <span>
          TRẢ PHÒNG
          <br />
          <b>{checkOut}</b>
        </span>
      </div>

      <p className="mb-3 text-xs font-semibold">
        {numberOfNights} đêm · {numberOfRooms} phòng · {numberOfGuests} khách
      </p>
      <div className="rounded-lg bg-[#edf3ff] p-3 text-xs">
        <b>{room.roomName}</b>
        <p className="mt-1 text-[10px] text-emerald-600">
          ✓ {room.freeCancellation ? "Miễn phí hủy" : "Theo chính sách khách sạn"}
        </p>
      </div>

      <div className="space-y-2 border-b border-slate-100 py-4 text-xs text-slate-600">
        <SummaryLine
          label={`Giá phòng (${numberOfNights} đêm)`}
          amount={roomTotal}
        />
        <SummaryLine label="Thuế và phí" amount={vat} />
        {promotionDiscount > 0 && (
          <SummaryLine label="Mã ưu đãi" amount={-promotionDiscount} />
        )}
        {pointsDiscount > 0 && (
          <SummaryLine label="MeGo Club Points" amount={-pointsDiscount} />
        )}
      </div>

      <div className="flex items-end justify-between py-4">
        <span className="text-[10px] font-bold text-slate-500">
          TỔNG TIỀN THANH TOÁN
          <br />
          <small className="font-normal">Đã bao gồm thuế và phí</small>
        </span>
        <strong className="text-xl text-[#1769ed]">
          {formatVnd(total)}
          <small className="ml-1 text-xs">VND</small>
        </strong>
      </div>

      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreeChange(event.target.checked)}
          className="mt-0.5 accent-blue-600"
        />
        Tôi đồng ý với{" "}
        <Link
          to="/policies/terms"
          className="font-semibold text-[#1769ed] underline underline-offset-2 hover:text-[#1255bd]"
        >
          chính sách đặt và hủy phòng
        </Link>
        .
      </label>
      {formError && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}
      <button
        type="button"
        disabled={isSaving || !agreed || isExpired}
        onClick={onContinue}
        className="mt-3 w-full rounded-lg bg-[#1769ed] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isExpired
          ? "Đã hết thời gian giữ phòng"
          : isSaving
            ? "Đang tạo đơn…"
            : "Tiếp tục Thanh toán →"}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] text-slate-500">
        <LockOutlinedIcon sx={{ fontSize: 12 }} /> Thanh toán an toàn và bảo mật
      </p>
    </div>
  </aside>
);

function SummaryLine({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="whitespace-nowrap">{formatVnd(amount)}</span>
    </div>
  );
}

export default BookingSummary;
