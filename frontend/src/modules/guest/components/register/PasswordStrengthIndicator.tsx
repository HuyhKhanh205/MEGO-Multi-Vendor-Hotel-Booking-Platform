import React from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export const evaluatePasswordStrength = (
  pass: string
): { score: StrengthLevel; label: string; color: string; desc: string } => {
  if (!pass) {
    return {
      score: 0,
      label: "Chưa nhập",
      color: "bg-slate-200 text-slate-400",
      desc: "Mật khẩu tối thiểu 8 ký tự",
    };
  }

  let points = 0;
  if (pass.length >= 8) points += 1;
  if (pass.length >= 12) points += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) points += 1;
  if (/\d/.test(pass)) points += 1;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) points += 1;

  if (points <= 1) {
    return {
      score: 1,
      label: "Yếu",
      color: "bg-red-500 text-red-600",
      desc: "Nên thêm chữ hoa, số hoặc ký tự đặc biệt",
    };
  }
  if (points === 2 || points === 3) {
    return {
      score: 2,
      label: "Trung bình",
      color: "bg-amber-500 text-amber-600",
      desc: "Độ an toàn khá, có thể tăng độ dài",
    };
  }
  if (points === 4) {
    return {
      score: 3,
      label: "Mạnh",
      color: "bg-emerald-500 text-emerald-600",
      desc: "Mật khẩu an toàn đạt chuẩn MeGo",
    };
  }
  return {
    score: 4,
    label: "Rất mạnh",
    color: "bg-blue-600 text-[#1677FF]",
    desc: "Độ bảo mật tối ưu",
  };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const { score, label, desc } = evaluatePasswordStrength(password);

  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex > score || score === 0) return "bg-slate-200";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-amber-500";
    if (score === 3) return "bg-emerald-500";
    return "bg-[#1677FF]";
  };

  return (
    <div className="space-y-1.5 pt-1">
      {/* 4 Segment Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1.5 rounded-full transition-all duration-300 ${getSegmentColor(
              seg
            )}`}
          />
        ))}
      </div>

      {/* Label & Description */}
      {password && (
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <span className="text-slate-400 font-medium">{desc}</span>
          <span
            className={`font-bold ${
              score === 1
                ? "text-red-600"
                : score === 2
                ? "text-amber-600"
                : score === 3
                ? "text-emerald-600"
                : "text-[#1677FF]"
            }`}
          >
            Độ mạnh: {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;