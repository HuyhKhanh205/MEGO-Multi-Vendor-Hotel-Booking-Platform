import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAppSelector } from "../../../../stores/store";
import partnerHotelApi from "../../services/partnerHotelApi";
import type { HotelSummaryDto } from "../../types/backend.types";
import { PartnerHotelContext, type PartnerHotelContextValue } from "./hotelContext";

const storageKey = (email: string) => `mego_partner_selected_hotel:${email}`;

const readSavedHotelId = (email: string): number | null => {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
};

interface LoadState {
  requestId: number;
  hotels: HotelSummaryDto[];
  error: string | null;
}

export const PartnerHotelProvider = ({ children }: { children: ReactNode }) => {
  const email = useAppSelector((state) => state.auth.user?.email ?? "");
  const [requestId, setRequestId] = useState(1);
  const [state, setState] = useState<LoadState>({ requestId: 0, hotels: [], error: null });
  const [chosenId, setChosenId] = useState<number | null>(() => readSavedHotelId(email));

  useEffect(() => {
    let cancelled = false;
    partnerHotelApi
      .listMyHotels()
      .then((hotels) => { if (!cancelled) setState({ requestId, hotels, error: null }); })
      .catch((error: unknown) => {
        if (!cancelled) setState({ requestId, hotels: [], error: error instanceof Error ? error.message : "Không tải được danh sách khách sạn." });
      });
    return () => { cancelled = true; };
  }, [requestId, email]);

  const selectHotel = useCallback((hotelId: number) => {
    setChosenId(hotelId);
    try {
      localStorage.setItem(storageKey(email), String(hotelId));
    } catch {
      // Storage không khả dụng: chỉ nhớ trong phiên
    }
  }, [email]);

  const value = useMemo<PartnerHotelContextValue>(() => {
    const selectedHotel = state.hotels.find((hotel) => hotel.id === chosenId) ?? state.hotels[0] ?? null;
    return {
      hotels: state.hotels,
      selectedHotel,
      loading: state.requestId !== requestId,
      error: state.error,
      selectHotel,
      reload: () => setRequestId((id) => id + 1),
    };
  }, [state, chosenId, requestId, selectHotel]);

  return <PartnerHotelContext.Provider value={value}>{children}</PartnerHotelContext.Provider>;
};

export default PartnerHotelProvider;
