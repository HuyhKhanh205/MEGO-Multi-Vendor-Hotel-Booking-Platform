import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { formatCurrency } from "./bookingFormatters";

interface BookingSummaryProps {
  room: {
    hotelName: string;
    hotelRating: number;
    hotelAddress: string;
    hotelImageUrl: string;
    roomName: string;
    bedType: string;
    amenities: string[];
    guestCapacity: number;
  };
  checkIn: string;
  checkOut: string;
  numberOfNights: number;
  numberOfGuests: number;
  total: number;
  roomTotal: number;
  serviceFee: number;
  vat: number;
  promotionDiscount: number;
  pointsDiscount: number;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  onContinue?: () => void;
  isExpired?: boolean;
  isSaving?: boolean;
}

const BookingSummary = ({
  room,
  checkIn,
  checkOut,
  numberOfNights,
  numberOfGuests,
  total,
  roomTotal,
  serviceFee,
  vat,
  promotionDiscount,
  pointsDiscount,
  onCheckInChange,
  onCheckOutChange,
  onContinue,
  isExpired = false,
  isSaving = false,
}: BookingSummaryProps) => (
  <aside className="h-fit rounded-xl bg-white p-4 shadow-[0_5px_18px_rgba(30,60,120,0.1)] lg:sticky lg:top-24">
    <div className="mb-4 flex gap-3 border-b border-[#edf0f6] pb-4">
      <img className="h-20 w-24 rounded-lg object-cover" src={room.hotelImageUrl} alt={room.hotelName} />
      <div className="min-w-0">
        <span className="rounded bg-[#fff2c9] px-1.5 py-0.5 text-[9px] font-bold text-[#9c7413]">★ {room.hotelRating.toFixed(1)} Luxury</span>
        <h2 className="mt-1 text-sm font-bold leading-tight text-[#29344e]">{room.hotelName}</h2>
        <p className="mt-1 text-[9px] text-[#9ba3b4]">{room.hotelAddress}</p>
      </div>
    </div>
    <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-[#f3f5fb] p-3 text-[10px]">
      <label className="text-[9px] font-semibold text-[#8d97aa]">NHẬN PHÒNG<input className="mt-1 w-full bg-transparent text-xs font-bold text-[#3d4c68] outline-none" value={checkIn} onChange={(event) => onCheckInChange(event.target.value)} /></label>
      <label className="text-[9px] font-semibold text-[#8d97aa]">TRẢ PHÒNG<input className="mt-1 w-full bg-transparent text-xs font-bold text-[#3d4c68] outline-none" value={checkOut} onChange={(event) => onCheckOutChange(event.target.value)} /></label>
    </div>
    <p className="mb-3 text-[10px] font-semibold text-[#4d5b76]">{checkIn} - {checkOut} <span className="float-right font-normal text-[#8f9ab0]">{numberOfNights} đêm · 1 phòng</span></p>
    <div className="rounded-lg bg-[#eef3ff] p-3 text-xs text-[#52617d]"><div className="flex items-center justify-between"><span>{room.roomName}</span><b>{numberOfGuests} khách</b></div><p className="mt-2 text-[10px]">✓ 1 giường {room.bedType} &nbsp; ✓ {room.amenities.includes("Không hút thuốc") ? "Không hút thuốc" : room.amenities[0]}</p><p className="mt-1 text-[10px] text-[#00a389]">✓ {room.amenities.slice(0, 2).join(" · ")}</p></div>
    <div className="space-y-2 border-b border-[#edf0f6] py-4 text-xs text-[#68748d]"><div className="flex justify-between"><span>Giá phòng ({numberOfNights} đêm)</span><span>{formatCurrency(roomTotal)}đ</span></div><div className="flex justify-between"><span>Phí dịch vụ</span><span>{formatCurrency(serviceFee)}đ</span></div><div className="flex justify-between"><span>Thuế VAT</span><span>{formatCurrency(vat)}đ</span></div>{promotionDiscount > 0 && <div className="flex justify-between text-[#ed4d65]"><span>Mã ưu đãi</span><span>-{formatCurrency(promotionDiscount)}đ</span></div>}{pointsDiscount > 0 && <div className="flex justify-between text-[#00a389]"><span>MeGo Points</span><span>-{formatCurrency(pointsDiscount)}đ</span></div>}</div>
    <div className="flex items-end justify-between py-4"><span className="text-[10px] font-bold text-[#788399]">TỔNG TIỀN THANH TOÁN<br /><small className="font-normal">Đã bao gồm tất cả thuế và phí</small></span><span className="text-xl font-bold text-[#1677ff]">{formatCurrency(total)}<small className="ml-1 text-xs">VND</small></span></div>
    <button disabled={isExpired || isSaving} onClick={onContinue} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677ff] py-3 text-sm font-bold text-white shadow-[0_4px_10px_rgba(22,119,255,0.25)] disabled:cursor-not-allowed disabled:bg-[#aeb8ca] disabled:shadow-none">{isExpired ? "Đã hết thời gian giữ phòng" : isSaving ? "Đang lưu thông tin..." : "Tiếp tục Thanh toán"} {!isExpired && !isSaving && <ChevronRightIcon sx={{ fontSize: 16 }} />}</button>
    <p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] text-[#8a95a9]"><LockOutlinedIcon sx={{ fontSize: 11 }} /> Thanh toán an toàn và bảo mật</p>
  </aside>
);

export default BookingSummary;
