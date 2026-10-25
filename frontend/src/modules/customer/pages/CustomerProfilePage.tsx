import { useEffect, useState, type ReactNode } from "react";
import { Button, MenuItem, Skeleton, TextField, type TextFieldProps } from "@mui/material";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import isMobilePhone from "validator/lib/isMobilePhone.js";
import { toast } from "react-toastify";
import {
  AccountLayout,
  PageHeading,
  panelClass,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerProfile } from "../types/customer.types";

const schema = Yup.object({
  fullName: Yup.string().trim().required("Vui lòng nhập họ tên."),
  phone: Yup.string().test(
    "vn-phone",
    "Số điện thoại Việt Nam chưa đúng.",
    (value) => !value || isMobilePhone(value, "vi-VN"),
  ),
  birthDate: Yup.string().test(
    "past",
    "Ngày sinh không thể ở tương lai.",
    (value) => !value || Date.parse(value) <= Date.now(),
  ),
  nationality: Yup.string().trim().max(80, "Quốc tịch quá dài."),
  address: Yup.string().trim().max(200, "Địa chỉ quá dài."),
});

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const load = () => {
    customerApiMethods
      .getProfile()
      .then((nextProfile) => {
        setProfile(nextProfile);
        setIsEditing(false);
      })
      .catch(() => setError("Không thể tải hồ sơ."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <AccountLayout>
      <PageHeading
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin cá nhân để trải nghiệm đặt phòng thuận tiện hơn."
      />
      {loading ? (
        <Skeleton className="rounded-3xl" variant="rounded" height={480} />
      ) : error || !profile ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700"
        >
          <p>{error}</p>
          <Button
            onClick={() => {
              setLoading(true);
              setError("");
              void load();
            }}
            sx={{ mt: 1 }}
            variant="outlined"
            color="error"
          >
            Thử lại
          </Button>
        </div>
      ) : (
        <Formik
          initialValues={{
            ...profile,
            gender: profile.gender ?? "",
            nationality: profile.nationality ?? "",
            address: profile.address ?? "",
          }}
          enableReinitialize
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            try {
              const updated = await customerApiMethods.updateProfile(values);
              setProfile(updated);
              setIsEditing(false);
              toast.success("Đã lưu hồ sơ.");
            } catch {
              toast.error("Không thể lưu hồ sơ. Dữ liệu hiện tại được giữ nguyên.");
            } finally {
              helpers.setSubmitting(false);
            }
          }}
        >
          {({ resetForm, isSubmitting }) => (
            <Form className={`${panelClass} overflow-hidden !p-0`}>
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-5 py-7 text-white sm:px-8">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
                <div className="absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-cyan-300/10" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        profile.avatarUrl ||
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
                      }
                      alt="Ảnh đại diện"
                      className="h-20 w-20 rounded-2xl border-4 border-white/70 object-cover shadow-lg"
                    />
                    <div>
                      <p className="text-sm text-blue-100">Tài khoản MeGo</p>
                      <h2 className="mt-1 text-2xl font-bold">{profile.fullName}</h2>
                      <span className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                        ✓ Thành viên đã xác thực
                      </span>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "#1d4ed8",
                        "&:hover": { backgroundColor: "#eff6ff" },
                      }}
                    >
                      Thay đổi thông tin
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-7 p-5 sm:p-8">
                {isEditing ? (
                  <>
                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      <ProfileField name="fullName" label="Họ và tên" required />
                      <ProfileField
                        name="email"
                        label="Địa chỉ Email"
                        disabled
                        badge="ĐÃ XÁC THỰC"
                      />
                      <ProfileField
                        name="phone"
                        label="Số điện thoại"
                        required
                        badge="Đã liên kết SMS OTP"
                      />
                      <ProfileField name="birthDate" label="Ngày sinh" type="date" />
                      <GenderField />
                      <NationalityField />
                      <div className="sm:col-span-2">
                        <ProfileField name="address" label="Địa chỉ thường trú" />
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                      <Button
                        type="button"
                        color="inherit"
                        onClick={() => {
                          resetForm();
                          setIsEditing(false);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                          minWidth: 144,
                          borderRadius: "7px",
                          backgroundColor: "#1769ff",
                          boxShadow: "0 5px 12px rgba(23, 105, 255, 0.24)",
                          "&:hover": {
                            backgroundColor: "#0d5bea",
                            boxShadow: "0 6px 14px rgba(23, 105, 255, 0.3)",
                          },
                          "&.Mui-disabled": {
                            backgroundColor: "#1769ff",
                            color: "#fff",
                            opacity: 0.7,
                          },
                        }}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <ProfileSection
                      title="Thông tin liên hệ"
                    >
                      <ProfileValue label="Họ và tên" value={profile.fullName} />
                      <ProfileValue label="Địa chỉ Email" value={profile.email} verified />
                      <ProfileValue label="Số điện thoại" value={profile.phone} />
                      <ProfileValue
                        label="Ngày sinh"
                        value={formatBirthDate(profile.birthDate)}
                      />
                      <ProfileValue label="Giới tính" value={profile.gender} />
                      <ProfileValue label="Quốc tịch" value={profile.nationality} />
                      <div className="sm:col-span-2">
                        <ProfileValue label="Địa chỉ thường trú" value={profile.address} />
                      </div>
                    </ProfileSection>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </AccountLayout>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 font-semibold text-slate-900">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ProfileField({
  name,
  label,
  badge,
  children,
  ...props
}: Omit<TextFieldProps, "name" | "label"> & {
  name: string;
  label: string;
  badge?: string;
  children?: ReactNode;
}) {
  const [field, meta] = useField(name);
  return (
    <label className="block">
      <span className="mb-1.5 flex min-h-4 items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
        <span>
          {label}
          {props.required && <b className="ml-0.5 text-red-500">*</b>}
        </span>
        {badge && (
          <span className="text-[9px] font-bold text-blue-600">{badge}</span>
        )}
      </span>
      <TextField
        {...field}
        {...props}
        label={undefined}
        required={false}
        fullWidth
        error={Boolean(meta.touched && meta.error)}
        helperText={meta.touched && meta.error ? meta.error : undefined}
        placeholder={props.type === "date" ? undefined : `Nhập ${label.toLowerCase()}`}
        slotProps={{
          inputLabel: { shrink: props.type === "date" ? true : undefined },
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
      >
        {children}
      </TextField>
    </label>
  );
}

function GenderField() {
  const [field] = useField("gender");
  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">
        Giới tính
      </span>
      <div className="grid h-[38px] grid-cols-3 gap-1 rounded-lg bg-indigo-50 p-1">
        {["Nam", "Nữ", "Khác"].map((gender) => (
          <button
            key={gender}
            type="button"
            className={`rounded-md text-xs transition ${
              field.value === gender
                ? "bg-blue-600 font-semibold text-white shadow-sm"
                : "text-slate-500 hover:bg-white"
            }`}
            onClick={() => field.onChange({ target: { name: "gender", value: gender } })}
          >
            {gender}
          </button>
        ))}
      </div>
    </div>
  );
}

function NationalityField() {
  const [field] = useField("nationality");
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-slate-600">
        Quốc tịch
      </span>
      <TextField
        {...field}
        select
        fullWidth
        label={undefined}
        slotProps={{ select: { displayEmpty: true } }}
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
        }}
      >
        <MenuItem value="">Chưa cập nhật</MenuItem>
        <MenuItem value="Việt Nam">Việt Nam</MenuItem>
        <MenuItem value="Khác">Khác</MenuItem>
      </TextField>
    </label>
  );
}

function ProfileValue({
  label,
  value,
  verified = false,
}: {
  label: string;
  value?: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {verified && (
          <span className="text-[11px] font-medium text-emerald-600">Đã xác thực</span>
        )}
      </div>
      <p className="mt-1 text-sm font-medium text-slate-800">
        {value?.trim() || "Chưa cập nhật"}
      </p>
    </div>
  );
}

function formatBirthDate(birthDate: string) {
  if (!birthDate) return undefined;
  const date = new Date(`${birthDate}T00:00:00`);
  return Number.isNaN(date.getTime()) ? birthDate : date.toLocaleDateString("vi-VN");
}
