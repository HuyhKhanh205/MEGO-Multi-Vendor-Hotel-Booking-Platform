export const mapVnpayResponse = (code: string): { success: boolean; message: string } => {
  if (code === "00") return { success: true, message: "Giao dịch thành công." };
  const reasons: Record<string, string> = { "07": "Giao dịch bị nghi ngờ gian lận.", "09": "Thẻ chưa đăng ký dịch vụ Internet Banking.", "24": "Giao dịch đã bị hủy.", "51": "Số dư không đủ.", "65": "Vượt hạn mức giao dịch.", "99": "Giao dịch thất bại. Vui lòng thử lại." };
  return { success: false, message: reasons[code] ?? "Không thể xác nhận giao dịch." };
};
