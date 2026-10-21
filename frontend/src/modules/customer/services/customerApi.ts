import axios from "axios";

export interface BookingDraftPayload {
  bookingId: string;
  guestType: "PRIMARY_GUEST" | "OTHER_GUEST";
  contact: {
    fullName: string;
    email: string;
    phone: string;
    citizenId: string;
  };
  stayingGuest: {
    fullName: string;
    phone: string;
    citizenId: string;
  } | null;
  checkIn: string;
  checkOut: string;
  specialRequests: string[];
  note: string;
  promotionCode: string | null;
  useMeGoPoints: boolean;
}

const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchBookingDraft = async (bookingId: string) => {
  const response = await customerApi.get<BookingDraftPayload>(
    `/customer/bookings/${bookingId}/draft`,
  );
  return response.data;
};

export const updateBookingDraft = async (payload: BookingDraftPayload) => {
  const response = await customerApi.put<BookingDraftPayload>(
    `/customer/bookings/${payload.bookingId}/draft`,
    payload,
  );
  return response.data;
};
