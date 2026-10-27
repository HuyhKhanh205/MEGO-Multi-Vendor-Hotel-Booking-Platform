import { SEED_AMENITIES, SEED_DESTINATIONS } from "../data/backendSeedMock";
import type {
  AmenityDto,
  AmenityScope,
  DestinationDto,
  HotelDto,
  HotelImageRequest,
  HotelPolicyDto,
  HotelSummaryDto,
  HotelUpdateRequest,
} from "../types/backend.types";
import { mockDelay, PARTNER_USE_MOCK, PartnerApiError, partnerRequest } from "./partnerHttp";
import { assertOwnsHotel, nextMockId, ownedHotelIds, readMockDb, updateMockDb } from "./partnerMockDb";

const toSummary = (hotel: HotelDto): HotelSummaryDto => ({
  id: hotel.id,
  name: hotel.name,
  slug: hotel.slug,
  starRating: hotel.starRating,
  destinationName: SEED_DESTINATIONS.find((item) => item.id === hotel.destinationId)?.name ?? null,
  approvalStatus: hotel.approvalStatus,
  active: hotel.active,
});

const findOwnedHotel = (hotelId: number): HotelDto => {
  assertOwnsHotel(hotelId);
  const hotel = readMockDb().hotels.find((item) => item.id === hotelId);
  if (!hotel) throw new PartnerApiError("Không tìm thấy khách sạn.", 404);
  return hotel;
};

export const partnerHotelApi = {
  /** GET /api/partner/hotels */
  async listMyHotels(): Promise<HotelSummaryDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", "/partner/hotels", "Không tải được danh sách khách sạn.");
    await mockDelay(250);
    const ids = ownedHotelIds();
    return readMockDb().hotels.filter((hotel) => ids.includes(hotel.id)).map(toSummary);
  },

  /** GET /api/partner/hotels/{id} */
  async getHotel(hotelId: number): Promise<HotelDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/hotels/${hotelId}`, "Không tải được thông tin khách sạn.");
    await mockDelay();
    return findOwnedHotel(hotelId);
  },

  /** PUT /api/partner/hotels/{id} */
  async updateHotel(hotelId: number, request: HotelUpdateRequest): Promise<HotelDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/hotels/${hotelId}`, "Không lưu được thông tin khách sạn.", request);
    await mockDelay(600);
    assertOwnsHotel(hotelId);
    return updateMockDb((db) => {
      const hotel = db.hotels.find((item) => item.id === hotelId) as HotelDto;
      Object.assign(hotel, request);
      return structuredClone(hotel);
    });
  },

  /** PUT /api/partner/hotels/{id}/amenities  body: { amenityIds } */
  async updateAmenities(hotelId: number, amenityIds: number[]): Promise<HotelDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/hotels/${hotelId}/amenities`, "Không lưu được tiện ích.", { amenityIds });
    await mockDelay(500);
    assertOwnsHotel(hotelId);
    return updateMockDb((db) => {
      const hotel = db.hotels.find((item) => item.id === hotelId) as HotelDto;
      hotel.amenityIds = [...amenityIds];
      return structuredClone(hotel);
    });
  },

  /** PUT /api/partner/hotels/{id}/images  body: HotelImageRequest[] (thay toàn bộ danh sách) */
  async updateImages(hotelId: number, images: HotelImageRequest[]): Promise<HotelDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/hotels/${hotelId}/images`, "Không lưu được hình ảnh.", images);
    await mockDelay(500);
    assertOwnsHotel(hotelId);
    return updateMockDb((db) => {
      const hotel = db.hotels.find((item) => item.id === hotelId) as HotelDto;
      hotel.images = images.map((image) => ({ ...image, id: nextMockId(db) }));
      return structuredClone(hotel);
    });
  },

  /** GET /api/partner/hotels/{id}/policy */
  async getPolicy(hotelId: number): Promise<HotelPolicyDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/hotels/${hotelId}/policy`, "Không tải được chính sách khách sạn.");
    await mockDelay(300);
    assertOwnsHotel(hotelId);
    const policy = readMockDb().policies[hotelId];
    if (!policy) throw new PartnerApiError("Khách sạn chưa có chính sách.", 404);
    return policy;
  },

  /** PUT /api/partner/hotels/{id}/policy */
  async updatePolicy(hotelId: number, request: HotelPolicyDto): Promise<HotelPolicyDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/hotels/${hotelId}/policy`, "Không lưu được chính sách.", request);
    await mockDelay(600);
    assertOwnsHotel(hotelId);
    return updateMockDb((db) => {
      db.policies[hotelId] = { ...request };
      return structuredClone(db.policies[hotelId]);
    });
  },

  /** GET /api/destinations (công khai) */
  async listDestinations(): Promise<DestinationDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", "/destinations", "Không tải được danh sách điểm đến.");
    await mockDelay(150);
    return SEED_DESTINATIONS;
  },

  /** GET /api/amenities?scope=HOTEL|ROOM */
  async listAmenities(scope: AmenityScope): Promise<AmenityDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", "/amenities", "Không tải được danh sách tiện ích.", undefined, { params: { scope } });
    await mockDelay(150);
    return SEED_AMENITIES.filter((item) => item.scope === scope);
  },
};

export default partnerHotelApi;
