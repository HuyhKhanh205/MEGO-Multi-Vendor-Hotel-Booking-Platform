import { useState } from "react";
import { useFormikContext } from "formik";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { PasswordStrengthIndicator } from "../../../guest/components/register/PasswordStrengthIndicator";
import type { OnboardingForm } from "../../types/partner.types";
import { TextField } from "./FormField";

export const StepRepresentative = () => {
  const { values } = useFormikContext<OnboardingForm>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField name="representativeName" label="Họ và tên người đại diện pháp luật / GĐKD" icon={BadgeOutlined} required placeholder="VD: Nguyễn Quốc Anh" autoComplete="name" />
      <TextField name="email" label="Email công việc quản lý" icon={MailOutlineOutlined} required type="email" inputMode="email" placeholder="ten@khachsan.vn" autoComplete="email" hint="Dùng để đăng nhập Extranet và nhận thông báo hợp đồng điện tử." />
      <TextField name="phone" label="Số điện thoại liên hệ trực tiếp" icon={PhoneOutlined} required type="tel" inputMode="tel" placeholder="0908 123 456" autoComplete="tel" />
      <div className="space-y-1.5">
        <TextField
          name="password"
          label="Mật khẩu tài khoản Extranet"
          icon={LockOutlined}
          required
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Tối thiểu 10 ký tự"
          hint="Gồm tối thiểu 10 ký tự, có chữ hoa, chữ số và ký tự đặc biệt."
          trailing={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-600" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
              {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 18 }} /> : <VisibilityOutlined sx={{ fontSize: 18 }} />}
            </button>
          }
        />
        <PasswordStrengthIndicator password={values.password} />
      </div>
    </div>
  );
};

export default StepRepresentative;
