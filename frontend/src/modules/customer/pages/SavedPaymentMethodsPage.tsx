import { useEffect, useState } from "react";
import {
  AddCardOutlined,
  AccountCircleOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  EventOutlined,
  LinkOutlined,
  LockOutlined,
  NumbersOutlined,
  PhoneAndroidOutlined,
  ShieldOutlined,
  WalletOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AccountLayout, EmptyState, LoadingState, panelClass } from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { SavedPaymentMethod } from "../types/customer.types";

const schema = Yup.object({
  brand: Yup.string().required(),
  holderName: Yup.string().required("Nhập tên chủ thẻ."),
  last4: Yup.string().matches(/^\d{4}$/, "Nhập đúng 4 số cuối."),
  expiry: Yup.string().required("Nhập hạn dùng."),
});

const paymentFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#fff",
    fontSize: 13,
    "& fieldset": { borderColor: "#dbe3f0" },
    "&:hover fieldset": { borderColor: "#93c5fd" },
    "&.Mui-focused fieldset": { borderColor: "#0F62FE", borderWidth: 2 },
  },
  "& .MuiInputLabel-root": { fontSize: 13 },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    backgroundColor: "#fff",
    padding: "0 5px",
    marginLeft: "-4px",
    zIndex: 1,
  },
};

