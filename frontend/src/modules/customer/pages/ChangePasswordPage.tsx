import { useState } from "react";
import {
  DevicesOutlined,
  InfoOutlined,
  LockOutlined,
  NotificationsActiveOutlined,
  ShieldOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Formik, Form, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  AccountLayout,
  PageHeading,
  panelClass,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import { getPasswordChecks } from "../utils/password";

const schema = Yup.object({
  current: Yup.string().required("Nhập mật khẩu hiện tại."),
  next: Yup.string()
    .min(8, "Tối thiểu 8 ký tự.")
    .required("Nhập mật khẩu mới."),
  confirm: Yup.string()
    .oneOf([Yup.ref("next")], "Mật khẩu xác nhận chưa khớp.")
    .required("Nhập lại mật khẩu mới."),
});

type PasswordValues = {
  current: string;
  next: string;
  confirm: string;
};

export default function ChangePasswordPage() {
  const [visible, setVisible] = useState(false);

  return (
    <AccountLayout>
      <PageHeading title="Bảo mật & Mật khẩu" />
      <section className="space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
              <ShieldOutlined fontSize="small" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Bảo vệ xác thực 2 lớp (2FA){" "}
                <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  Đang bật
                </span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Tài khoản được bảo vệ bởi SMS OTP và khóa nhận diện quốc tế
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Lần đổi gần nhất: 45 ngày trước</p>
        </div>

        <Formik
          initialValues={{ current: "", next: "", confirm: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              await customerApiMethods.changePassword(values.current, values.next);
              toast.success("Đổi mật khẩu thành công.");
              helpers.resetForm();
            } catch (error) {
              helpers.setFieldError(
                "current",
                error instanceof Error
                  ? error.message
                  : "Không thể đổi mật khẩu.",
              );
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={`${panelClass} space-y-7 !p-5 sm:!p-8`}>
              <div className="space-y-4">
                <PasswordField
                  name="current"
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu đang sử dụng"
                  visible={visible}
                />
                <PasswordField
                  name="next"
                  label="Mật khẩu mới"
                  placeholder="Nhập mật khẩu mới"
                  visible={visible}
                  icon={<LockOutlined fontSize="small" />}
                />
                <PasswordStrength />
                <PasswordField
                  name="confirm"
                  label="Nhập lại mật khẩu mới"
                  placeholder="Nhập lại mật khẩu mới"
                  visible={visible}
                  icon={<LockOutlined fontSize="small" />}
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-blue-700"
                onClick={() => setVisible((value) => !value)}
              >
                {visible ? <VisibilityOff fontSize="inherit" /> : <Visibility fontSize="inherit" />}
                {visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              </button>

              <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-slate-600">
                <InfoOutlined className="mt-0.5 text-blue-600" sx={{ fontSize: 15 }} />
                <span>
                  <b className="text-slate-700">Mẹo bảo mật:</b> Không sử dụng mật khẩu
                  trùng với các tài khoản mạng xã hội hoặc thông tin dễ đoán như ngày
                  sinh, số điện thoại hoặc biển số xe.
                </span>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <Button color="inherit" type="reset">
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: 144 }}>
                  Cập nhật mật khẩu
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="grid gap-5 sm:grid-cols-2">
          <SecurityCard
            icon={<DevicesOutlined fontSize="small" />}
            title="Phiên đăng nhập hiện hoạt"
            description="Đang đăng nhập trên 2 thiết bị (MacBook Pro - TPHCM & iPhone 15 Pro)."
            action="Đăng xuất khỏi thiết bị khác"
          />
          <SecurityCard
            icon={<NotificationsActiveOutlined fontSize="small" />}
            title="Cảnh báo đăng nhập lạ"
            description="Thông báo tức thì qua Email và SMS khi phát hiện truy cập từ thiết bị mới."
            action="Bảo mật tối đa đã kích hoạt"
          />
        </div>
      </section>
    </AccountLayout>
  );
}

function PasswordField({
  name,
  label,
  placeholder,
  visible,
  icon,
}: {
  name: keyof PasswordValues;
  label: string;
  placeholder: string;
  visible: boolean;
  icon?: React.ReactNode;
}) {
  const [field, meta] = useField(name);
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-700">
        {label} <b className="text-red-500">*</b>
      </span>
      <TextField
        {...field}
        fullWidth
        size="small"
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error}
        slotProps={{
          input: {
            startAdornment: icon,
            endAdornment: visible ? <VisibilityOff sx={{ color: "#94a3b8", fontSize: 16 }} /> : <Visibility sx={{ color: "#94a3b8", fontSize: 16 }} />,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "7px",
            backgroundColor: "#eef2ff",
            fontSize: "12px",
            "& fieldset": { borderColor: "transparent" },
            "&:hover fieldset": { borderColor: "#c7d2fe" },
            "&.Mui-focused fieldset": { borderColor: "#2563eb" },
          },
          "& .MuiInputBase-input": { padding: "9px 11px" },
          "& .MuiFormHelperText-root": { marginLeft: 0 },
        }}
      />
    </label>
  );
}

function PasswordStrength() {
  const { values } = useFormikContext<PasswordValues>();
  const checks = getPasswordChecks(values.next);
  const score = Object.values(checks).filter(Boolean).length;
  const strength = score < 3 ? "Yếu" : score < 5 ? "Trung bình" : "Mạnh (Strong)";

  return (
    <div className="-mt-1 space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`h-1 flex-1 rounded-full ${index < score ? "bg-emerald-500" : "bg-slate-200"}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Độ bảo mật mật khẩu:</span>
        <b className={score >= 3 ? "text-emerald-600" : "text-amber-600"}>{strength}</b>
      </div>
      <div className="grid gap-x-4 gap-y-1 rounded-xl bg-indigo-50/60 px-4 py-3 text-[11px] text-slate-600 sm:grid-cols-2">
        <span className={checks.length ? "text-emerald-600" : ""}>● Tối thiểu 8 ký tự</span>
        <span className={checks.upper && checks.lower ? "text-emerald-600" : ""}>● Ít nhất 1 chữ hoa & 1 chữ thường</span>
        <span className={checks.number ? "text-emerald-600" : ""}>● Ít nhất 1 chữ số (0–9)</span>
        <span className={checks.special ? "text-emerald-600" : ""}>● Ký tự đặc biệt (!@#$%^&*)</span>
      </div>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className={`${panelClass} flex gap-4 !p-5`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        {icon}
      </span>
      <div>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        <p className="mt-2 text-xs font-semibold text-blue-700">{action}</p>
      </div>
    </div>
  );
}
