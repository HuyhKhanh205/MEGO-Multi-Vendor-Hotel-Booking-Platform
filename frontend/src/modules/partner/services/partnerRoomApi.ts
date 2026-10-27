import type { RoomDto, RoomRequest, RoomTypeDto, RoomTypeRequest } from "../types/backend.types";
import { mockDelay, PARTNER_USE_MOCK, PartnerApiError, partnerRequest } from "./partnerHttp";
import { assertOwnsHotel, nextMockId, readMockDb, updateMockDb, type PartnerMockDb } from "./partnerMockDb";

const findRoomType = (db: PartnerMockDb, roomTypeId: number): RoomTypeDto => {
  const roomType = db.roomTypes.find((item) => item.id === roomTypeId);
  if (!roomType) throw new PartnerApiError("Không tìm thấy hạng phòng.", 404);
  assertOwnsHotel(roomType.hotelId);
  return roomType;
};

/** Khớp ràng buộc unique (room_type_id, room_number) của bảng inventory_rooms. */
const assertUniqueRoomNumber = (db: PartnerMockDb, roomTypeId: number, roomNumber: string, ignoreId?: number) => {
  const duplicated = db.rooms.some(
    (room) => room.roomTypeId === roomTypeId && room.id !== ignoreId && room.roomNumber.trim().toLowerCase() === roomNumber.trim().toLowerCase(),
  );
  if (duplicated) throw new PartnerApiError(`Số phòng "${roomNumber}" đã tồn tại trong hạng phòng này.`, 400);
};

const toRoomType = (db: PartnerMockDb, hotelId: number, request: RoomTypeRequest, id: number): RoomTypeDto => {
  const { imageUrls, ...rest } = request;
  return {
    ...rest,
    id,
    hotelId,
    images: imageUrls.map((url, index) => ({ id: nextMockId(db), url, sortOrder: index })),
  };
};

export const partnerRoomApi = {
  /** GET /api/partner/hotels/{hotelId}/room-types */
  async listRoomTypes(hotelId: number): Promise<RoomTypeDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/hotels/${hotelId}/room-types`, "Không tải được danh sách hạng phòng.");
    await mockDelay();
    assertOwnsHotel(hotelId);
    return readMockDb().roomTypes.filter((item) => item.hotelId === hotelId);
  },

  /** POST /api/partner/hotels/{hotelId}/room-types */
  async createRoomType(hotelId: number, request: RoomTypeRequest): Promise<RoomTypeDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("post", `/partner/hotels/${hotelId}/room-types`, "Không tạo được hạng phòng.", request);
    await mockDelay(600);
    assertOwnsHotel(hotelId);
    return updateMockDb((db) => {
      const roomType = toRoomType(db, hotelId, request, nextMockId(db));
      db.roomTypes.push(roomType);
      return structuredClone(roomType);
    });
  },

  /** PUT /api/partner/room-types/{id} */
  async updateRoomType(roomTypeId: number, request: RoomTypeRequest): Promise<RoomTypeDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/room-types/${roomTypeId}`, "Không lưu được hạng phòng.", request);
    await mockDelay(600);
    return updateMockDb((db) => {
      const current = findRoomType(db, roomTypeId);
      const updated = toRoomType(db, current.hotelId, request, roomTypeId);
      db.roomTypes = db.roomTypes.map((item) => (item.id === roomTypeId ? updated : item));
      return structuredClone(updated);
    });
  },

  /** PATCH /api/partner/room-types/{id}/active  body: { active } */
  async setRoomTypeActive(roomTypeId: number, active: boolean): Promise<RoomTypeDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("patch", `/partner/room-types/${roomTypeId}/active`, "Không cập nhật được trạng thái bán.", { active });
    await mockDelay(350);
    return updateMockDb((db) => {
      const roomType = findRoomType(db, roomTypeId);
      roomType.active = active;
      return structuredClone(roomType);
    });
  },

  /** DELETE /api/partner/room-types/{id} (xóa kèm các phòng thuộc hạng) */
  async deleteRoomType(roomTypeId: number): Promise<void> {
    if (!PARTNER_USE_MOCK) return partnerRequest("delete", `/partner/room-types/${roomTypeId}`, "Không xóa được hạng phòng.");
    await mockDelay(500);
    updateMockDb((db) => {
      findRoomType(db, roomTypeId);
      db.roomTypes = db.roomTypes.filter((item) => item.id !== roomTypeId);
      db.rooms = db.rooms.filter((room) => room.roomTypeId !== roomTypeId);
    });
  },

  /** GET /api/partner/hotels/{hotelId}/rooms: toàn bộ phòng vật lý của khách sạn (dùng cho thống kê) */
  async listHotelRooms(hotelId: number): Promise<RoomDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/hotels/${hotelId}/rooms`, "Không tải được danh sách phòng.");
    await mockDelay(250);
    assertOwnsHotel(hotelId);
    const db = readMockDb();
    const roomTypeIds = new Set(db.roomTypes.filter((item) => item.hotelId === hotelId).map((item) => item.id));
    return db.rooms.filter((room) => roomTypeIds.has(room.roomTypeId));
  },

  /** GET /api/partner/room-types/{id}/rooms */
  async listRooms(roomTypeId: number): Promise<RoomDto[]> {
    if (!PARTNER_USE_MOCK) return partnerRequest("get", `/partner/room-types/${roomTypeId}/rooms`, "Không tải được danh sách phòng.");
    await mockDelay(300);
    const db = readMockDb();
    findRoomType(db, roomTypeId);
    return db.rooms.filter((room) => room.roomTypeId === roomTypeId);
  },

  /** POST /api/partner/room-types/{id}/rooms */
  async createRoom(roomTypeId: number, request: RoomRequest): Promise<RoomDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("post", `/partner/room-types/${roomTypeId}/rooms`, "Không thêm được phòng.", request);
    await mockDelay(400);
    return updateMockDb((db) => {
      findRoomType(db, roomTypeId);
      assertUniqueRoomNumber(db, roomTypeId, request.roomNumber);
      const room: RoomDto = { ...request, roomNumber: request.roomNumber.trim(), id: nextMockId(db), roomTypeId };
      db.rooms.push(room);
      return structuredClone(room);
    });
  },

  /** PUT /api/partner/rooms/{id} */
  async updateRoom(roomId: number, request: RoomRequest): Promise<RoomDto> {
    if (!PARTNER_USE_MOCK) return partnerRequest("put", `/partner/rooms/${roomId}`, "Không lưu được phòng.", request);
    await mockDelay(400);
    return updateMockDb((db) => {
      const room = db.rooms.find((item) => item.id === roomId);
      if (!room) throw new PartnerApiError("Không tìm thấy phòng.", 404);
      findRoomType(db, room.roomTypeId);
      assertUniqueRoomNumber(db, room.roomTypeId, request.roomNumber, roomId);
      Object.assign(room, { ...request, roomNumber: request.roomNumber.trim() });
      return structuredClone(room);
    });
  },

  /** DELETE /api/partner/rooms/{id} */
  async deleteRoom(roomId: number): Promise<void> {
    if (!PARTNER_USE_MOCK) return partnerRequest("delete", `/partner/rooms/${roomId}`, "Không xóa được phòng.");
    await mockDelay(350);
    updateMockDb((db) => {
      const room = db.rooms.find((item) => item.id === roomId);
      if (!room) throw new PartnerApiError("Không tìm thấy phòng.", 404);
      findRoomType(db, room.roomTypeId);
      db.rooms = db.rooms.filter((item) => item.id !== roomId);
    });
  },
};

export default partnerRoomApi;
