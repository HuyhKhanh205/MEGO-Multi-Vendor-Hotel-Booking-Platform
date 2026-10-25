export interface CancellationQuote { fee: number; refund: number; eligible: boolean; message: string; }
export const calcCancelFee = (total: number, checkIn: string, isPaid: boolean): CancellationQuote => {
  const hours = (new Date(`${checkIn}T14:00:00`).getTime() - Date.now()) / 3600000;
  if (hours <= 0) return { fee: total, refund: 0, eligible: false, message: "Đã quá thời hạn hủy trước ngày nhận phòng." };
  const refund = !isPaid ? 0 : hours >= 72 ? total : hours >= 24 ? Math.floor(total / 2) : 0;
  return { fee: isPaid ? total - refund : 0, refund, eligible: true, message: !isPaid ? "Đơn chưa thanh toán, không phát sinh hoàn tiền." : hours >= 72 ? "Hoàn 100% trước 3 ngày." : hours >= 24 ? "Hoàn 50% trong khoảng 1–3 ngày." : "Hủy dưới 24 giờ, không hoàn tiền." };
};
