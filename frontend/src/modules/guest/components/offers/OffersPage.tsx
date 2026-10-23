import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_HOTELS } from "../../../../data/hotels";
import { PLATFORM_VOUCHERS } from "./offersData";
import type { OfferCategoryId, OfferSortOption } from "./types";
import TopNotificationBar from "./TopNotificationBar";
import OffersHero from "./OffersHero";
import OfferCategoryTabs from "./OfferCategoryTabs";
import VoucherWalletSection from "./VoucherWalletSection";
import MeGoClubLoyaltySection from "./MeGoClubLoyaltySection";
import DestinationDealsSection from "./DestinationDealsSection";
import PartnerBanksSection from "./PartnerBanksSection";
import TrustAssuranceSection from "./TrustAssuranceSection";
import DiscountedHotelsSection from "./DiscountedHotelsSection";
import OfferSkeleton from "./OfferSkeleton";
import OfferEmptyState from "./OfferEmptyState";

export const OffersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const vouchersRef = useRef<HTMLDivElement>(null);
  const clubRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);

  // Set document title
  useEffect(() => {
    document.title = "Ưu đãi Mùa Hè Rực Rỡ | MeGo Deals";
  }, []);

  // 1. Extract Filter State from URL Query Params
  const activeCategory = (searchParams.get("category") as OfferCategoryId) || "all";
  const activeDestination = searchParams.get("destination") || "Đà Nẵng";
  const activeDealType = searchParams.get("type") || "all";
  const activeSort = (searchParams.get("sort") as OfferSortOption) || "recommended";

  // Handler to update URL params
  const updateParams = (updates: Partial<{
    category: string;
    destination: string;
    type: string;
    sort: string;
  }>) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "recommended") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams, { replace: true });
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  const handleSelectTab = (tabId: OfferCategoryId) => {
    updateParams({ category: tabId });

    // Smooth scroll to relevant section if specialized tab selected
    if (tabId === "club" && clubRef.current) {
      clubRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tabId === "partners" && partnersRef.current) {
      partnersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (vouchersRef.current) {
      vouchersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hotelsRef.current) {
      hotelsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDestinationChange = (dest: string) => {
    updateParams({ destination: dest });
  };

  const handleDealTypeChange = (type: string) => {
    updateParams({ type });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // 2. Filter Platform Vouchers
  const filteredVouchers = useMemo(() => {
    if (activeCategory === "all") return PLATFORM_VOUCHERS;
    if (activeCategory === "club") {
      return PLATFORM_VOUCHERS.filter((v) => v.category === "club" || v.code === "WELCOMEVIP");
    }
    if (activeCategory === "partners") {
      return PLATFORM_VOUCHERS.filter((v) => v.category === "partners" || v.code === "VNPAY100");
    }
    return PLATFORM_VOUCHERS;
  }, [activeCategory]);

  // 3. Filter Discounted Hotels
  const filteredHotels = useMemo(() => {
    let result = [...MOCK_HOTELS];

    // Only hotels with discounts or promotion badges
    result = result.filter((h) => (h.discountPercent && h.discountPercent > 0) || h.badge);

    // Filter by destination if provided
    if (activeDestination.trim()) {
      const q = activeDestination.toLowerCase().trim();
      const matched = result.filter(
        (h) =>
          h.city.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q)
      );
      if (matched.length > 0) {
        result = matched;
      }
    }

    // Filter by deal type
    if (activeDealType === "beach") {
      result = result.filter((h) => h.distanceToBeach || h.propertyType === "resort");
    } else if (activeDealType === "luxury") {
      result = result.filter((h) => h.stars >= 5);
    } else if (activeDealType === "early") {
      result = result.filter((h) => (h.discountPercent || 0) >= 20);
    }

    // Sort
    result.sort((a, b) => {
      switch (activeSort) {
        case "discount-desc":
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        case "price-asc":
          return a.pricePerNight - b.pricePerNight;
        case "price-desc":
          return b.pricePerNight - a.pricePerNight;
        case "recommended":
        default: {
          const scoreA = (a.isPopular ? 1 : 0) * 10 + a.rating;
          const scoreB = (b.isPopular ? 1 : 0) * 10 + b.rating;
          return scoreB - scoreA;
        }
      }
    });

    return result;
  }, [activeDestination, activeDealType, activeSort]);

  return (
    <div className="w-full min-h-screen bg-background font-sans text-on-surface antialiased overflow-x-clip">
      {/* 1. Top Notification Bar */}
      <TopNotificationBar />

      {/* 2. Hero Campaign Section with Flash Sale Countdown */}
      <OffersHero
        destination={activeDestination}
        onDestinationChange={handleDestinationChange}
        dealType={activeDealType}
        onDealTypeChange={handleDealTypeChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 3. Sticky Filter Category Tabs */}
      <OfferCategoryTabs
        activeTab={activeCategory}
        onSelectTab={handleSelectTab}
      />

      {/* Main Container */}
      <div className="w-full space-y-4">
        {/* Loading state indicator */}
        {isLoading && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
            <OfferSkeleton />
          </div>
        )}

        {/* 4. Voucher Collection & Wallet (Platform Coupons) */}
        <div ref={vouchersRef}>
          <VoucherWalletSection vouchers={filteredVouchers} />
        </div>

        {/* 5. MeGo Club Loyalty & Points Redemption Section */}
        <div ref={clubRef}>
          <MeGoClubLoyaltySection />
        </div>

        {/* 6. Destination Deals (Top Destinations) */}
        <DestinationDealsSection />

        {/* 7. Discounted Hotels Section */}
        <div ref={hotelsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
          {filteredHotels.length === 0 && !isLoading ? (
            <OfferEmptyState onResetFilters={handleResetFilters} />
          ) : (
            <DiscountedHotelsSection hotels={filteredHotels} />
          )}
        </div>

        {/* 8. Partner Banks & E-wallets Promotions */}
        <div ref={partnersRef}>
          <PartnerBanksSection />
        </div>

        {/* 9. Trust & Value Assurance Section */}
        <TrustAssuranceSection />
      </div>
    </div>
  );
};

export default OffersPage;
