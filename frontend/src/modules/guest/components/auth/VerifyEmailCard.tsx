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
import {
  AuthService,
  type AuthResponse,
} from "../../../../services/auth.service";

// ─── Types ───────────────────────────────────────────────────────────────────

type VerifyStatus = "pending" | "verifying" | "success" | "error" | "resent";

interface VerifyEmailCardProps {
  email: string;
  loginLink: string;
  /** Gọi khi backend xác minh OTP thành công (đã có JWT). */
  onVerified?: (res: AuthResponse) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const DEFAULT_COOLDOWN = 60; // seconds

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Thẻ xác minh email bằng mã OTP 6 số.
 *
 * Backend:
 *   POST /api/auth/verify-otp  { email, otp }  → AuthResponse (JWT)
 *   POST /api/auth/resend-otp  { email }       → MessageResponse
 */
export const VerifyEmailCard: React.FC<VerifyEmailCardProps> = ({
  email,
  loginLink,
  onVerified,
}) => {
  const [status, setStatus] = useState<VerifyStatus>("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(DEFAULT_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");
  const isVerifying = status === "verifying";
  const isVerified = status === "success";
  const hasError = status === "error";

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

  // ── Start cooldown + focus first box on mount ────────────────────────────
  useEffect(() => {
    startCooldown(DEFAULT_COOLDOWN);
    inputRefs.current[0]?.focus();
  }, [startCooldown]);

  // ── Verify handler ───────────────────────────────────────────────────────
  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH || isVerifying || isVerified) return;

      setStatus("verifying");
      setErrorMessage(null);
      setInfoMessage(null);

      try {
        const res = await AuthService.verifyOtp({ email, otp: code });
        setStatus("success");
        onVerified?.(res);
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Không thể xác minh mã OTP."
        );
        setDigits(Array(OTP_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 0);
      }
    },
    [email, isVerifying, isVerified, onVerified]
  );

  // ── OTP input handlers ───────────────────────────────────────────────────
  const updateDigits = (next: string[]) => {
    setDigits(next);
    if (hasError) {
      setStatus("pending");
      setErrorMessage(null);
    }
    const code = next.join("");
    if (code.length === OTP_LENGTH && next.every((d) => d !== "")) {
      handleVerify(code);
    }
  };

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    // Hỗ trợ nhập/dán nhiều số vào 1 ô
    const next = [...digits];
    let cursor = index;
    for (const ch of clean) {
      if (cursor >= OTP_LENGTH) break;
      next[cursor] = ch;
      cursor++;
    }
    updateDigits(next);
    inputRefs.current[Math.min(cursor, OTP_LENGTH - 1)]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerify(otp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    updateDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ── Resend handler ───────────────────────────────────────────────────────
  const handleResend = async () => {
    if (isResending || cooldown > 0) return;

    setIsResending(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await AuthService.resendOtp(email);
      setStatus("resent");
      setInfoMessage(res.message);
      setDigits(Array(OTP_LENGTH).fill(""));
      startCooldown(DEFAULT_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Không thể gửi lại mã OTP."
      );
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
              : hasError
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-white text-[#1677FF] border border-[#1677FF]/30 shadow-sm"
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
                : "Nhập mã OTP"}
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
          ) : isVerifying ? (
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
            : isVerifying
            ? "Đang xác minh..."
            : "Xác nhận email của bạn"}
        </h1>

        {isVerified ? (
          <p className="text-sm text-slate-500 leading-relaxed">
            Tài khoản MeGo Club của bạn đã được kích hoạt thành công. Đang
            chuyển hướng...
          </p>
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed">
            Nhập mã OTP gồm {OTP_LENGTH} chữ số chúng tôi đã gửi tới hòm thư
            điện tử (có hiệu lực trong 10 phút):
          </p>
        )}
      </div>

      {/* ── Email Badge ── */}
      {!isVerified && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
            <Mail className="w-4 h-4 text-[#1677FF] shrink-0" />
            <span className="text-sm font-semibold text-[#1677FF] break-all">
              {email}
            </span>
          </div>
        </div>
      )}

      {/* ── OTP Inputs ── */}
      {!isVerified && (
        <div
          className="flex justify-center gap-2 sm:gap-2.5"
          role="group"
          aria-label="Mã OTP"
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              id={`otp-digit-${i}`}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={OTP_LENGTH}
              value={digit}
              disabled={isVerifying}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              aria-label={`Chữ số OTP thứ ${i + 1}`}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border outline-none transition-all disabled:opacity-60 ${
                hasError
                  ? "border-red-400 bg-red-50/30 text-red-700 focus:ring-2 focus:ring-red-200"
                  : digit
                  ? "border-[#1677FF] bg-white text-slate-900 focus:ring-2 focus:ring-blue-100"
                  : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-[#1677FF] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Error Banner ── */}
      {errorMessage && hasError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* ── Resent info ── */}
      {status === "resent" && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {infoMessage ||
              "Mã OTP mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn."}
          </span>
        </div>
      )}

      {/* ── Actions ── */}
      {!isVerified && (
        <div className="space-y-3 pt-1">
          {/* Verify Button */}
          <button
            id="verify-otp-submit"
            type="button"
            onClick={() => handleVerify(otp)}
            disabled={otp.length !== OTP_LENGTH || isVerifying}
            className="w-full h-12 rounded-xl bg-[#1677FF] hover:bg-blue-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xác minh...</span>
              </>
            ) : (
              <span>Xác nhận</span>
            )}
          </button>

          {/* Open Email Button */}
          <button
            type="button"
            onClick={handleOpenEmail}
            className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>
              {emailProvider ? `Mở ${emailProvider.name}` : "Mở ứng dụng Email"}
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
                <span>Gửi lại mã sau</span>
                <span className="font-bold text-slate-700">{cooldown}s</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                <span>Gửi lại mã OTP</span>
              </>
            )}
          </div>
        </div>
      )}

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
