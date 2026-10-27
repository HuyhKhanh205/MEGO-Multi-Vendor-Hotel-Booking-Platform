import { Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import HotelOutlined from "@mui/icons-material/HotelOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import partnerHotelApi from "../../services/partnerHotelApi";
import type { DestinationDto, HotelDto } from "../../types/backend.types";
import { TextField } from "../onboarding/FormField";
import { SelectField, TextAreaField } from "../shared/FormControls";
import SaveBar from "../shared/SaveBar";
import DirtyReporter from "./DirtyReporter";

interface GeneralValues {
  name: string;
  starRating: string;
  destinationId: string;
  address: string;
  latitude: string;
  longitude: string;
  distanceToCenterKm: string;
  checkInTime: string;
  checkOutTime: string;
  description: string;
}

const optionalNumber = (min: number, max: number, message: string) =>
  Yup.string().test("range", message, (value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= min && Number(value) <= max));

const schema = Yup.object({
  name: Yup.string().trim().required("Vui lòng nhập tên khách sạn").max(200, "Tối đa 200 ký tự"),
  starRating: Yup.string().required("Vui lòng chọn hạng sao"),
  destinationId: Yup.string().required("Vui lòng chọn điểm đến"),
  address: Yup.string().trim().required("Vui lòng nhập địa chỉ").max(500, "Tối đa 500 ký tự"),
  latitude: optionalNumber(-90, 90, "Vĩ độ nằm trong khoảng -90 đến 90"),
  longitude: optionalNumber(-180, 180, "Kinh độ nằm trong khoảng -180 đến 180"),
  distanceToCenterKm: optionalNumber(0, 1000, "Khoảng cách không hợp lệ"),
  checkInTime: Yup.string().required("Vui lòng nhập giờ nhận phòng"),
  checkOutTime: Yup.string().required("Vui lòng nhập giờ trả phòng"),
  description: Yup.string().max(5000, "Tối đa 5.000 ký tự"),
});

const toValues = (hotel: HotelDto): GeneralValues => ({
  name: hotel.name,
  starRating: String(hotel.starRating),
  destinationId: String(hotel.destinationId),
  address: hotel.address ?? "",
  latitude: hotel.latitude?.toString() ?? "",
  longitude: hotel.longitude?.toString() ?? "",
  distanceToCenterKm: hotel.distanceToCenterKm?.toString() ?? "",
  checkInTime: hotel.checkInTime?.slice(0, 5) ?? "",
  checkOutTime: hotel.checkOutTime?.slice(0, 5) ?? "",
  description: hotel.description ?? "",
});

const numberOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

interface GeneralInfoTabProps {
  hotel: HotelDto;
  destinations: DestinationDto[];
  onSaved: (hotel: HotelDto) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export const GeneralInfoTab = ({ hotel, destinations, onSaved, onDirtyChange }: GeneralInfoTabProps) => {
  const handleSubmit = async (values: GeneralValues, helpers: FormikHelpers<GeneralValues>) => {
    try {
      const saved = await partnerHotelApi.updateHotel(hotel.id, {
        name: values.name.trim(),
        starRating: Number(values.starRating),
        destinationId: Number(values.destinationId),
        address: values.address.trim(),
        latitude: numberOrNull(values.latitude),
        longitude: numberOrNull(values.longitude),
        distanceToCenterKm: numberOrNull(values.distanceToCenterKm),
        checkInTime: values.checkInTime,
        checkOutTime: values.checkOutTime,
        description: values.description.trim() || null,
      });
      helpers.resetForm({ values: toValues(saved) });
      onSaved(saved);
      toast.success("Đã lưu thông tin chung của khách sạn.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được thông tin khách sạn.");
    }
  };

  return (
    <Formik<GeneralValues> initialValues={toValues(hotel)} validationSchema={schema} onSubmit={handleSubmit}>
      {({ dirty, isSubmitting, resetForm }) => (
        <Form noValidate className="space-y-5">
          <DirtyReporter onChange={onDirtyChange} />
          <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
            <TextField idPrefix="hotel" name="name" label="Tên khách sạn (hiển thị cho khách)" icon={HotelOutlined} required />
            <SelectField
              idPrefix="hotel"
              name="starRating"
              label="Hạng sao"
              required
              options={[5, 4, 3, 2, 1].map((star) => ({ value: String(star), label: `${star} sao` }))}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              idPrefix="hotel"
              name="destinationId"
              label="Điểm đến"
              required
              placeholder="Chọn điểm đến"
              options={destinations.map((item) => ({ value: String(item.id), label: `${item.name}${item.province && item.province !== item.name ? ` (${item.province})` : ""}` }))}
            />
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">Đường dẫn (slug)</p>
              <p className="truncate rounded-xl border border-dashed border-slate-200 px-3 py-2.5 font-mono text-sm text-slate-500" title={hotel.slug}>/hotels/{hotel.slug}</p>
              <p className="text-xs text-slate-500">Do MeGo tạo khi duyệt khách sạn, không chỉnh sửa được.</p>
            </div>
          </div>
          <TextField idPrefix="hotel" name="address" label="Địa chỉ chi tiết" icon={PlaceOutlined} required />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField idPrefix="hotel" name="latitude" label="Vĩ độ (latitude)" inputMode="numeric" placeholder="16.0626" />
            <TextField idPrefix="hotel" name="longitude" label="Kinh độ (longitude)" inputMode="numeric" placeholder="108.2453" />
            <TextField idPrefix="hotel" name="distanceToCenterKm" label="Cách trung tâm (km)" inputMode="numeric" placeholder="2.5" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField idPrefix="hotel" name="checkInTime" label="Giờ nhận phòng tiêu chuẩn" type="time" required />
            <TextField idPrefix="hotel" name="checkOutTime" label="Giờ trả phòng tiêu chuẩn" type="time" required />
          </div>
          <TextAreaField idPrefix="hotel" name="description" label="Giới thiệu khách sạn" rows={5} hint="Hiển thị ở trang chi tiết khách sạn trên MeGo." />
          <SaveBar dirty={dirty} saving={isSubmitting} onReset={() => resetForm()} />
        </Form>
      )}
    </Formik>
  );
};

export default GeneralInfoTab;
