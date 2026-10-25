import { Link } from "react-router-dom";
import { useField } from "formik";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";
import StoreOutlined from "@mui/icons-material/StoreOutlined";
import { PAYOUT_CYCLES, VN_BANKS } from "../../data/onboardingMock";
import type { PayoutCycle } from "../../types/partner.types";
import { FieldShell, TextField } from "./FormField";
import { inputClassName } from "./formStyles";

const BankSelect = () => {
  const [field, meta] = useField<string>("bankCode");
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell id="onboarding-bankCode" label="Ngân hàng thụ hưởng" required error={error}>
      <div className="relative">
        <AccountBalanceOutlined sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <select {...field} id="onboarding-bankCode" aria-invalid={!!error} className={inputClassName(!!error)}>
          <option value="">Chọn ngân hàng</option>
          {VN_BANKS.map((bank) => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
        </select>
      </div>
    </FieldShell>
  );
};

const PayoutCyclePicker = () => {
  const [field, , helpers] = useField<PayoutCycle>("payoutCycle");
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-slate-700">Chu kỳ đối soát và thanh toán doanh thu</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {PAYOUT_CYCLES.map((cycle) => {
          const selected = field.value === cycle.value;
          return (
            <label key={cycle.value} className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 ${selected ? "border-[#1677FF] bg-blue-50/70 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-300"}`}>
              <input type="radio" name="payoutCycle" value={cycle.value} checked={selected} onChange={() => { void helpers.setValue(cycle.value); }} className="mt-1 h-4 w-4 accent-[#1677FF]" />
              <span>
                <span className={`block text-sm font-bold ${selected ? "text-[#004CCD] dark:text-blue-300" : "text-slate-800"}`}>{cycle.title}</span>
                <span className="block text-xs leading-relaxed text-slate-500">{cycle.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

const TermsCheckbox = () => {
  const [field, meta] = useField<boolean>({ name: "acceptedTerms", type: "checkbox" });
  const error = meta.touched ? meta.error : undefined;
  return (
    <div className={`rounded-2xl border p-4 ${error ? "border-red-300 bg-red-50/40" : "border-slate-200 bg-slate-50/60 dark:bg-white/5"}`}>
      <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-slate-600">
        <input type="checkbox" name={field.name} checked={!!field.checked} onChange={field.onChange} onBlur={field.onBlur} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1677FF]" />
        <span>
          Tôi xác nhận thông tin người đại diện, cơ sở lưu trú và tài liệu pháp lý đính kèm là chính xác, trung thực. Tôi đồng ý tuân thủ{" "}
          <Link to="/policies/terms" target="_blank" className="font-semibold text-[#1677FF] hover:underline">Điều khoản hợp tác Đối tác MeGo</Link> và{" "}
          <Link to="/policies/privacy" target="_blank" className="font-semibold text-[#1677FF] hover:underline">Quy chế bảo mật dữ liệu doanh nghiệp B2B</Link>.
        </span>
      </label>
      {error && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
};

export const StepPayout = () => (
  <div className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <BankSelect />
      <TextField name="accountNumber" label="Số tài khoản thanh toán doanh nghiệp (VND)" icon={CreditCardOutlined} required inputMode="numeric" placeholder="Chỉ nhập chữ số" />
      <TextField name="accountHolder" label="Tên chủ tài khoản thụ hưởng" icon={PersonOutlineOutlined} required placeholder="VD: CÔNG TY TNHH DU LỊCH BIỂN XANH" hint="Phải trùng khớp 100% với tên trên Giấy chứng nhận ĐKKD." />
      <TextField name="bankBranch" label="Chi nhánh / Phòng giao dịch mở tài khoản" icon={StoreOutlined} required placeholder="VD: Chi nhánh Sài Gòn – PGD Bến Nghé" />
    </div>
    <PayoutCyclePicker />
    <TermsCheckbox />
  </div>
);

export default StepPayout;
