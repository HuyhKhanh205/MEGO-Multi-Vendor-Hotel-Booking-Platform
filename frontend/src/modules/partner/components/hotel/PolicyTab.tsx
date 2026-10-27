import { Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import partnerHotelApi from "../../services/partnerHotelApi";
import type { HotelPolicyDto } from "../../types/backend.types";
import { TextField } from "../onboarding/FormField";
import { TextAreaField, ToggleField } from "../shared/FormControls";
import SaveBar from "../shared/SaveBar";
import DirtyReporter from "./DirtyReporter";

interface PolicyValues {
  checkInFrom: string;
  checkInUntil: string;
  checkOutUntil: string;
  freeCancelBeforeHours: string;
  cancellationFeePercent: string;
  refundable: boolean;
  allowPayAtHotel: boolean;
  requireManualCancelApproval: boolean;
  childPolicy: string;
  petPolicy: string;
  otherRules: string;
}

const schema = Yup.object({
  checkInFrom: Yup.string().required("Vui lòng nhập giờ bắt đầu nhận phòng"),
  checkInUntil: Yup.string()
    .required("Vui lòng nhập giờ nhận phòng muộn nhất")
    .test("after-from", "Phải sau giờ bắt đầu nhận phòng", function check(value) {
      const from = this.parent.checkInFrom as string;
      return !value || !from || value > from;
    }),
  checkOutUntil: Yup.string().required("Vui lòng nhập giờ trả phòng"),
  freeCancelBeforeHours: Yup.string().test("int", "Nhập số giờ nguyên từ 0 đến 720", (value) => !value || (/^\d+$/.test(value) && Number(value) <= 720)),
  cancellationFeePercent: Yup.string().test("percent", "Nhập phần trăm từ 0 đến 100", (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100)),
  childPolicy: Yup.string().max(500, "Tối đa 500 ký tự"),
  petPolicy: Yup.string().max(500, "Tối đa 500 ký tự"),
  otherRules: Yup.string().max(5000, "Tối đa 5.000 ký tự"),
});

const toValues = (policy: HotelPolicyDto): PolicyValues => ({
  checkInFrom: policy.checkInFrom?.slice(0, 5) ?? "",
  checkInUntil: policy.checkInUntil?.slice(0, 5) ?? "",
  checkOutUntil: policy.checkOutUntil?.slice(0, 5) ?? "",
  freeCancelBeforeHours: policy.freeCancelBeforeHours?.toString() ?? "",
  cancellationFeePercent: policy.cancellationFeePercent?.toString() ?? "",
  refundable: policy.refundable,
  allowPayAtHotel: policy.allowPayAtHotel,
  requireManualCancelApproval: policy.requireManualCancelApproval,
  childPolicy: policy.childPolicy ?? "",
  petPolicy: policy.petPolicy ?? "",
  otherRules: policy.otherRules ?? "",
});

const textOrNull = (value: string) => value.trim() || null;

interface PolicyTabProps {
  hotelId: number;
  policy: HotelPolicyDto;
  onSaved: (policy: HotelPolicyDto) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export const PolicyTab = ({ hotelId, policy, onSaved, onDirtyChange }: PolicyTabProps) => {
  const handleSubmit = async (values: PolicyValues, helpers: FormikHelpers<PolicyValues>) => {
    try {
      const saved = await partnerHotelApi.updatePolicy(hotelId, {
        checkInFrom: values.checkInFrom,
        checkInUntil: values.checkInUntil,
        checkOutUntil: values.checkOutUntil,
        freeCancelBeforeHours: values.freeCancelBeforeHours === "" ? null : Number(values.freeCancelBeforeHours),
        cancellationFeePercent: values.cancellationFeePercent === "" ? null : Number(values.cancellationFeePercent),
        refundable: values.refundable,
        allowPayAtHotel: values.allowPayAtHotel,
        requireManualCancelApproval: values.requireManualCancelApproval,
        childPolicy: textOrNull(values.childPolicy),
        petPolicy: textOrNull(values.petPolicy),
        otherRules: textOrNull(values.otherRules),
      });
      helpers.resetForm({ values: toValues(saved) });
      onSaved(saved);
      toast.success("Đã lưu chính sách khách sạn.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được chính sách.");
    }
  };

  return (
    <Formik<PolicyValues> initialValues={toValues(policy)} validationSchema={schema} onSubmit={handleSubmit}>
      {({ dirty, isSubmitting, resetForm, values }) => (
        <Form noValidate className="space-y-6">
          <DirtyReporter onChange={onDirtyChange} />
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Khung giờ nhận / trả phòng</h3>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField idPrefix="policy" name="checkInFrom" label="Nhận phòng từ" type="time" required />
              <TextField idPrefix="policy" name="checkInUntil" label="Nhận phòng muộn nhất" type="time" required />
              <TextField idPrefix="policy" name="checkOutUntil" label="Trả phòng trước" type="time" required />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Hủy phòng & hoàn tiền</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                idPrefix="policy"
                name="freeCancelBeforeHours"
                label="Hủy miễn phí trước giờ nhận phòng (giờ)"
                inputMode="numeric"
                hint={values.freeCancelBeforeHours ? `Khách hủy trước ${values.freeCancelBeforeHours} giờ được hoàn 100%.` : "Để trống nếu không cho hủy miễn phí."}
              />
              <TextField
                idPrefix="policy"
                name="cancellationFeePercent"
                label="Phí hủy sau thời hạn (% tổng tiền)"
                inputMode="numeric"
                hint="Áp dụng khi khách hủy muộn hơn thời hạn hủy miễn phí."
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <ToggleField name="refundable" label="Cho phép hoàn tiền" description="Tắt nếu giá phòng không hoàn hủy." />
              <ToggleField name="allowPayAtHotel" label="Thanh toán tại khách sạn" description="Khách có thể đặt trước, trả tiền khi nhận phòng." />
              <ToggleField name="requireManualCancelApproval" label="Duyệt hủy thủ công" description="Yêu cầu hủy phải được khách sạn xác nhận." />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Quy định khác</h3>
            <div className="grid gap-5 lg:grid-cols-2">
              <TextAreaField idPrefix="policy" name="childPolicy" label="Chính sách trẻ em & giường phụ" />
              <TextAreaField idPrefix="policy" name="petPolicy" label="Chính sách thú cưng" />
            </div>
            <TextAreaField idPrefix="policy" name="otherRules" label="Quy định & lưu ý khác" rows={4} />
          </section>

          <SaveBar dirty={dirty} saving={isSubmitting} onReset={() => resetForm()} />
        </Form>
      )}
    </Formik>
  );
};

export default PolicyTab;