export default function SavedPaymentMethodsPage() {
  const [items, setItems] = useState<SavedPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState<SavedPaymentMethod | null>(null);
  const [walletToLink, setWalletToLink] = useState<"MoMo Pay" | "ZaloPay" | null>(null);
  const [linkedWallets, setLinkedWallets] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    customerApiMethods
      .getPaymentMethods()
      .then(setItems)
      .catch(() => setError("Không thể tải phương thức thanh toán."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    customerApiMethods
      .getPaymentMethods()
      .then((methods) => {
        if (active) setItems(methods);
      })
      .catch(() => {
        if (active) setError("Không thể tải phương thức thanh toán.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setDefault = async (item: SavedPaymentMethod) => {
    await customerApiMethods.setDefaultPaymentMethod(item.id);
    toast.success(`Đã đặt ${item.brand} làm phương thức mặc định.`);
    load();
  };

  return (
    <AccountLayout>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Phương thức thanh toán
        </h1>
        <Button
          variant="contained"
          startIcon={<AddCardOutlined />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#0F62FE",
            fontSize: 12,
            "&:hover": { backgroundColor: "#0052CC" },
          }}
        >
          Thêm thẻ mới
        </Button>
      </header>

      <section className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#0F62FE]">
          <ShieldOutlined />
        </span>
        <p className="text-xs leading-5 text-slate-600">
          <strong className="text-[#0F62FE]">Bảo mật chuẩn quốc tế PCI-DSS cấp độ 1:</strong>{" "}
          Thông tin thanh toán của bạn được mã hóa 256-bit SSL toàn trình và sử dụng Tokenization.
        </p>
        <span className="ml-auto hidden whitespace-nowrap rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 sm:block">
          PCI-DSS Level 1
        </span>
      </section>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
          <button onClick={() => void load()} className="ml-2 underline">Thử lại</button>
        </p>
      )}

      {loading ? (
        <div className={panelClass}><LoadingState /></div>
      ) : items.length === 0 ? (
        <EmptyState title="Bạn chưa lưu phương thức thanh toán nào." action="Thêm phương thức" to="/customer/payment-methods" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <PaymentMethodCard
              key={item.id}
              item={item}
              onSetDefault={() => void setDefault(item)}
              onRemove={() => setRemove(item)}
            />
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-blue-100 bg-blue-50/40 p-6 text-center transition-colors hover:border-[#0F62FE] hover:bg-blue-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0F62FE] shadow-sm">
              <AddCardOutlined />
            </span>
            <strong className="mt-3 text-base text-[#0F62FE]">+ Thêm phương thức thanh toán mới</strong>
            <span className="mt-1 max-w-xs text-xs text-slate-500">Hỗ trợ thẻ quốc tế, thẻ nội địa và ví điện tử</span>
          </button>
        </div>
      )}

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ví điện tử</h2>
            <p className="mt-1 text-xs text-slate-500">Liên kết ví để thanh toán nhanh hơn. Thông tin hiện chỉ hiển thị trên giao diện.</p>
          </div>
          <WalletOutlined className="text-[#0F62FE]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <WalletCard
            brand="MoMo Pay"
            description="Thanh toán nhanh qua ví MoMo"
            linkedPhone={linkedWallets["MoMo Pay"]}
            onLink={() => setWalletToLink("MoMo Pay")}
          />
          <WalletCard
            brand="ZaloPay"
            description="Liên kết tài khoản ZaloPay an toàn"
            linkedPhone={linkedWallets.ZaloPay}
            onLink={() => setWalletToLink("ZaloPay")}
          />
        </div>
      </section>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(15, 98, 254, 0.18)",
            },
          },
        }}
      >
        <DialogTitle className="!bg-gradient-to-br !from-[#0F62FE] !to-[#0043a8] !p-0 !text-white">
          <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
            <div>
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <AddCardOutlined />
              </span>
              <h2 className="text-xl font-bold">Thêm phương thức thanh toán</h2>
              <p className="mt-1 text-xs font-normal text-blue-100">
                Lưu token an toàn để thanh toán nhanh hơn lần sau
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-blue-100 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Đóng"
            >
              <CloseOutlined fontSize="small" />
            </button>
          </div>
          <div className="h-1 bg-gradient-to-r from-cyan-300 via-white to-blue-300" />
        </DialogTitle>
        <Formik
          initialValues={{ brand: "Visa", holderName: "", last4: "", expiry: "" }}
          validationSchema={schema}
          onSubmit={async (values, helpers) => {
            const item: SavedPaymentMethod = {
              ...values,
              id: `pm-${Date.now()}`,
              isDefault: items.length === 0,
              pendingBookingId: null,
            };
            await customerApiMethods.addPaymentMethod(item);
            setOpen(false);
            toast.success("Đã thêm token thanh toán.");
            load();
            helpers.setSubmitting(false);
          }}
        >
          <Form>
            <DialogContent className="!bg-slate-50 !px-6 !py-5">
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs text-slate-600">
                <LockOutlined sx={{ color: "#0F62FE", fontSize: 18 }} />
                <span><strong className="text-[#0F62FE]">Bảo mật token hóa</strong> · Không lưu số thẻ đầy đủ hoặc CVV.</span>
              </div>
              <div className="mb-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-gradient-to-r from-[#173b70] to-[#0b2b56] p-4 text-white shadow-md">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-blue-200">Phương thức mới</p>
                  <p className="mt-2 text-lg tracking-[0.18em]">•••• •••• •••• 0000</p>
                  <p className="mt-2 text-[9px] uppercase text-blue-200">Thẻ của bạn sẽ hiển thị an toàn</p>
                </div>
                <CreditCardOutlined sx={{ fontSize: 42, color: "#bfdbfe" }} />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-800">Thông tin phương thức</p>
              <div className="grid gap-3">
                <Field
                  as={TextField}
                  select
                  fullWidth
                  name="brand"
                  label="Loại phương thức"
                  sx={paymentFieldSx}
                >
                  <MenuItem value="Visa">Visa</MenuItem>
                  <MenuItem value="Mastercard">Mastercard</MenuItem>
                  <MenuItem value="ATM nội địa">ATM nội địa</MenuItem>
                  <MenuItem value="Ví điện tử">Ví điện tử</MenuItem>
                </Field>
                <Field
                  as={TextField}
                  fullWidth
                  name="holderName"
                  label="Tên chủ thẻ"
                  placeholder="NGUYEN VAN AN"
                  sx={paymentFieldSx}
                  slotProps={{ input: { startAdornment: <AccountCircleOutlined sx={{ mr: 1, color: "#94a3b8", fontSize: 19 }} /> } }}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    as={TextField}
                    fullWidth
                    name="last4"
                    label="Bốn số cuối"
                    placeholder="8888"
                    sx={paymentFieldSx}
                    slotProps={{ input: { startAdornment: <NumbersOutlined sx={{ mr: 1, color: "#94a3b8", fontSize: 19 }} /> } }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    name="expiry"
                    label="Hạn dùng MM/YY"
                    placeholder="10/28"
                    sx={paymentFieldSx}
                    slotProps={{ input: { startAdornment: <EventOutlined sx={{ mr: 1, color: "#94a3b8", fontSize: 19 }} /> } }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions className="!border-t !border-slate-100 !bg-white !px-6 !py-4">
              <Button onClick={() => setOpen(false)} sx={{ borderRadius: "8px", color: "#64748b", fontWeight: 600 }}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<LockOutlined />}
                sx={{ borderRadius: "8px", backgroundColor: "#0F62FE", px: 2.5, fontWeight: 700, "&:hover": { backgroundColor: "#0052CC" } }}
              >
                Lưu phương thức
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>

      <Dialog open={Boolean(walletToLink)} onClose={() => setWalletToLink(null)} fullWidth maxWidth="xs">
        <DialogTitle>Liên kết {walletToLink}</DialogTitle>
        <DialogContent>
          <div className={`mb-4 rounded-lg p-3 text-sm font-semibold ${walletToLink === "MoMo Pay" ? "bg-pink-50 text-pink-700" : "bg-blue-50 text-blue-700"}`}>
            <PhoneAndroidOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
            Nhập số điện thoại đăng ký {walletToLink}
          </div>
          <TextField
            autoFocus
            fullWidth
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            type="tel"
            slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
            id="wallet-phone"
          />
          <p className="mt-3 text-[11px] leading-4 text-slate-500">
            Đây là thao tác mô phỏng giao diện. Chưa phát sinh liên kết hoặc lưu dữ liệu thật.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWalletToLink(null)}>Hủy</Button>
          <Button
            variant="contained"
            startIcon={<LinkOutlined />}
            onClick={() => {
              const phone = document.getElementById("wallet-phone") as HTMLInputElement | null;
              const value = phone?.value.trim() ?? "";
              if (!/^0\d{9}$/.test(value)) {
                toast.error("Vui lòng nhập số điện thoại hợp lệ 10 số.");
                return;
              }
              if (walletToLink) {
                setLinkedWallets((wallets) => ({ ...wallets, [walletToLink]: value }));
                toast.success(`Đã liên kết ${walletToLink} trên giao diện.`);
              }
              setWalletToLink(null);
            }}
            sx={{ borderRadius: "8px", backgroundColor: "#0F62FE", "&:hover": { backgroundColor: "#0052CC" } }}
          >
            Liên kết ví
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(remove)} onClose={() => setRemove(null)}>
        <DialogTitle>Xóa phương thức?</DialogTitle>
        <DialogContent>{remove?.pendingBookingId ? `Không thể xóa vì phương thức đang gắn với đơn ${remove.pendingBookingId}.` : "Phương thức sẽ bị xóa khỏi tài khoản."}</DialogContent>
        <DialogActions>
          <Button onClick={() => setRemove(null)}>Đóng</Button>
          {remove && !remove.pendingBookingId && (
            <Button color="error" onClick={() => void customerApiMethods.removePaymentMethod(remove.id).then(() => { setRemove(null); load(); })}>Xóa</Button>
          )}
        </DialogActions>
      </Dialog>
    </AccountLayout>
  );
}

