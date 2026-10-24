import type { BookingDraftPayload } from "./customerApi";

export const bookingSessionKey = "mego-booking-checkout";

export interface BookingCheckoutSession extends BookingDraftPayload {
  promotionDiscount: number;
  pointsDiscount: number;
  total: number;
  paymentMethodId: string;
}

export const readBookingCheckoutSession = (): BookingCheckoutSession | null => {
  const storedSession = window.sessionStorage.getItem(bookingSessionKey);
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession) as BookingCheckoutSession;
  } catch {
    return null;
  }
};

export const saveBookingCheckoutSession = (session: BookingCheckoutSession) => {
  window.sessionStorage.setItem(bookingSessionKey, JSON.stringify(session));
};
