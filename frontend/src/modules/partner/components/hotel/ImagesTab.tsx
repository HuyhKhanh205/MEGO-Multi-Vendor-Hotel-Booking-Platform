import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import ArrowBackIosNewRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import StarRounded from "@mui/icons-material/StarRounded";
import partnerHotelApi from "../../services/partnerHotelApi";
import type { HotelDto, HotelImageRequest } from "../../types/backend.types";
import { inputClassName } from "../onboarding/formStyles";
import SaveBar from "../shared/SaveBar";

const MAX_IMAGES = 20;

const toRequests = (hotel: HotelDto): HotelImageRequest[] =>
  [...hotel.images].sort((a, b) => a.sortOrder - b.sortOrder).map(({ url, caption, primary, sortOrder }) => ({ url, caption, primary, sortOrder }));

const normalize = (images: HotelImageRequest[]): HotelImageRequest[] => {
  const hasPrimary = images.some((image) => image.primary);
  return images.map((image, index) => ({ ...image, sortOrder: index, primary: hasPrimary ? image.primary : index === 0 }));
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

interface ImagesTabProps {
  hotel: HotelDto;
  onSaved: (hotel: HotelDto) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export const ImagesTab = ({ hotel, onSaved, onDirtyChange }: ImagesTabProps) => {
  const [images, setImages] = useState<HotelImageRequest[]>(() => toRequests(hotel));
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(images) !== JSON.stringify(toRequests(hotel));

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  const addImage = () => {
    const url = newUrl.trim();
    if (!isHttpUrl(url)) return setUrlError("Nhập đường dẫn ảnh hợp lệ, bắt đầu bằng https://");
    if (images.some((image) => image.url === url)) return setUrlError("Ảnh này đã có trong thư viện.");
    if (images.length >= MAX_IMAGES) return setUrlError(`Tối đa ${MAX_IMAGES} ảnh cho mỗi khách sạn.`);
    setImages((current) => normalize([...current, { url, caption: null, primary: false, sortOrder: current.length }]));
    setNewUrl("");
    setUrlError(null);
  };

  const move = (index: number, offset: number) => setImages((current) => {
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    return normalize(next);
  });

  const setPrimary = (index: number) => setImages((current) => current.map((image, i) => ({ ...image, primary: i === index })));
  const remove = (index: number) => setImages((current) => normalize(current.filter((_, i) => i !== index)));
  const setCaption = (index: number, caption: string) => setImages((current) => current.map((image, i) => (i === index ? { ...image, caption: caption || null } : image)));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (images.length === 0) {
      toast.error("Cần ít nhất 1 ảnh để khách sạn hiển thị trên MeGo.");
      return;
    }
    setSaving(true);
    try {
      const saved = await partnerHotelApi.updateImages(hotel.id, normalize(images));
      onSaved(saved);
      setImages(toRequests(saved));
      toast.success("Đã lưu thư viện ảnh.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không lưu được hình ảnh.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-slate-200 p-4">
        <label htmlFor="hotel-image-url" className="block text-sm font-semibold text-slate-700">Thêm ảnh bằng đường dẫn</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="hotel-image-url"
            value={newUrl}
            onChange={(event) => { setNewUrl(event.target.value); setUrlError(null); }}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addImage(); } }}
            placeholder="https://..."
            className={inputClassName(!!urlError, false)}
          />
          <button type="button" onClick={addImage} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#1677FF] hover:bg-blue-100">
            <AddPhotoAlternateOutlined sx={{ fontSize: 18 }} /> Thêm ảnh
          </button>
        </div>
        {urlError ? (
          <p className="mt-1.5 text-xs font-semibold text-red-500">{urlError}</p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">Tải ảnh trực tiếp từ máy sẽ có khi backend hỗ trợ upload. Ảnh đầu tiên được chọn làm ảnh đại diện nếu chưa chọn.</p>
        )}
      </div>

      {images.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Chưa có ảnh nào. Thêm ít nhất 1 ảnh để khách sạn hiển thị trên MeGo.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.url} className={`overflow-hidden rounded-2xl border bg-white ${image.primary ? "border-[#1677FF] ring-2 ring-blue-100" : "border-slate-200"}`}>
              <div className="relative aspect-[4/3] bg-slate-100">
                <img src={image.url} alt={image.caption ?? `Ảnh ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                {image.primary && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#1677FF] px-2 py-0.5 text-[11px] font-bold text-white">
                    <StarRounded sx={{ fontSize: 13 }} /> Ảnh đại diện
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <input
                  value={image.caption ?? ""}
                  onChange={(event) => setCaption(index, event.target.value)}
                  placeholder="Chú thích ảnh (không bắt buộc)"
                  aria-label={`Chú thích ảnh ${index + 1}`}
                  className={inputClassName(false, false)}
                />
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Đưa ảnh lên trước">
                      <ArrowBackIosNewRounded sx={{ fontSize: 14 }} />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Đưa ảnh ra sau">
                      <ArrowForwardIosRounded sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {!image.primary && (
                      <button type="button" onClick={() => setPrimary(index)} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#1677FF] hover:bg-blue-50">
                        Đặt làm đại diện
                      </button>
                    )}
                    <button type="button" onClick={() => remove(index)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500" aria-label={`Xóa ảnh ${index + 1}`}>
                      <DeleteOutlineOutlined sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SaveBar dirty={dirty} saving={saving} onReset={() => setImages(toRequests(hotel))} />
    </form>
  );
};

export default ImagesTab;
