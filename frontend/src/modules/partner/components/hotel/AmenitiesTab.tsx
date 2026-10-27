import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import partnerHotelApi from "../../services/partnerHotelApi";
import type { AmenityDto, HotelDto } from "../../types/backend.types";
import SaveBar from "../shared/SaveBar";

interface AmenitiesTabProps {
  hotel: HotelDto;
  amenities: AmenityDto[];
  onSaved: (hotel: HotelDto) => void;
  onDirtyChange: (dirty: boolean) => void;
}

const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((id) => b.includes(id));

export const AmenitiesTab = ({ hotel, amenities, onSaved, onDirtyChange }: AmenitiesTabProps) => {
  const [selected, setSelected] = useState<number[]>(hotel.amenityIds);
  const [saving, setSaving] = useState(false);
  const dirty = !sameSet(selected, hotel.amenityIds);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  const groups = useMemo(() => {
    const map = new Map<string, AmenityDto[]>();
    amenities.forEach((item) => {
      const key = item.category ?? "Khác";
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return [...map.entries()];
  }, [amenities]);

  const toggle = (id: number) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await partnerHotelApi.updateAmenities(hotel.id, selected);
      onSaved(saved);
      toast.success("Đã lưu danh sách tiện ích.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được tiện ích.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-slate-500">
        Đã chọn <strong className="text-slate-800">{selected.length}</strong>/{amenities.length} tiện ích. Danh mục tiện ích do MeGo quản lý; liên hệ chuyên viên nếu cần bổ sung tiện ích mới.
      </p>
      {groups.map(([category, items]) => (
        <fieldset key={category}>
          <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{category}</legend>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const checked = selected.includes(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-sm transition-colors ${
                    checked ? "border-[#1677FF] bg-blue-50/60 font-semibold text-slate-900" : "border-slate-200 text-slate-600 hover:border-blue-300"
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} className="h-4 w-4 accent-[#1677FF]" />
                  {item.name}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <SaveBar dirty={dirty} saving={saving} onReset={() => setSelected(hotel.amenityIds)} />
    </form>
  );
};

export default AmenitiesTab;
