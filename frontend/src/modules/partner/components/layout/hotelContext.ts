import { createContext, useContext } from "react";
import type { HotelSummaryDto } from "../../types/backend.types";

export interface PartnerHotelContextValue {
  hotels: HotelSummaryDto[];
  selectedHotel: HotelSummaryDto | null;
  loading: boolean;
  error: string | null;
  selectHotel: (hotelId: number) => void;
  reload: () => void;
}

export const PartnerHotelContext = createContext<PartnerHotelContextValue | null>(null);

/** Khách sạn đang được chọn ở ô chọn khách sạn trên topbar (dùng trong PartnerLayout). */
export const usePartnerHotel = (): PartnerHotelContextValue => {
  const value = useContext(PartnerHotelContext);
  if (!value) throw new Error("usePartnerHotel phải dùng bên trong PartnerHotelProvider");
  return value;
};
