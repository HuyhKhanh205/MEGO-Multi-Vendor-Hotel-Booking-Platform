import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import type { RoomSelection } from "../types/customer.types";
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
  readOnly?: boolean;
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
  readOnly = false,
}: BookingSummaryProps) => (
  <aside className="h-fit overflow-hidden rounded-2xl border border-[#e6ebf5] bg-white shadow-[0_8px_24px_rgba(30,60,120,0.12)] lg:sticky lg:top-4">
    <img
      src={room.hotelImageUrl}
      alt={room.hotelName}
      className="h-44 w-full object-cover"
    />
    <div className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-md bg-[#fff4d6] px-2 py-1 text-[9px] font-bold text-[#a47716]">
          ★ 5 SAO · LUXURY RESORT
        </span>
        <span className="text-[9px] font-semibold text-[#1677ff]">Đã chọn</span>
      </div>
      <h2 className="mt-2 text-base font-extrabold leading-tight text-[#26344f]">
        {room.hotelName}
      </h2>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
        {room.hotelAddress}
      </p>
      <div className="my-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#e4eaf6] bg-[#e4eaf6] text-[10px]">
        <span className="bg-[#f4f7ff] px-3 py-2.5 text-slate-500">
          NHẬN PHÒNG
          <br />
          <b className="mt-0.5 block text-[11px] text-[#33415c]">{checkIn}</b>
        </span>
        <span className="bg-[#f4f7ff] px-3 py-2.5 text-slate-500">
          TRẢ PHÒNG
          <br />
          <b className="mt-0.5 block text-[11px] text-[#33415c]">{checkOut}</b>
        </span>
      </div>
      <p className="mb-3 text-[11px] font-semibold text-[#52617d]">
        {numberOfNights} đêm · {numberOfRooms} phòng · {numberOfGuests} khách
      </p>
      <div className="rounded-xl border border-[#dce6fb] bg-[#f1f5ff] p-3.5 text-xs">
        <b className="text-[#33415c]">{room.roomName}</b>
        <p className="mt-2 text-[10px] text-slate-500">
          ✓ Đã bao gồm tiện nghi phòng
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-emerald-600">
          ✓ {room.freeCancellation ? "Miễn phí hủy" : "Theo chính sách khách sạn"}
        </p>
      </div>
      <div className="space-y-2.5 border-b border-slate-100 py-4 text-[11px] text-slate-600">
        <SummaryLine label={`Giá phòng (${numberOfNights} đêm)`} amount={roomTotal} />
        <SummaryLine label="Thuế và phí" amount={vat} />
        {promotionDiscount > 0 && (
          <SummaryLine label="Mã ưu đãi" amount={-promotionDiscount} />
        )}
        {pointsDiscount > 0 && (
          <SummaryLine label="MeGo Club Points" amount={-pointsDiscount} />
        )}
      </div>
      <div className="flex items-end justify-between gap-3 py-4">
        <span className="text-[10px] font-bold leading-relaxed text-slate-500">
          TỔNG TIỀN THANH TOÁN
          <br />
          <small className="font-normal">Đã bao gồm thuế và phí</small>
        </span>
        <strong className="text-right text-xl font-extrabold text-[#1677ff]">
          {formatVnd(total)}
          <small className="ml-1 text-xs">VND</small>
        </strong>
      </div>
      {!readOnly && (
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
      )}
      {formError && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </p>
      )}
      {!readOnly && (
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
      )}
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
