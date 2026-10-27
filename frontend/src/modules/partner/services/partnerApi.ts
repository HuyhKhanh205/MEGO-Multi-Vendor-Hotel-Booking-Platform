import {
  MOCK_DISPATCH_TODAY,
  MOCK_OCCUPANCY_TARGET,
  MOCK_PERIOD_STATS,
  MOCK_RECENT_BOOKINGS,
  MOCK_SYNCED_AT,
  MOCK_TODAY,
  MOCK_TREND,
  MOCK_URGENT_TASKS,
} from "../data/partnerMock";
import type { RoomDto } from "../types/backend.types";
import type { DashboardPeriod, PartnerDashboardData, RoomStatusSummary } from "../types/partner.types";
import { mockDelay, PARTNER_USE_MOCK, partnerRequest } from "./partnerHttp";
import partnerRoomApi from "./partnerRoomApi";

const periodDays: Record<DashboardPeriod, number> = { TODAY: 1, LAST_7_DAYS: 7, THIS_MONTH: MOCK_TREND.length };

/** Tình trạng phòng hôm nay tính từ bảng inventory_rooms (RoomStatus). */
const summarizeRooms = (rooms: RoomDto[]): RoomStatusSummary => ({
  occupied: rooms.filter((room) => room.status === "OCCUPIED").length,
  vacantReady: rooms.filter((room) => room.status === "AVAILABLE").length,
  cleaning: rooms.filter((room) => room.status === "CLEANING").length,
  maintenance: rooms.filter((room) => room.status === "MAINTENANCE").length,
});

export const partnerApi = {
  /**
   * GET /api/partner/dashboard?hotelId=&period=
   * Mock: tình trạng phòng lấy từ danh sách phòng của khách sạn; doanh thu, lượt đặt, đơn gần nhất
   * vẫn là dữ liệu mẫu vì backend chưa có module Booking/Payment.
   */
  async getDashboard(hotelId: number, period: DashboardPeriod): Promise<PartnerDashboardData> {
    if (!PARTNER_USE_MOCK) {
      return partnerRequest("get", "/partner/dashboard", "Không thể tải dữ liệu tổng quan.", undefined, { params: { hotelId, period } });
    }
    const rooms = await partnerRoomApi.listHotelRooms(hotelId);
    await mockDelay(200);

    const roomStatus = summarizeRooms(rooms);
    const totalRooms = rooms.length;
    const todayOccupancy = totalRooms ? Math.round((roomStatus.occupied / totalRooms) * 100) : 0;
    // Ngày cuối của chuỗi xu hướng là "hôm nay": dùng công suất thực tế từ danh sách phòng để các thẻ khớp nhau.
    const trend = MOCK_TREND.map((point, index) => (index === MOCK_TREND.length - 1 ? { ...point, occupancyPct: todayOccupancy } : point));
    const days = trend.slice(-periodDays[period]);
    const revenue = days.reduce((sum, day) => sum + day.revenue, 0);
    const occupancyPct = days.reduce((sum, day) => sum + day.occupancyPct, 0) / days.length;
    const stats = MOCK_PERIOD_STATS[period];

    return {
      syncedAt: MOCK_SYNCED_AT,
      today: MOCK_TODAY,
      kpis: {
        revenue,
        revenueChangePct: stats.revenueChangePct,
        occupancyPct: Math.round(occupancyPct * 10) / 10,
        occupancyChangePct: stats.occupancyChangePct,
        occupancyTargetPct: MOCK_OCCUPANCY_TARGET,
        bookings: stats.bookings,
        newBookings24h: MOCK_DISPATCH_TODAY.newBookings24h,
        checkInsToday: MOCK_DISPATCH_TODAY.checkIns,
        checkOutsToday: MOCK_DISPATCH_TODAY.checkOuts,
      },
      trend: trend.slice(-14),
      roomStatus,
      urgentTasks: MOCK_URGENT_TASKS,
      recentBookings: MOCK_RECENT_BOOKINGS,
      totalBookings: MOCK_PERIOD_STATS.THIS_MONTH.bookings,
    };
  },

  async syncNow(): Promise<string> {
    if (!PARTNER_USE_MOCK) {
      return (await partnerRequest<{ syncedAt: string }>("post", "/partner/sync", "Đồng bộ thất bại.")).syncedAt;
    }
    await mockDelay(900);
    return new Date().toISOString();
  },
};

export default partnerApi;
