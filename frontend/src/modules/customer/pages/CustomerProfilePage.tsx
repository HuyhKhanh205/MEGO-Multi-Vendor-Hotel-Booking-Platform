import { useEffect, useState } from "react";
import { Button, Skeleton, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import isMobilePhone from "validator/lib/isMobilePhone.js";
import { toast } from "react-toastify";
import { AccountLayout, PageHeading, panelClass } from "../components/CustomerShared";
import DemoDataTools from "../components/DemoDataTools";
import { customerApiMethods } from "../services/customerApi";
import type { CustomerProfile } from "../types/customer.types";

const schema = Yup.object({ fullName: Yup.string().trim().required("Vui lòng nhập họ tên."), phone: Yup.string().test("vn-phone", "Số điện thoại Việt Nam chưa đúng.", (value) => Boolean(value && isMobilePhone(value, "vi-VN"))), birthDate: Yup.string().test("past", "Ngày sinh không thể ở tương lai.", (value) => !value || Date.parse(value) <= Date.now()) });
export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = () => { customerApiMethods.getProfile().then(setProfile).catch(() => setError("Không thể tải hồ sơ.")).finally(() => setLoading(false)); };
  useEffect(load, []);
  return <AccountLayout><PageHeading title="Hồ sơ cá nhân" />{loading ? <Skeleton height={260} /> : error || !profile ? <div role="alert" className="text-red-600">{error}<Button onClick={load}>Thử lại</Button></div> : <Formik initialValues={profile} enableReinitialize validationSchema={schema} onSubmit={async (values, helpers) => { try { const updated = await customerApiMethods.updateProfile(values); setProfile(updated); toast.success("Đã lưu hồ sơ."); } catch { toast.error("Không thể lưu hồ sơ. Dữ liệu hiện tại được giữ nguyên."); } finally { helpers.setSubmitting(false); } }}><Form className={`${panelClass} space-y-4`}><Field as={TextField} name="fullName" label="Họ và tên" fullWidth /><TextField label="Email" fullWidth value={profile.email} disabled /><Field as={TextField} name="phone" label="Số điện thoại" fullWidth /><Field as={TextField} name="birthDate" label="Ngày sinh" type="date" fullWidth slotProps={{ inputLabel: { shrink: true } }} /><Button type="submit" variant="contained">Lưu thay đổi</Button></Form></Formik>}<DemoDataTools onReset={load} /></AccountLayout>;
}

