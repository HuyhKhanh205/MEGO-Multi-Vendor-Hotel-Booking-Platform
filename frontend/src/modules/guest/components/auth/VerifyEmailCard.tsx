import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ExternalLink,
  Info,
  AlertTriangle,
  MailOpen,
} from "../../../../components/common/Icons";
import { AuthService } from "../../../../services/auth.service";

// ─── Types ───────────────────────────────────────────────────────────────────

type VerifyStatus =
  | "pending"
  | "verifying"
  | "success"
  | "invalid"
  | "expired"
  | "error"
  | "resent";

interface VerifyEmailCardProps {
  email: string;
  /** Verification token from URL query parameter */
  token?: string | null;
  loginLink: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_COOLDOWN = 60; // seconds

// ─── Component ───────────────────────────────────────────────────────────────

export const VerifyEmailCard: React.FC<VerifyEmailCardProps> = ({
  email,
  token,
  loginLink,
}) => {
  const [status, setStatus] = useState<VerifyStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(DEFAULT_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cleanup interval on unmount ──────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── Start countdown timer ────────────────────────────────────────────────
  const startCooldown = useCallback((seconds: number = DEFAULT_COOLDOWN) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCooldown(seconds);

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Start cooldown on mount ──────────────────────────────────────────────
  useEffect(() => {
    startCooldown(DEFAULT_COOLDOWN);
  }, [startCooldown]);

  // ── Auto-verify if token present ─────────────────────────────────────────
  useEffect(() => {
    if (token) {
      setStatus("verifying");
      AuthService.verifyEmail({ token })
        .then((res) => {
          if (res.success) {
            setStatus("success");
          } else {
            setStatus("invalid");
            setErrorMessage(res.message);
          }
        })
        .catch((err) => {
          const msg =
            err instanceof Error
              ? err.message
              : "Không thể xác minh email.";
          if (msg.includes("hết hạn")) {
            setStatus("expired");
          } else {
            setStatus("error");
          }
          setErrorMessage(msg);
        });
    }
  }, [token]);

  // ── Resend handler ───────────────────────────────────────────────────────
  const handleResend = async () => {
    if (isResending || cooldown > 0) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      const res = await AuthService.resendVerification({ email });
      if (res.success) {
        setStatus("resent");
        startCooldown(res.cooldownSeconds || DEFAULT_COOLDOWN);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Không thể gửi lại email xác minh.";
      setErrorMessage(msg);
    } finally {
      setIsResending(false);
    }
  };

  // ── Get email provider link ──────────────────────────────────────────────
  const emailProvider = AuthService.getEmailProviderUrl(email);

  const handleOpenEmail = () => {
    if (emailProvider) {
      window.open(emailProvider.url, "_blank", "noopener,noreferrer");
    } else {
      // Generic mailto: protocol to open default email client
      window.location.href = "mailto:";
    }
  };

  // ── Determine step state ─────────────────────────────────────────────────
  const isVerified = status === "success";
  const isPending =
    status === "pending" || status === "resent" || status === "verifying";
  const hasError =
    status === "invalid" || status === "expired" || status === "error";

  // ─── RENDER ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* ── Step Indicators ── */}
      <div className="flex items-center gap-2">
        {/* Step 1 */}
        <div
          className={`flex-1 py-2 px-3 rounded-lg text-center text-xs font-bold transition-all ${
            isVerified
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : isPending
              ? "bg-white text-[#1677FF] border border-[#1677FF]/30 shadow-sm"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            {isVerified ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : hasError ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span>
              {isVerified
                ? "Đã xác nhận"
                : hasError
                ? "Cần xử lý"
                : "Chờ xác nhận"}
            </span>
          </div>
        </div>

        {/* Connector */}
        <div
          className={`w-6 h-0.5 rounded-full transition-all ${
            isVerified ? "bg-emerald-400" : "bg-slate-200"
          }`}
        />

        {/* Step 2 */}
        <div
          className={`flex-1 py-2 px-3 rounded-lg text-center text-xs font-bold transition-all ${
            isVerified
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-50 text-slate-400 border border-slate-200"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Thành công</span>
          </div>
        </div>
      </div>

      {/* ── Icon ── */}
      <div className="flex justify-center pt-1">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isVerified
              ? "bg-emerald-50 border border-emerald-200"
              : hasError
              ? "bg-red-50 border border-red-200"
              : "bg-blue-50 border border-blue-100"
          }`}
        >
          {isVerified ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          ) : hasError ? (
            <AlertTriangle className="w-7 h-7 text-red-500" />
          ) : status === "verifying" ? (
            <span className="w-7 h-7 border-3 border-[#1677FF] border-t-transparent rounded-full animate-spin" />
          ) : (
            <MailOpen className="w-7 h-7 text-[#1677FF]" />
          )}
        </div>
      </div>

      {/* ── Title & Description ── */}
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {isVerified
            ? "Email đã được xác nhận!"
            : hasError
            ? status === "expired"
              ? "Liên kết đã hết hạn"
              : "Xác minh không thành công"
            : status === "verifying"
            ? "Đang xác minh..."
            : "Xác nhận email của bạn"}
        </h1>

        {isVerified ? (
          <p className="text-sm text-slate-500 leading-relaxed">
            Tài khoản MeGo Club của bạn đã được kích hoạt thành công. Bạn có thể
            đăng nhập và bắt đầu hành trình đặt phòng ngay bây giờ.
          </p>
        ) : hasError ? (
          <p className="text-sm text-red-600 leading-relaxed">
            {errorMessage ||
              "Liên kết xác minh không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác minh."}
          </p>
        ) : status === "verifying" ? (
          <p className="text-sm text-slate-500 leading-relaxed">
            Đang kiểm tra liên kết xác minh, vui lòng chờ...
          </p>
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed">
            Chúng tôi đã gửi đường dẫn kích hoạt tài khoản hội viên tới hòm thư
            điện tử:
          </p>
        )}
      </div>

      {/* ── Email Badge ── */}
      {!isVerified && status !== "verifying" && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
            <Mail className="w-4 h-4 text-[#1677FF] shrink-0" />
            <span className="text-sm font-semibold text-[#1677FF] break-all">
              {email}
            </span>
          </div>
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && hasError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* ── Status-specific content ── */}
      {status === "resent" && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Email xác minh mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.
          </span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="space-y-3 pt-1">
        {isVerified ? (
          <Link
            to={loginLink}
            className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Tiếp tục đăng nhập</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        ) : status !== "verifying" ? (
          <>
            {/* Open Email Button */}
            <button
              type="button"
              onClick={handleOpenEmail}
              className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>
                {emailProvider
                  ? `Mở ${emailProvider.name}`
                  : "Mở ứng dụng Email"}
              </span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Resend Countdown */}
            <div
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                cooldown > 0
                  ? "bg-slate-50 border border-slate-200 text-slate-500"
                  : "bg-blue-50 border border-blue-200 text-[#1677FF] cursor-pointer hover:bg-blue-100"
              }`}
              onClick={cooldown === 0 ? handleResend : undefined}
              role={cooldown === 0 ? "button" : undefined}
              tabIndex={cooldown === 0 ? 0 : undefined}
              onKeyDown={(e) => {
                if (cooldown === 0 && (e.key === "Enter" || e.key === " ")) {
                  handleResend();
                }
              }}
            >
              {isResending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#1677FF] border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi lại...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Gửi lại email sau</span>
                  <span className="font-bold text-slate-700">{cooldown}s</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gửi lại email xác minh</span>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>

      {/* ── Support Footer ── */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex items-start justify-center gap-1.5 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Không nhận được thư? Hãy kiểm tra thư mục{" "}
            <span className="font-semibold text-slate-500">Rác (Spam)</span>{" "}
            hoặc{" "}
            <span className="font-semibold text-slate-500">Quảng cáo</span>.
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 text-xs">
          <Link
            to="/support"
            className="font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
          >
            Trung tâm hỗ trợ
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            to={loginLink}
            className="inline-flex items-center gap-1 font-bold text-[#1677FF] hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Quay lại Đăng nhập</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailCard;
