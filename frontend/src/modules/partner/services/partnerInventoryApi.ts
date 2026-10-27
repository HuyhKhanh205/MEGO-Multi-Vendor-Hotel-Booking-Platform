import { generateInventory, parseInventoryId } from "../data/partnerOpsSeedMock";
import type {
  InventoryBulkRequest,
  InventoryBulkResult,
  InventoryUpdateRequest,
  RoomInventoryDto,
  RoomTypeDto,
} from "../types/backend.types";
import { dateRange, isoWeekday, todayIso } from "../utils/formatters";
import { applyAllotment, applyPriceAdjust, MAX_RANGE_DAYS, priceError } from "../utils/inventoryRules";
import { mockDelay, PARTNER_USE_MOCK, PartnerApiError, partnerRequest } from "./partnerHttp";
import { assertOwnsHotel, readMockDb, updateMockDb, type PartnerMockDb } from "./partnerMockDb";

const CONFLICT_MESSAGE = "Dữ liệu vừa được cập nhật bởi người khác, vui lòng tải lại.";

const cellKey = (roomTypeId: number, date: string) => `${roomTypeId}:${date}`;

const readCell = (db: PartnerMockDb, roomType: RoomTypeDto, date: string): RoomInventoryDto => {
  const stored = db.inventory[cellKey(roomType.id, date)];
  const cell = stored ? { ...stored } : generateInventory(roomType, date);
  return { ...cell, effectivePrice: cell.price ?? roomType.basePrice };
};

const writeCell = (db: PartnerMockDb, cell: RoomInventoryDto): RoomInventoryDto => {
  const saved = { ...cell, version: cell.version + 1 };
  db.inventory[cellKey(cell.roomTypeId, cell.date)] = saved;
  return saved;
};

const assertRange = (from: string, to: string) => {
  if (!from || !to || from > to) throw new PartnerApiError("Khoảng ngày không hợp lệ.", 400);
  if (dateRange(from, to).length > MAX_RANGE_DAYS) throw new PartnerApiError(`Chỉ xử lý tối đa ${MAX_RANGE_DAYS} ngày mỗi lần.`, 400);
};

const findOwnedRoomType = (db: PartnerMockDb, roomTypeId: number): RoomTypeDto => {
  const roomType = db.roomTypes.find((item) => item.id === roomTypeId);
  if (!roomType) throw new PartnerApiError("Không tìm thấy hạng phòng.", 404);
  assertOwnsHotel(roomType.hotelId);
  return roomType;
};

export const partnerInventoryApi = {
  /** GET /api/partner/hotels/{hotelId}/inventory?from=&to= : mọi hạng phòng × mọi ngày trong khoảng */
  async getInventory(hotelId: number, from: string, to: string): Promise<RoomInventoryDto[]> {
    if (!PARTNER_USE_MOCK) {
      return partnerRequest("get", `/partner/hotels/${hotelId}/inventory`, "Không tải được tồn kho.", undefined, { params: { from, to } });
    }
    await mockDelay(350);
    assertOwnsHotel(hotelId);
    assertRange(from, to);
    const db = readMockDb();
    const days = dateRange(from, to);
    return db.roomTypes
      .filter((item) => item.hotelId === hotelId)
      .flatMap((roomType) => days.map((date) => readCell(db, roomType, date)));
  },

  /** PATCH /api/partner/inventory/{id}: sửa 1 ô; `version` lệch → 409 (khóa lạc quan @Version) */
  async updateInventory(id: number, request: InventoryUpdateRequest): Promise<RoomInventoryDto> {
    if (!PARTNER_USE_MOCK) {
      try {
        return await partnerRequest<RoomInventoryDto>("patch", `/partner/inventory/${id}`, "Không lưu được tồn kho.", request);
      } catch (error) {
        if (error instanceof PartnerApiError && error.status === 409) throw new PartnerApiError(CONFLICT_MESSAGE, 409);
        throw error;
      }
    }
    await mockDelay(300);
    return updateMockDb((db) => {
      const { roomTypeId, date } = parseInventoryId(id);
      const roomType = findOwnedRoomType(db, roomTypeId);
      const cell = readCell(db, roomType, date);
      if (date < todayIso()) throw new PartnerApiError("Không thể sửa ngày đã qua.", 400);
      if (cell.version !== request.version) throw new PartnerApiError(CONFLICT_MESSAGE, 409);
      if (request.price !== undefined) {
        const problem = priceError(request.price);
        if (problem) throw new PartnerApiError(problem, 400);
        cell.price = request.price;
      }
      if (request.availableRooms !== undefined) {
        if (!Number.isInteger(request.availableRooms) || request.availableRooms < 0 || request.availableRooms > cell.totalRooms) {
          throw new PartnerApiError(`Số phòng trống phải từ 0 đến ${cell.totalRooms}.`, 400);
        }
        cell.availableRooms = request.availableRooms;
      }
      if (request.closed !== undefined) cell.closed = request.closed;
      return structuredClone(writeCell(db, { ...cell, effectivePrice: cell.price ?? roomType.basePrice }));
    });
  },

  /** POST /api/partner/hotels/{hotelId}/inventory/bulk: bỏ qua ngày đã qua và các thứ không được chọn */
  async bulkUpdate(hotelId: number, request: InventoryBulkRequest): Promise<InventoryBulkResult> {
    if (!PARTNER_USE_MOCK) return partnerRequest("post", `/partner/hotels/${hotelId}/inventory/bulk`, "Không cập nhật được hàng loạt.", request);
    await mockDelay(600);
    assertOwnsHotel(hotelId);
    assertRange(request.from, request.to);
    if (!request.roomTypeIds.length) throw new PartnerApiError("Chọn ít nhất một hạng phòng.", 400);
    if (!request.weekdays.length) throw new PartnerApiError("Chọn ít nhất một thứ trong tuần.", 400);
    if (!request.price && !request.allotment && request.closed === undefined) throw new PartnerApiError("Chưa chọn thao tác cập nhật.", 400);

    return updateMockDb((db) => {
      const roomTypes = request.roomTypeIds.map((roomTypeId) => {
        const roomType = findOwnedRoomType(db, roomTypeId);
        if (roomType.hotelId !== hotelId) throw new PartnerApiError("Hạng phòng không thuộc khách sạn này.", 400);
        return roomType;
      });
      const start = request.from < todayIso() ? todayIso() : request.from;
      const days = start > request.to ? [] : dateRange(start, request.to).filter((date) => request.weekdays.includes(isoWeekday(date)));

      // Tính hết rồi mới ghi: chỉ cần một ô lỗi thì không ô nào bị đổi (như một transaction)
      const updates = roomTypes.flatMap((roomType) => days.map((date) => {
        const cell = readCell(db, roomType, date);
        if (request.price) {
          cell.price = applyPriceAdjust(cell.effectivePrice, request.price.mode, request.price.value);
          const problem = priceError(cell.price);
          if (problem) throw new PartnerApiError(`${roomType.name}, ngày ${date}: ${problem}`, 400);
        }
        if (request.allotment) cell.availableRooms = applyAllotment(cell.availableRooms, cell.totalRooms, request.allotment.mode, request.allotment.value);
        if (request.closed !== undefined) cell.closed = request.closed;
        return { ...cell, effectivePrice: cell.price ?? roomType.basePrice };
      }));
      updates.forEach((cell) => writeCell(db, cell));
      return { updatedCount: updates.length };
    });
  },
};

export default partnerInventoryApi;
