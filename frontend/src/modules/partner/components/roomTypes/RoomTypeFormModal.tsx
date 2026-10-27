import { Form, Formik, useField } from "formik";
import * as Yup from "yup";
import BedOutlined from "@mui/icons-material/BedOutlined";
import type { AmenityDto, RoomTypeDto, RoomTypeRequest } from "../../types/backend.types";
import { formatVnd } from "../../utils/formatters";
import { TextField } from "../onboarding/FormField";
import { TextAreaField, ToggleField } from "../shared/FormControls";
import Overlay from "../shared/Overlay";

interface RoomTypeValues {
  name: string;
  areaM2: string;
  maxAdults: string;
  maxChildren: string;
  bedType: string;
  basePrice: string;
  totalRooms: string;
  description: string;
  amenityIds: number[];
  imageUrls: string;
  active: boolean;
}

const intIn = (min: number, max: number, message: string) => Yup.string().test("int", message, (value) => !!value && /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max);

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const splitUrls = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

const schema = Yup.object({
  name: Yup.string().trim().required("Vui lòng nhập tên hạng phòng").max(150, "Tối đa 150 ký tự"),
  areaM2: Yup.string().test("area", "Diện tích từ 1 đến 2.000 m²", (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 2000)),
  maxAdults: intIn(1, 20, "Số người lớn tối đa từ 1 đến 20"),
  maxChildren: intIn(0, 20, "Số trẻ em tối đa từ 0 đến 20"),
  bedType: Yup.string().max(100, "Tối đa 100 ký tự"),
  basePrice: intIn(50_000, 1_000_000_000, "Giá cơ bản từ 50.000 ₫ đến 1 tỷ ₫ (chỉ nhập số)"),
  totalRooms: intIn(0, 1000, "Tổng số phòng từ 0 đến 1.000"),
  description: Yup.string().max(5000, "Tối đa 5.000 ký tự"),
  imageUrls: Yup.string()
    .test("urls", "Mỗi dòng phải là một đường dẫn ảnh hợp lệ (https://...)", (value) => splitUrls(value ?? "").every(isHttpUrl))
    .test("max", "Tối đa 10 ảnh cho mỗi hạng phòng", (value) => splitUrls(value ?? "").length <= 10),
});

const toValues = (roomType: RoomTypeDto | null): RoomTypeValues => ({
  name: roomType?.name ?? "",
  areaM2: roomType?.areaM2?.toString() ?? "",
  maxAdults: roomType?.maxAdults.toString() ?? "2",
  maxChildren: roomType?.maxChildren.toString() ?? "0",
  bedType: roomType?.bedType ?? "",
  basePrice: roomType ? String(Math.round(roomType.basePrice)) : "",
  totalRooms: roomType?.totalRooms.toString() ?? "",
  description: roomType?.description ?? "",
  amenityIds: roomType?.amenityIds ?? [],
  imageUrls: roomType ? [...roomType.images].sort((a, b) => a.sortOrder - b.sortOrder).map((image) => image.url).join("\n") : "",
  active: roomType?.active ?? true,
});

const toRequest = (values: RoomTypeValues): RoomTypeRequest => ({
  name: values.name.trim(),
  areaM2: values.areaM2 === "" ? null : Number(values.areaM2),
  maxAdults: Number(values.maxAdults),
  maxChildren: Number(values.maxChildren),
  bedType: values.bedType.trim() || null,
  basePrice: Number(values.basePrice),
  totalRooms: Number(values.totalRooms),
  description: values.description.trim() || null,
  amenityIds: values.amenityIds,
  imageUrls: splitUrls(values.imageUrls),
  active: values.active,
});

