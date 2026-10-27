import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";
import StarRounded from "@mui/icons-material/StarRounded";
import AmenitiesTab from "../components/hotel/AmenitiesTab";
import GeneralInfoTab from "../components/hotel/GeneralInfoTab";
import HotelApprovalBanner from "../components/hotel/HotelApprovalBanner";
import ImagesTab from "../components/hotel/ImagesTab";
import PolicyTab from "../components/hotel/PolicyTab";
import HotelRequired from "../components/layout/HotelRequired";
import { usePartnerHotel } from "../components/layout/hotelContext";
import LoadError from "../components/shared/LoadError";
import partnerHotelApi from "../services/partnerHotelApi";
import type { AmenityDto, DestinationDto, HotelDto, HotelPolicyDto, HotelSummaryDto } from "../types/backend.types";

type TabKey = "general" | "amenities" | "policy" | "images";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "general", label: "1. Thông tin chung & vị trí" },
  { key: "amenities", label: "2. Tiện ích" },
  { key: "policy", label: "3. Check-in/out & chính sách" },
  { key: "images", label: "4. Hình ảnh" },
];

interface HotelInfoData {
  hotel: HotelDto;
  policy: HotelPolicyDto;
  destinations: DestinationDto[];
  amenities: AmenityDto[];
}

interface LoadState {
  requestId: number;
  data: HotelInfoData | null;
  error: string | null;
}

const HotelInfoContent = ({ summary }: { summary: HotelSummaryDto }) => {
  const { reload: reloadHotels } = usePartnerHotel();
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ requestId: 0, data: null, error: null });
  const [tab, setTab] = useState<TabKey>("general");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      partnerHotelApi.getHotel(summary.id),
      partnerHotelApi.getPolicy(summary.id),
      partnerHotelApi.listDestinations(),
      partnerHotelApi.listAmenities("HOTEL"),
    ])
      .then(([hotel, policy, destinations, amenities]) => {
        if (!cancelled) setState({ requestId, data: { hotel, policy, destinations, amenities }, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ requestId, data: null, error: error instanceof Error ? error.message : "Không tải được thông tin khách sạn." });
      });
    return () => { cancelled = true; };
  }, [summary.id, requestId]);

  const changeTab = (next: TabKey) => {
    if (next === tab) return;
    if (dirty && !window.confirm("Bạn có thay đổi chưa lưu ở tab hiện tại. Rời tab và bỏ các thay đổi này?")) return;
    setDirty(false);
    setTab(next);
  };

  const handleDirtyChange = useCallback((value: boolean) => setDirty(value), []);

  const updateHotel = (hotel: HotelDto) => {
    setState((current) => (current.data ? { ...current, data: { ...current.data, hotel } } : current));
    if (hotel.name !== summary.name) reloadHotels();
  };
  const updatePolicy = (policy: HotelPolicyDto) =>
    setState((current) => (current.data ? { ...current, data: { ...current.data, policy } } : current));

  if (state.error) return <LoadError message={state.error} onRetry={() => setRequestId((id) => id + 1)} />;
  if (!state.data) return <div className="h-96 animate-pulse rounded-3xl bg-white" aria-busy="true" aria-label="Đang tải thông tin khách sạn" />;

  const { hotel, policy, destinations, amenities } = state.data;

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Thông tin khách sạn</h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{hotel.name}</span>
            <span className="inline-flex text-amber-400" aria-label={`${hotel.starRating} sao`}>
              {Array.from({ length: hotel.starRating }, (_, index) => <StarRounded key={index} sx={{ fontSize: 15 }} />)}
            </span>
            {hotel.avgRating !== null && <span>· {hotel.avgRating.toFixed(2)}/5 ({hotel.reviewCount} đánh giá)</span>}
          </p>
          <HotelApprovalBanner hotel={hotel} />
        </div>
        <Link
          to={`/hotels/${hotel.slug}`}
          target="_blank"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-white/10"
        >
          <OpenInNewOutlined sx={{ fontSize: 17 }} /> Xem trang khách sạn
        </Link>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white">
        {/* Tab thật: mỗi tab chỉ hiển thị nội dung của nó (Figma đặt 4 tab nhưng hiện cả trang dài) */}
        <div role="tablist" aria-label="Nhóm thông tin khách sạn" className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-3 sm:px-5">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => changeTab(item.key)}
              className={`whitespace-nowrap rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === item.key ? "border-[#1677FF] text-[#1677FF]" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-5 sm:p-6" role="tabpanel">
          {tab === "general" && <GeneralInfoTab hotel={hotel} destinations={destinations} onSaved={updateHotel} onDirtyChange={handleDirtyChange} />}
          {tab === "amenities" && <AmenitiesTab hotel={hotel} amenities={amenities} onSaved={updateHotel} onDirtyChange={handleDirtyChange} />}
          {tab === "policy" && <PolicyTab hotelId={hotel.id} policy={policy} onSaved={updatePolicy} onDirtyChange={handleDirtyChange} />}
          {tab === "images" && <ImagesTab hotel={hotel} onSaved={updateHotel} onDirtyChange={handleDirtyChange} />}
        </div>
      </section>
    </div>
  );
};

export const PartnerHotelInfoPage = () => {
  useEffect(() => {
    document.title = "Thông tin khách sạn | MeGo Partner";
  }, []);

  return <HotelRequired>{(hotel) => <HotelInfoContent key={hotel.id} summary={hotel} />}</HotelRequired>;
};

export default PartnerHotelInfoPage;
