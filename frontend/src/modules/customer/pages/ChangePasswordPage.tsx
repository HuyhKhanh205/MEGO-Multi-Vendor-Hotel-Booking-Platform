import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AccountLayout, PageHeading, panelClass } from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import { getPasswordChecks } from "../utils/password";

const schema = Yup.object({ current: Yup.string().required("Nhập mật khẩu hiện tại."), next: Yup.string().min(8, "Tối thiểu 8 ký tự.").required("Nhập mật khẩu mới."), confirm: Yup.string().oneOf([Yup.ref("next")], "Mật khẩu xác nhận chưa khớp.").required("Nhập lại mật khẩu mới.") });
export default function ChangePasswordPage() {
  const [visible, setVisible] = useState(false);
  return <AccountLayout><PageHeading title="Đổi mật khẩu" /><Formik initialValues={{ current: "", next: "", confirm: "" }} validationSchema={schema} onSubmit={async (values, helpers) => { try { await customerApiMethods.changePassword(values.current, values.next); toast.success("Đổi mật khẩu thành công."); helpers.resetForm(); } catch (error) { helpers.setFieldError("current", error instanceof Error ? error.message : "Không thể đổi mật khẩu."); } finally { helpers.setSubmitting(false); } }}><Form className={`${panelClass} max-w-2xl space-y-4`}><TextField name="current" type={visible ? "text" : "password"} label="Mật khẩu hiện tại" fullWidth /><TextField name="next" type={visible ? "text" : "password"} label="Mật khẩu mới" fullWidth /><TextField name="confirm" type={visible ? "text" : "password"} label="Xác nhận mật khẩu mới" fullWidth /><button type="button" className="text-sm text-blue-700" onClick={() => setVisible((value) => !value)}>{visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</button><FormikPasswordChecklist /><Button type="submit" variant="contained">Cập nhật mật khẩu</Button></Form></Formik></AccountLayout>;
}
function FormikPasswordChecklist() { const formik = useFormikContext<{ current: string; next: string; confirm: string }>(); const checks = getPasswordChecks(formik.values.next); const score = Object.values(checks).filter(Boolean).length; return <div className="space-y-2"><div className="h-2 rounded bg-slate-100"><div className={`h-full rounded ${score < 3 ? "bg-red-400" : score < 5 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${score * 20}%` }} /></div><p className="text-xs text-slate-500">{score < 3 ? "Yếu" : score < 5 ? "Trung bình" : "Mạnh"}: ≥8 ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt</p></div>; }

