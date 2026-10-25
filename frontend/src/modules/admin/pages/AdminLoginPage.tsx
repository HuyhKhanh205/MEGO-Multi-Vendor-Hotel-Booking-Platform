import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin.root@mego.vn");
  const [password, setPassword] = useState("MeGoPasswdSecureRoot9082");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["8", "4", "9", "2", "0", "1"]);
  const [countdown, setCountdown] = useState<number>(23);
  const [trustDevice, setTrustDevice] = useState<boolean>(true);
  const [auditConsent, setAuditConsent] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Xác thực 2FA thành công! Đang chuyển hướng vào Bảng điều khiển Quản trị...", {
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/admin");
      }, 800);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-200 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Cybernetic Radar Lines & Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-blue-500/30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-blue-500/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] rounded-full border border-blue-500/10"></div>
      </div>

      {/* Top Security Status Bar */}
      <div className="relative z-10 px-6 py-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-blue-400 font-bold flex items-center gap-1.5">
            <span>🛡️</span> ZONE-01 / ROOT CLUSTER
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ thống: 99.99% Operational
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>IP: 14.161.42.***</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-bold">GATEWAY_ONLINE</span>
        </div>
      </div>

      {/* Center Login Modal Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 my-6">
        <div className="bg-white text-slate-900 w-full max-w-md sm:max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          {/* Header Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              LEVEL 4 ACCESS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              PORTAL ACCESS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span>🛡️</span> Secured Area
            </span>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Đăng nhập Hệ thống Quản trị Sàn MeGo
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Cổng truy cập dành riêng cho kỹ sư vận hành, kiểm toán viên và ban điều hành nền tảng MeGo Hospitality.
          </p>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  Email Quản trị / Tên tài khoản Admin <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400">ROOT/OPS</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-blue-50/40 border border-blue-200/80 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  Mật khẩu cá nhân <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Đã gửi yêu cầu cấp token OTP đến bộ phận an ninh")}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Cấp lại token?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-blue-50/40 border border-blue-200/80 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* 2FA Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🔑</span> Mã xác thực 2 yếu tố (2FA / YubiKey OTP) <span className="text-rose-500">*</span>
                </label>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                  ⏱ {countdown}s
                </span>
              </div>

              {/* 6 Digit Inputs */}
              <div className="grid grid-cols-6 gap-2 pt-1">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`admin-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-full h-11 text-center font-mono font-black text-lg bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-slate-900"
                  />
                ))}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <span>📱</span>
                <span>Nhập mã 6 chữ số từ ứng dụng Google Authenticator hoặc 1Password / YubiKey</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300"
                />
                <span className="leading-tight">
                  Tin cậy thiết bị này trong 12 giờ (Áp dụng MeGo HQ VPN &amp; IP Whitelist)
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={auditConsent}
                  onChange={(e) => setAuditConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300"
                />
                <span className="leading-tight text-slate-600">
                  Mọi hoạt động đều được ghi vết mã hóa trong Nhật ký Hệ thống (Audit Log P42) và tự động đối chiếu dữ liệu thiết bị thời gian thực.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{isLoading ? "Đang xác thực bảo mật..." : "Đăng nhập Hệ thống Admin"}</span>
            </button>
          </form>

          {/* Quick link back */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-blue-600">
              ← Quay lại trang chủ MeGo Khách hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Badges & Footers */}
      <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-sm px-6 py-4 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>Hotline An ninh: <strong className="text-slate-200">1900 8899 - Ext: 9</strong></span>
          </div>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => toast.warn("Mở kết nối tới Trung tâm giám sát an ninh SOC")}
            className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>🛡️</span> Báo cáo sự cố SOC
          </button>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
              PCI-DSS Level 1 Validated
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
              Zero Trust Access Model
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
              FIPS 140-2 Encrypted
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-500">
          <span>
            © Bản quyền Hệ thống MeGo Admin 2026 • ISO/IEC 27001 &amp; SOC-2 Type II Certified • Toàn quyền bảo lưu.
          </span>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>TLS 1.3 256-bit Encrypted</span>
            <span>•</span>
            <span>Session ID: SEC-MGO-9082</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
