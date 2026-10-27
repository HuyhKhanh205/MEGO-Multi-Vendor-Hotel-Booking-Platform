import { Form, Formik, useField, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import BadgeOutlined from "@mui/icons-material/BadgeOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import { StaffFieldError } from "../../services/partnerStaffApi";
import type { HotelSummaryDto, PartnerStaffDto, StaffPosition, StaffRequest } from "../../types/backend.types";
import { TextField } from "../onboarding/FormField";
import { SelectField } from "../shared/FormControls";
import Overlay from "../shared/Overlay";
import { POSITION_LABELS, POSITION_OPTIONS, POSITION_TEMPLATES } from "./permissionCatalog";

interface StaffValues {
  fullName: string;
  email: string;
  phone: string;
  position: StaffPosition;
  /** "ALL" = mọi cơ sở của đối tác */
  hotelId: string;
}

const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

const schema = Yup.object({
  fullName: Yup.string().trim().required("Vui lòng nhập họ tên").min(2, "Họ tên quá ngắn").max(100, "Tối đa 100 ký tự"),
  email: Yup.string().trim().required("Vui lòng nhập email").email("Email không hợp lệ").max(150, "Tối đa 150 ký tự"),
  phone: Yup.string().test("vn-phone", "Số điện thoại Việt Nam gồm 10 số, bắt đầu bằng 03/05/07/08/09", (value) => !value || PHONE_REGEX.test(value.replace(/\s+/g, ""))),
  position: Yup.string().required("Chọn vai trò"),
});

const toValues = (staff: PartnerStaffDto | null): StaffValues => ({
  fullName: staff?.fullName ?? "",
  email: staff?.email ?? "",
  phone: staff?.phone ?? "",
  position: staff?.position ?? "FRONT_DESK",
  hotelId: staff?.hotelId === null || !staff ? "ALL" : String(staff.hotelId),
});

const toRequest = (values: StaffValues): StaffRequest => ({
  fullName: values.fullName.trim().replace(/\s+/g, " "),
  email: values.email.trim().toLowerCase(),
  phone: values.phone.replace(/\s+/g, "") || null,
  position: values.position,
  hotelId: values.hotelId === "ALL" ? null : Number(values.hotelId),
});

const PositionNote = ({ staff }: { staff: PartnerStaffDto | null }) => {
  const [field] = useField<StaffPosition>("position");
  if (!staff) {
    return (
      <p className="rounded-xl bg-blue-50/70 p-3 text-xs leading-relaxed text-slate-600 dark:bg-blue-500/10">
        Nhân viên mới nhận <strong>{POSITION_TEMPLATES[field.value].length} quyền mặc định</strong> của vai trò {POSITION_LABELS[field.value]}. Bạn có thể chỉnh chi tiết ở màn Phân quyền.
      </p>
    );
  }
  if (field.value === staff.position) return null;
  return (
    <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
      Đổi vai trò sang {POSITION_LABELS[field.value]} sẽ tự gỡ các quyền không dành cho vai trò này.
    </p>
  );
};

interface StaffFormModalProps {
  open: boolean;
  staff: PartnerStaffDto | null;
  hotels: HotelSummaryDto[];
  onClose: () => void;
  /** Ném StaffFieldError để báo lỗi tại ô tương ứng */
  onSubmit: (request: StaffRequest) => Promise<void>;
}

const FORM_ID = "staff-form";

export const StaffFormModal = ({ open, staff, hotels, onClose, onSubmit }: StaffFormModalProps) => {
  const handleSubmit = async (values: StaffValues, helpers: FormikHelpers<StaffValues>) => {
    try {
      await onSubmit(toRequest(values));
    } catch (error) {
      if (error instanceof StaffFieldError) helpers.setFieldError(error.field, error.message);
      else toast.error(error instanceof Error ? error.message : "Không lưu được nhân viên.");
    }
  };

  const hotelOptions = [{ value: "ALL", label: "Tất cả cơ sở" }, ...hotels.map((hotel) => ({ value: String(hotel.id), label: hotel.name }))];

  return (
    <Formik<StaffValues> key={staff?.id ?? "new"} initialValues={toValues(staff)} validationSchema={schema} enableReinitialize onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Overlay
          open={open}
          onClose={onClose}
          widthClass="max-w-xl"
          title={staff ? "Sửa thông tin nhân viên" : "Thêm nhân viên"}
          subtitle={staff ? staff.email : "Tài khoản đăng nhập vào cổng đối tác với quyền giới hạn."}
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Hủy</button>
              <button type="submit" form={FORM_ID} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003db3] disabled:opacity-60">
                {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {staff ? "Lưu thay đổi" : "Gửi lời mời"}
              </button>
            </div>
          }
        >
          <Form id={FORM_ID} noValidate className="space-y-5">
            <TextField idPrefix="staff" name="fullName" label="Họ và tên" icon={BadgeOutlined} required placeholder="VD: Nguyễn Văn An" autoComplete="off" />
            {staff ? (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-slate-700">Email đăng nhập</p>
                <p className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 dark:bg-white/5">{staff.email}</p>
                <p className="text-xs text-slate-500">Email không đổi được sau khi tạo. Cần đổi thì xóa và mời lại.</p>
              </div>
            ) : (
              <TextField idPrefix="staff" name="email" label="Email đăng nhập" icon={EmailOutlined} required type="email" inputMode="email" placeholder="ten@khachsan.vn" autoComplete="off" />
            )}
            <TextField idPrefix="staff" name="phone" label="Số điện thoại" icon={PhoneOutlined} inputMode="tel" placeholder="0905 123 456" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField idPrefix="staff" name="position" label="Vai trò" required options={POSITION_OPTIONS} />
              <SelectField idPrefix="staff" name="hotelId" label="Phạm vi làm việc" options={hotelOptions} hint="Khách sạn nhân viên được thao tác." />
            </div>
            <PositionNote staff={staff} />
            {!staff && (
              <p className="flex gap-2 rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-600">
                <MarkEmailReadOutlined sx={{ fontSize: 18 }} className="shrink-0 text-[#1677FF]" />
                MeGo sẽ gửi email mời nhân viên tự đặt mật khẩu. Tài khoản ở trạng thái "Chờ kích hoạt" cho tới khi nhân viên xác nhận.
              </p>
            )}
          </Form>
        </Overlay>
      )}
    </Formik>
  );
};

export default StaffFormModal;
