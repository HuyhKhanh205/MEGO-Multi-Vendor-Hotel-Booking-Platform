import React, { useState } from "react";
import type { AdminUser } from "../../types/admin";

interface SuspendUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    userId: string,
    reason: string,
    note: string,
    duration: "7_days" | "30_days" | "permanent",
    sendNotification: boolean,
    writeAuditLog: boolean
  ) => void;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null;

  const [reason, setReason] = useState<string>(
    "Spam đặt phòng và hủy hàng loạt (No-show / DoS Inventory)"
  );
  const [note, setNote] = useState<string>(
    "Tài khoản có dấu hiệu khởi tạo 12 đơn phòng ảo trong 30 phút không qua cổng thanh toán VNPay/Stripe, gây tắc nghẽn kho phòng của đối tác Grand Sunrise và Grand Ocean. IP trùng dải bot spam 14.161.x.x."
  );
  const [duration, setDuration] = useState<"7_days" | "30_days" | "permanent">("30_days");
  const [sendNotification, setSendNotification] = useState<boolean>(true);
  const [writeAuditLog, setWriteAuditLog] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(user.id, reason, note, duration, sendNotification, writeAuditLog);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-none">
                  Đình chỉ & Khóa tài khoản người dùng
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
                  KHẨN CẤP
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hành động này sẽ vô hiệu hóa phiên đăng nhập tức thì và thu hồi JWT Token trên toàn bộ thiết bị.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Snippet Info Card */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-blue-500/20">
              {user.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
                <span className="text-xs text-slate-400 font-mono">{user.userCode}</span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          {user.vipTier && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {user.vipTier}
            </span>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Lý do khóa tài khoản */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              Lý do khóa tài khoản <span className="text-rose-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="Spam đặt phòng và hủy hàng loạt (No-show / DoS Inventory)">
                Spam đặt phòng và hủy hàng loạt (No-show / DoS Inventory)
              </option>
              <option value="Vi phạm chính sách đánh giá, bôi nhọ đối tác trục lợi">
                Vi phạm chính sách đánh giá, bôi nhọ đối tác trục lợi
              </option>
              <option value="Nghi vấn gian lận thẻ tín dụng / thanh toán giả mạo VNPay">
                Nghi vấn gian lận thẻ tín dụng / thanh toán giả mạo VNPay
              </option>
              <option value="Yêu cầu từ Cơ quan quản lý / Thanh tra du lịch">
                Yêu cầu từ Cơ quan quản lý / Thanh tra du lịch
              </option>
            </select>
          </div>

          {/* Ghi chú chi tiết lý do */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block">
                Ghi chú chi tiết lý do (Audit Note) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Bắt buộc cho Nhật ký P42</span>
            </div>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập chi tiết bằng chứng, IP hoặc căn cứ xử lý..."
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Thời hạn khóa tài khoản */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">
              Thời hạn khóa tài khoản <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: 7 ngày */}
              <label
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  duration === "7_days"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">7 Ngày</span>
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === "7_days"}
                    onChange={() => setDuration("7_days")}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Khóa tạm thời giải trình</span>
              </label>

              {/* Option 2: 30 ngày */}
              <label
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  duration === "30_days"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">30 Ngày</span>
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === "30_days"}
                    onChange={() => setDuration("30_days")}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Đình chỉ trung hạn</span>
              </label>

              {/* Option 3: Vĩnh viễn */}
              <label
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  duration === "permanent"
                    ? "border-rose-600 bg-rose-50/50 text-rose-900 shadow-2xs"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-600">Vĩnh viễn</span>
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === "permanent"}
                    onChange={() => setDuration("permanent")}
                    className="w-3.5 h-3.5 text-rose-600"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Xóa token & Cấm IP</span>
              </label>
            </div>
          </div>

          {/* Checkbox Options */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span>Đồng thời gửi thông báo qua Email & SMS cho người dùng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={writeAuditLog}
                onChange={(e) => setWriteAuditLog(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              <span>Ghi nhật ký kiểm toán hệ thống (Audit Log P42 - Security Master)</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Thực hiện bởi: <strong className="text-slate-700">Super Admin (Vũ Hoàng Nam)</strong>
            </span>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm shadow-rose-500/20 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Xác nhận Khóa tài khoản</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuspendUserModal;
