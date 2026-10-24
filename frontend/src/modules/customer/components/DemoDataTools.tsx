import { useRef, useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { customerApiMethods } from "../services/customerApi";

export default function DemoDataTools({ onReset }: { onReset: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false);
  if (!import.meta.env.DEV) return null;
  const download = () => { const blob = new Blob([customerApiMethods.exportCustomerData()], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "dataCustomer.json"; anchor.click(); URL.revokeObjectURL(url); };
  const importFile = async (file?: File) => { if (!file) return; setBusy(true); try { const parsed: unknown = JSON.parse(await file.text()); customerApiMethods.importCustomerData(parsed); toast.success("Đã nhập dữ liệu demo."); onReset(); } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Không thể đọc tệp JSON."); } finally { setBusy(false); if (inputRef.current) inputRef.current.value = ""; } };
  const reset = () => { if (!window.confirm("Đặt lại toàn bộ dữ liệu demo về ban đầu?")) return; customerApiMethods.resetCustomerData(); onReset(); toast.success("Đã khôi phục dữ liệu mẫu."); };
  return <section className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><h2 className="font-semibold text-slate-700">Dữ liệu demo</h2><p className="mb-3 mt-1 text-xs text-slate-500">Xuất, nhập hoặc khôi phục dữ liệu lưu trong trình duyệt.</p><div className="flex flex-wrap gap-2"><Button size="small" onClick={download}>Xuất JSON</Button><Button size="small" disabled={busy} onClick={() => inputRef.current?.click()}>Nhập JSON</Button><Button size="small" color="inherit" onClick={reset}>Đặt lại</Button></div><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={(event) => void importFile(event.target.files?.[0])}/></section>;
}
