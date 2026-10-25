import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { VIETNAM_63_PROVINCES, type ProvinceItem } from "../../data/vietnamProvincesData";

interface ProvincesGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RegionFilter = "Tất cả" | "Miền Bắc" | "Miền Trung" | "Miền Nam";

export const ProvincesGalleryModal: React.FC<ProvincesGalleryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewProvince, setPreviewProvince] = useState<ProvinceItem | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewProvince) {
          setPreviewProvince(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, previewProvince, onClose]);

  // Navigate to hotels in the chosen province
  const handleGoToProvinceHotels = (province: ProvinceItem) => {
    onClose();
    if (previewProvince) setPreviewProvince(null);
    const searchParam = province.searchKey || province.name;
    navigate(`/hotels?destination=${encodeURIComponent(searchParam)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered provinces list
  const filteredProvinces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VIETNAM_63_PROVINCES.filter((item) => {
      const matchRegion =
        selectedRegion === "Tất cả" || item.region === selectedRegion;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.highlight.toLowerCase().includes(q) ||
        (item.searchKey && item.searchKey.toLowerCase().includes(q));
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, searchQuery]);

  // Region counters
  const counts = useMemo(() => {
    const north = VIETNAM_63_PROVINCES.filter((p) => p.region === "Miền Bắc").length;
    const central = VIETNAM_63_PROVINCES.filter((p) => p.region === "Miền Trung").length;
    const south = VIETNAM_63_PROVINCES.filter((p) => p.region === "Miền Nam").length;
    return { all: VIETNAM_63_PROVINCES.length, north, central, south };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-7 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Thư viện hình ảnh và khách sạn 63 tỉnh thành Việt Nam"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (previewProvince) setPreviewProvince(null);
          else onClose();
        }}
        aria-hidden="true"
      />

      {/* Main Modal Container */}
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border z-10 transition-colors"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-default)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b shrink-0"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Khám phá các địa điểm du lịch ở Việt Nam
              </h2>
            </div>
            <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Nhấn vào bất kỳ tỉnh thành nào để xem danh sách khách sạn &amp; khu nghỉ dưỡng tại địa phương đó.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng tỉnh thành"
            className="self-end sm:self-center p-2 rounded-full transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-[var(--bg-surface-hover)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          className="p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b shrink-0"
          style={{
            backgroundColor: "var(--bg-surface-secondary)",
            borderColor: "var(--border-light)",
          }}
        >
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {(
              [
                { label: `Tất cả (${counts.all})`, value: "Tất cả" },
                { label: `Miền Bắc (${counts.north})`, value: "Miền Bắc" },
                { label: `Miền Trung (${counts.central})`, value: "Miền Trung" },
                { label: `Miền Nam (${counts.south})`, value: "Miền Nam" },
              ] as const
            ).map((tab) => {
              const active = selectedRegion === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedRegion(tab.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? "bg-[#1677FF] text-white shadow-xs"
                      : "hover:bg-gray-200/60 dark:hover:bg-[var(--bg-muted)]"
                  }`}
                  style={!active ? { color: "var(--text-secondary)" } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm địa điểm..."
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-full border outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-input)",
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Provinces Cards Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredProvinces.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-2">🗺️</span>
              <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                Không tìm thấy tỉnh thành nào khớp với "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("Tất cả");
                }}
                className="mt-3 text-xs font-semibold text-[#1677FF] dark:text-[var(--brand-primary)] hover:underline cursor-pointer"
              >
                Hiển thị lại toàn bộ 63 tỉnh thành
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProvinces.map((province) => (
                <div
                  key={province.id}
                  onClick={() => handleGoToProvinceHotels(province)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                  title={`Nhấn để xem các khách sạn tại ${province.name}`}
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={province.imageUrl}
                      alt={`Cảnh đẹp ${province.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Region Tag */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/55 text-white backdrop-blur-xs border border-white/20">
                        {province.region}
                      </span>
                    </div>


                    {/* Quick View Button on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 pointer-events-none">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#1677FF] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                     Xem khách sạn
                      </span>
                    </div>

                    {/* Province Name in Image Bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-base font-extrabold text-white tracking-tight drop-shadow-sm flex items-center justify-between">
                        <span>{province.name}</span>
                        <span className="text-xs font-semibold text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </h3>
                    </div>
                  </div>

                  {/* Highlight text & Action link at card footer */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <p
                      className="text-xs line-clamp-2 leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {province.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer note */}
        <div
          className="p-3 sm:px-6 border-t flex items-center justify-between text-[11px] shrink-0"
          style={{
            backgroundColor: "var(--bg-surface-secondary)",
            borderColor: "var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
       
        </div>
      </div>

      {/* ── Lightbox: Full-screen Photo Preview ── */}
      {previewProvince && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewProvince(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900/90 text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-none">
                    {previewProvince.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    {previewProvince.region}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* CTA inside lightbox to see hotels */}
                <button
                  type="button"
                  onClick={() => handleGoToProvinceHotels(previewProvince)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🏨</span>
                  <span>Xem khách sạn tại {previewProvince.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewProvince(null)}
                  aria-label="Đóng ảnh"
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lightbox Large Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={previewProvince.imageUrl}
                alt={previewProvince.name}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Lightbox Footer Caption & Action */}
            <div className="p-4 bg-gray-900 text-white/90 text-xs sm:text-sm border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="font-medium">{previewProvince.highlight}</p>
              <button
                type="button"
                onClick={() => handleGoToProvinceHotels(previewProvince)}
                className="shrink-0 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Xem danh sách khách sạn tại đây</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvincesGalleryModal;
