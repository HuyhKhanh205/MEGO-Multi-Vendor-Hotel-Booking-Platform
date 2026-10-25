import { useField } from "formik";
import type { SvgIconComponent } from "@mui/icons-material";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import BeachAccessOutlined from "@mui/icons-material/BeachAccessOutlined";
import HotelOutlined from "@mui/icons-material/HotelOutlined";
import MeetingRoomOutlined from "@mui/icons-material/MeetingRoomOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import StarOutlineRounded from "@mui/icons-material/StarOutlineRounded";
import VillaOutlined from "@mui/icons-material/VillaOutlined";
import ColorLensOutlined from "@mui/icons-material/ColorLensOutlined";
import { HOTEL_CATEGORIES, STAR_RATINGS } from "../../data/onboardingMock";
import type { HotelCategory } from "../../types/partner.types";
import { FieldShell, TextField } from "./FormField";
import { inputClassName } from "./formStyles";

const CATEGORY_ICONS: Record<HotelCategory, SvgIconComponent> = {
  RESORT: BeachAccessOutlined,
  HOTEL_4_5_STAR: ApartmentOutlined,
  VILLA: VillaOutlined,
  BOUTIQUE: ColorLensOutlined,
};

const StarRatingSelect = () => {
  const [field, meta] = useField<string>("starRating");
  const error = meta.touched ? meta.error : undefined;
  return (
    <FieldShell id="onboarding-starRating" label="Phân hạng sao quốc gia / quốc tế" required error={error}>
      <div className="relative">
        <StarOutlineRounded sx={{ fontSize: 18 }} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <select {...field} id="onboarding-starRating" aria-invalid={!!error} className={inputClassName(!!error)}>
          <option value="">Chọn hạng sao</option>
          {STAR_RATINGS.map((rating) => <option key={rating.value} value={rating.value}>{rating.label}</option>)}
        </select>
      </div>
    </FieldShell>
  );
};

const CategoryPicker = () => {
  const [field, meta, helpers] = useField<string>("hotelCategory");
  const error = meta.touched ? meta.error : undefined;
  return (
    <fieldset className="space-y-1.5">
      <legend className="mb-1.5 text-sm font-semibold text-slate-700">Loại hình kiến trúc và dịch vụ nghỉ dưỡng <span className="text-red-500">*</span></legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {HOTEL_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.value];
          const selected = field.value === category.value;
          return (
            <label
              key={category.value}
              className={`flex cursor-pointer flex-col gap-1.5 rounded-2xl border p-3.5 transition-colors ${
                selected ? "border-[#1677FF] bg-blue-50/70 ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <span className="flex items-center justify-between">
                <Icon sx={{ fontSize: 22 }} className={selected ? "text-[#1677FF]" : "text-slate-500"} />
                <input
                  type="radio"
                  name="hotelCategory"
                  value={category.value}
                  checked={selected}
                  onChange={() => { void helpers.setValue(category.value); }}
                  onBlur={() => { void helpers.setTouched(true); }}
                  className="h-4 w-4 accent-[#1677FF]"
                />
              </span>
              <span className={`text-sm font-bold ${selected ? "text-[#004CCD] dark:text-blue-300" : "text-slate-800"}`}>{category.title}</span>
              <span className="text-xs leading-relaxed text-slate-500">{category.description}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
    </fieldset>
  );
};

export const StepProperty = () => (
  <div className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
      <TextField name="propertyName" label="Tên thương mại cơ sở lưu trú (Brand Name)" icon={HotelOutlined} required placeholder="VD: An Lâm Retreats Saigon River" hint="Tên này hiển thị trực tiếp cho khách trên kênh đặt phòng MeGo." />
      <StarRatingSelect />
    </div>
    <CategoryPicker />
    <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
      <TextField name="address" label="Địa chỉ chi tiết cơ sở lưu trú" icon={PlaceOutlined} required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" autoComplete="street-address" />
      <TextField name="totalRooms" label="Quy mô tổng số phòng" icon={MeetingRoomOutlined} required inputMode="numeric" placeholder="VD: 128" hint="Bao gồm cả phòng và villa đang kinh doanh." />
    </div>
  </div>
);

export default StepProperty;
