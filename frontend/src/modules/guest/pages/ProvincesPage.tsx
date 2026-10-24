import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ALL_63_PROVINCES,
  REGIONS,
  REGION_META,
  type ProvinceItem,
  type Region,
} from "../../../data/provinces";

// ─── Province Card ─────────────────────────────────────────────────────────────
const ProvinceCard: React.FC<{ province: ProvinceItem }> = ({ province }) => {
  const hasImage = Boolean(province.imageUrl);

  return (
    <Link
      to={`/hotels?destination=${encodeURIComponent(province.name)}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-outline-variant/40 bg-surface-container-low hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Image or gradient placeholder */}
      {hasImage ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={province.imageUrl}
            alt={province.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {province.discountText && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-error text-on-error text-[11px] font-bold shadow">
              {province.discountText}
            </span>
          )}
          {province.highlight && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
              HOT
            </span>
          )}
        </div>
      ) : (
        <div className="h-16 bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary/50 text-[32px]">
            location_city
          </span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 p-3 flex flex-col gap-1">
        <h3 className="text-sm font-bold text-on-surface leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {province.name}
        </h3>
        {province.hotelCount !== undefined && (
          <p className="text-xs text-on-surface-variant">
            {province.hotelCount.toLocaleString("vi-VN")} khách sạn
          </p>
        )}
      </div>

      {/* CTA footer */}
      <div className="px-3 pb-3">
        <span className="text-xs font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          Xem khách sạn
          <span className="material-symbols-outlined text-[14px]">
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ProvincesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<Region | "Tất cả">(
    "Tất cả"
  );

  const filteredProvinces = useMemo(() => {
    return ALL_63_PROVINCES.filter((p) => {
      const matchesRegion =
        activeRegion === "Tất cả" || p.region === activeRegion;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [searchQuery, activeRegion]);

  const groupedByRegion = useMemo(() => {
    const regions =
      activeRegion === "Tất cả" ? ([...REGIONS] as Region[]) : [activeRegion];
    return regions.map((region) => ({
      region,
      provinces: filteredProvinces.filter((p) => p.region === region),
    }));
  }, [filteredProvinces, activeRegion]);

  const regionTabs: (Region | "Tất cả")[] = ["Tất cả", ...REGIONS];

  const totalFiltered = filteredProvinces.length;

  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-primary to-[#004CCD] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <Link to="/offers" className="hover:text-white transition-colors">
              Ưu đãi
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-white font-medium">63 Tỉnh thành</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold mb-4">
                <span className="material-symbols-outlined text-[16px]">
                  travel_explore
                </span>
                KHÁM PHÁ VIỆT NAM
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3">
                63 Tỉnh thành{" "}
                <span className="text-yellow-300">Việt Nam</span>
              </h1>
              <p className="text-white/80 text-sm sm:text-base max-w-xl">
                Từ Hà Nội đến Cà Mau — tìm kiếm và đặt phòng khách sạn tại bất
                kỳ tỉnh thành nào với ưu đãi tốt nhất từ MeGo.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              {[
                { label: "Tỉnh thành", value: "63" },
                { label: "Khách sạn", value: "5,000+" },
                { label: "Ưu đãi", value: "1,200+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-yellow-300">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-8 relative max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm tỉnh thành... (VD: Đà Nẵng, Hội An, Sa Pa)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-on-surface text-sm placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Region Tabs ───────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-outline-variant/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {regionTabs.map((tab) => {
              const isActive = activeRegion === tab;
              const meta = tab !== "Tất cả" ? REGION_META[tab] : null;
              const count =
                tab === "Tất cả"
                  ? filteredProvinces.length
                  : filteredProvinces.filter((p) => p.region === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveRegion(tab)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {meta && (
                    <span className={`material-symbols-outlined text-[16px] ${isActive ? "text-on-primary" : meta.color}`}>
                      {meta.icon}
                    </span>
                  )}
                  {tab}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-outline-variant/30 text-on-surface-variant"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        {/* Result count */}
        <p className="text-sm text-on-surface-variant mb-6">
          {searchQuery
            ? `Tìm thấy ${totalFiltered} tỉnh thành cho "${searchQuery}"`
            : `Hiển thị ${totalFiltered} tỉnh thành`}
        </p>

        {/* No results */}
        {totalFiltered === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30">
              search_off
            </span>
            <h3 className="text-lg font-bold text-on-surface">
              Không tìm thấy tỉnh thành
            </h3>
            <p className="text-sm text-on-surface-variant text-center max-w-xs">
              Thử tìm bằng tên khác hoặc chọn vùng miền khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveRegion("Tất cả");
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Xem tất cả tỉnh thành
            </button>
          </div>
        )}

        {/* Province groups */}
        {groupedByRegion.map(({ region, provinces }) => {
          if (provinces.length === 0) return null;
          const meta = REGION_META[region];

          return (
            <section key={region} className="mb-10 sm:mb-12">
              {/* Region header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-9 h-9 rounded-xl ${meta.bgColor} flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${meta.color}`}
                  >
                    {meta.icon}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-on-surface">
                    {region}
                  </h2>
                  <p className="text-xs text-on-surface-variant">
                    {provinces.length} tỉnh / thành phố
                  </p>
                </div>
                <div className="flex-1 h-px bg-outline-variant/40 ml-2" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {provinces.map((province) => (
                  <ProvinceCard key={province.id} province={province} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Back to offers */}
        <div className="flex justify-center pt-4 pb-8">
          <Link
            to="/offers"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface-variant text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Quay lại trang Ưu đãi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProvincesPage;
