import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "../../../components/common/Icons";
import {
  HotelFilters,
  HotelFiltersDrawer,
  HotelSortBar,
  HotelList,
  HotelPagination,
} from "../components/listhotel";
import { HotelsService } from "../../../services/hotels.service";
import type {
  HotelFilterState,
  HotelSearchParams,
  PropertyType,
  SortCriteria,
} from "../../../types/hotel";

export const HotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Danh sách khách sạn & khu nghỉ dưỡng | MeGo";
  }, []);

  // 1. Extract Search Parameters from URL
  const destination = searchParams.get("destination") || searchParams.get("keyword") || "";
  const keyword = searchParams.get("keyword") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests")
    ? parseInt(searchParams.get("guests")!, 10)
    : 2;
  const rooms = searchParams.get("rooms")
    ? parseInt(searchParams.get("rooms")!, 10)
    : 1;
  const sort = (searchParams.get("sort") as SortCriteria) || "recommended";
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;
  const viewMode = (searchParams.get("view") as "list" | "map") || "list";

  // 2. Extract Filters from URL
  const filters: HotelFilterState = useMemo(() => {
    const starsParam = searchParams.get("stars");
    const stars = starsParam
      ? starsParam
          .split(",")
          .map((s) => parseInt(s, 10))
          .filter(Boolean)
      : [];

    const typesParam = searchParams.get("types");
    const propertyTypes = typesParam
      ? (typesParam.split(",") as PropertyType[])
      : [];

    const amenitiesParam = searchParams.get("amenities");
    const amenities = amenitiesParam ? amenitiesParam.split(",") : [];

    const policiesParam = searchParams.get("policies");
    const policies = policiesParam ? policiesParam.split(",") : [];

    const priceRange = searchParams.get("priceRange") || undefined;
    const ratingThreshold = searchParams.get("rating")
      ? parseFloat(searchParams.get("rating")!)
      : undefined;

    return {
      priceRange,
      stars,
      ratingThreshold,
      amenities,
      propertyTypes,
      policies,
    };
  }, [searchParams]);

  // 3. Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange) count += 1;
    count += filters.stars.length;
    if (filters.ratingThreshold) count += 1;
    count += filters.propertyTypes.length;
    count += filters.amenities.length;
    count += filters.policies.length;
    return count;
  }, [filters]);

  // 4. Query Hotels via HotelsService
  const searchParamsObject: HotelSearchParams = useMemo(
    () => ({
      destination,
      keyword,
      checkIn,
      checkOut,
      guests,
      rooms,
      sort,
      page,
      limit: 4,
      view: viewMode,
    }),
    [destination, keyword, checkIn, checkOut, guests, rooms, sort, page, viewMode]
  );

  const searchResult = useMemo(
    () => HotelsService.getHotels(searchParamsObject, filters),
    [searchParamsObject, filters]
  );

  // Helper
  const updateUrlParams = (updater: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next, { replace: true });
  };

  const handleFiltersChange = (next: HotelFilterState) => {
    setIsLoading(true);
    updateUrlParams((p) => {
      p.set("page", "1");
      if (next.priceRange) {
        p.set("priceRange", next.priceRange);
      } else {
        p.delete("priceRange");
      }

      if (next.stars.length > 0) {
        p.set("stars", next.stars.join(","));
      } else {
        p.delete("stars");
      }

      if (next.ratingThreshold) {
        p.set("rating", next.ratingThreshold.toString());
      } else {
        p.delete("rating");
      }

      if (next.propertyTypes.length > 0) {
        p.set("types", next.propertyTypes.join(","));
      } else {
        p.delete("types");
      }

      if (next.amenities.length > 0) {
        p.set("amenities", next.amenities.join(","));
      } else {
        p.delete("amenities");
      }

      if (next.policies.length > 0) {
        p.set("policies", next.policies.join(","));
      } else {
        p.delete("policies");
      }
    });
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    updateUrlParams((p) => {
      [
        "priceRange",
        "minPrice",
        "maxPrice",
        "stars",
        "rating",
        "types",
        "amenities",
        "policies",
      ].forEach((k) => p.delete(k));
      p.set("page", "1");
    });
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleSortChange = (s: SortCriteria) =>
    updateUrlParams((p) => {
      p.set("sort", s);
      p.set("page", "1");
    });

  const handleViewModeChange = (mode: "list" | "map") =>
    updateUrlParams((p) =>
      mode === "map" ? p.set("view", "map") : p.delete("view")
    );

  const handlePageChange = (newPage: number) => {
    updateUrlParams((p) => p.set("page", newPage.toString()));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans pb-16 transition-colors duration-200"
      style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}
    >
      {/* ── Main Two-Column Container (Max 1440px, centered, matching sample image) ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* ── 1. LEFT SIDEBAR: Filters (~270px) ─────────────────────────── */}
          <aside className="hidden lg:block w-[270px] shrink-0 sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
              <HotelFilters
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleResetFilters}
                totalActiveCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* ── 2. RIGHT CONTENT: Sort Toolbar + Active Tags + Hotel Cards + Pagination ── */}
          <section className="flex-1 min-w-0 w-full space-y-3.5">
            {/* Top Toolbar matching sample: Title, Subtitle, Sort, View Toggle */}
            <HotelSortBar
              total={searchResult.total}
              destination={destination}
              currentSort={sort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {/* Active Filters Summary Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold mr-1">
                  Đang lọc theo:
                </span>

                {filters.priceRange && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                    Giá: {filters.priceRange}
                    <button
                      type="button"
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          priceRange: undefined,
                        })
                      }
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.stars.map((star) => (
                  <span
                    key={star}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {star} sao
                    <button
                      type="button"
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          stars: filters.stars.filter((s) => s !== star),
                        })
                      }
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filters.propertyTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    Loại: {type}
                    <button
                      type="button"
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          propertyTypes: filters.propertyTypes.filter(
                            (t) => t !== type
                          ),
                        })
                      }
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filters.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() =>
                        handleFiltersChange({
                          ...filters,
                          amenities: filters.amenities.filter(
                            (a) => a !== amenity
                          ),
                        })
                      }
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold underline ml-auto pl-2"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* List / Map of Hotels */}
            <HotelList
              hotels={searchResult.items}
              isLoading={isLoading}
              onResetFilters={handleResetFilters}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {viewMode === "list" && searchResult.totalPages > 1 && (
              <HotelPagination
                currentPage={searchResult.page}
                totalPages={searchResult.totalPages}
                totalItems={searchResult.total}
                limit={searchResult.limit}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </main>

      {/* Mobile/Tablet Filter Drawer */}
      <HotelFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        totalCount={searchResult.total}
      />
    </div>
  );
};

export default HotelsPage;
