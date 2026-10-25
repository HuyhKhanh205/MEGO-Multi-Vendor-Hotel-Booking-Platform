export type ChatRole = "user" | "assistant";

export type ChatUserRole = "GUEST" | "CUSTOMER" | "PARTNER" | "ADMIN";

export interface ChatRoomCard {
  roomDbId?: number;
  hotelId: string;
  hotelName: string;
  city: string;
  address?: string;
  stars: number;
  rating?: number;
  roomId: string;
  roomName: string;
  bedType: string;
  areaM2: number;
  maxAdults: number;
  maxChildren: number;
  pricePerNight: number;
  availableRooms: number;
  imageUrl: string;
  freeCancellation: boolean;
  payAtHotel: boolean;
}

export interface ChatBookingRequest {
  roomDbId?: number;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequest?: string;
  paymentMethod: string;
}

export interface ChatBookingResponse {
  success: boolean;
  bookingCode: string;
  message: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  pricePerNight: number;
  totalAmount: number;
  remainingAvailableRooms: number;
  frontendBookingId?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  cards?: ChatRoomCard[];
  bookingConfirmation?: ChatBookingResponse;
}

export interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  message: string;
  history: ChatHistoryMessage[];
  role: ChatUserRole;
  language: "vi" | "en";
}

export interface ChatResponse {
  reply: string;
  cards?: ChatRoomCard[];
  triggerBookingWizard?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