function WalletCard({
  brand,
  description,
  linkedPhone,
  onLink,
}: {
  brand: "MoMo Pay" | "ZaloPay";
  description: string;
  linkedPhone?: string;
  onLink: () => void;
}) {
  const momo = brand === "MoMo Pay";
  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className={`relative min-h-36 overflow-hidden p-5 text-white ${momo ? "bg-gradient-to-br from-pink-700 via-fuchsia-600 to-pink-500" : "bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500"}`}>
        <div className="absolute -bottom-16 -right-8 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-700">
              {momo ? "M" : "Z"}
            </span>
            <strong className="text-lg">{brand}</strong>
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold">
            {linkedPhone ? "Đã liên kết" : "Chưa liên kết"}
          </span>
        </div>
        <p className="relative mt-7 text-xs text-white/85">{linkedPhone ? `Số liên kết: ${linkedPhone}` : description}</p>
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        {linkedPhone ? (
          <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircleOutlined fontSize="small" /> Ví đã sẵn sàng
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">Chưa có ví được liên kết</span>
        )}
        <Button
          size="small"
          variant={linkedPhone ? "outlined" : "contained"}
          onClick={onLink}
          startIcon={<LinkOutlined />}
          sx={{
            borderRadius: "8px",
            color: linkedPhone ? "#0F62FE" : "#fff",
            borderColor: "#0F62FE",
            backgroundColor: linkedPhone ? "transparent" : "#0F62FE",
            fontSize: 11,
            "&:hover": { backgroundColor: linkedPhone ? "#eff6ff" : "#0052CC" },
          }}
        >
          {linkedPhone ? "Đổi liên kết" : "Liên kết ví"}
        </Button>
      </div>
    </article>
  );
}

function PaymentMethodCard({
  item,
  onSetDefault,
  onRemove,
}: {
  item: SavedPaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
}) {
  const wallet = item.brand === "Ví điện tử";
  const mastercard = item.brand === "Mastercard";
  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className={`relative min-h-36 overflow-hidden p-5 text-white ${wallet ? "bg-gradient-to-br from-fuchsia-700 to-pink-500" : mastercard ? "bg-gradient-to-br from-slate-700 to-slate-900" : "bg-gradient-to-br from-[#173b70] to-[#0b2b56]"}`}>
        <div className="absolute -bottom-14 -right-7 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            {wallet ? <WalletOutlined /> : <CreditCardOutlined />}
            <strong className="text-lg">{item.brand}</strong>
          </div>
          {item.isDefault && <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold">Mặc định</span>}
        </div>
        <p className="relative mt-5 text-lg tracking-[0.28em]">•••• •••• •••• {item.last4}</p>
        <div className="relative mt-3 flex justify-between text-[9px] uppercase tracking-wider text-white/70">
          <span>Chủ thẻ<strong className="mt-1 block text-xs tracking-normal text-white">{item.holderName}</strong></span>
          <span>Hết hạn<strong className="mt-1 block text-xs tracking-normal text-white">{item.expiry}</strong></span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <Button
          size="small"
          onClick={onSetDefault}
          disabled={item.isDefault}
          sx={{ borderRadius: "8px", backgroundColor: item.isDefault ? "#eff6ff" : "transparent", color: "#0F62FE", fontSize: 11 }}
        >
          {item.isDefault ? "✓ Mặc định" : "Đặt làm mặc định"}
        </Button>
        <div className="flex gap-1">
          <Button size="small" startIcon={<EditOutlined />} sx={{ color: "#64748b", fontSize: 11 }}>Sửa</Button>
          <Button size="small" onClick={onRemove} sx={{ minWidth: 32, color: "#dc2626" }} aria-label="Xóa phương thức">
            <DeleteOutlineOutlined fontSize="small" />
          </Button>
        </div>
      </div>
    </article>
  );
}