const AmenityPicker = ({ amenities }: { amenities: AmenityDto[] }) => {
  const [field, , helpers] = useField<number[]>("amenityIds");
  const toggle = (id: number) => helpers.setValue(field.value.includes(id) ? field.value.filter((item) => item !== id) : [...field.value, id]);
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-semibold text-slate-700">Tiện nghi trong phòng</legend>
      <div className="flex flex-wrap gap-2">
        {amenities.map((item) => {
          const checked = field.value.includes(item.id);
          return (
            <label key={item.id} className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${checked ? "border-[#1677FF] bg-blue-50/60 font-semibold" : "border-slate-200 text-slate-600"}`}>
              <input type="checkbox" checked={checked} onChange={() => { void toggle(item.id); }} className="h-4 w-4 accent-[#1677FF]" />
              {item.name}
            </label>
          );
        })}
        {amenities.length === 0 && <p className="text-sm text-slate-500">Chưa có tiện nghi phòng trong danh mục.</p>}
      </div>
    </fieldset>
  );
};

const PricePreview = () => {
  const [field] = useField<string>("basePrice");
  return /^\d+$/.test(field.value) ? <span className="font-semibold text-slate-700">{formatVnd(Number(field.value))} / đêm</span> : null;
};

interface RoomTypeFormModalProps {
  open: boolean;
  roomType: RoomTypeDto | null;
  amenities: AmenityDto[];
  onClose: () => void;
  onSubmit: (request: RoomTypeRequest) => Promise<void>;
}

const FORM_ID = "room-type-form";

export const RoomTypeFormModal = ({ open, roomType, amenities, onClose, onSubmit }: RoomTypeFormModalProps) => (
  <Formik<RoomTypeValues>
    key={roomType?.id ?? "new"}
    initialValues={toValues(roomType)}
    validationSchema={schema}
    enableReinitialize
    onSubmit={async (values) => { await onSubmit(toRequest(values)); }}
  >
    {({ isSubmitting }) => (
      <Overlay
        open={open}
        onClose={onClose}
        title={roomType ? "Chỉnh sửa hạng phòng" : "Thêm hạng phòng mới"}
        subtitle="Thông tin hiển thị cho khách và dùng để tính giá, tồn kho."
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Hủy</button>
            <button type="submit" form={FORM_ID} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-[#004CCD] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#003db3] disabled:opacity-60">
              {isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {roomType ? "Lưu thay đổi" : "Tạo hạng phòng"}
            </button>
          </div>
        }
      >
        <Form id={FORM_ID} noValidate className="space-y-5">
          <TextField idPrefix="room-type" name="name" label="Tên hạng phòng" icon={BedOutlined} required placeholder="VD: Deluxe Hướng Biển" />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField idPrefix="room-type" name="basePrice" label="Giá cơ bản mỗi đêm (VND)" required inputMode="numeric" placeholder="1450000" hint={<PricePreview />} />
            <TextField idPrefix="room-type" name="totalRooms" label="Tổng số phòng mở bán" required inputMode="numeric" hint="Số phòng tối đa có thể bán mỗi đêm." />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField idPrefix="room-type" name="maxAdults" label="Người lớn tối đa" required inputMode="numeric" />
            <TextField idPrefix="room-type" name="maxChildren" label="Trẻ em tối đa" required inputMode="numeric" />
            <TextField idPrefix="room-type" name="areaM2" label="Diện tích (m²)" inputMode="numeric" />
          </div>
          <TextField idPrefix="room-type" name="bedType" label="Loại giường" placeholder="VD: 1 Giường King hoặc 2 Giường đơn" />
          <AmenityPicker amenities={amenities} />
          <TextAreaField idPrefix="room-type" name="description" label="Mô tả hạng phòng" rows={3} />
          <TextAreaField idPrefix="room-type" name="imageUrls" label="Ảnh hạng phòng (mỗi dòng một đường dẫn)" rows={3} placeholder="https://..." hint="Tải ảnh trực tiếp từ máy sẽ có khi backend hỗ trợ upload." />
          <ToggleField name="active" label="Đang mở bán" description="Tắt để tạm ngừng bán hạng phòng này trên MeGo." />
        </Form>
      </Overlay>
    )}
  </Formik>
);

export default RoomTypeFormModal;
