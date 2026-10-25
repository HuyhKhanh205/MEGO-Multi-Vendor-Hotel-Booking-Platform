import axios from "axios";
import {
  MOCK_DISPATCH_TODAY,
  MOCK_OCCUPANCY_TARGET,
  MOCK_PERIOD_STATS,
  MOCK_RECENT_BOOKINGS,
  MOCK_ROOM_STATUS,
  MOCK_SYNCED_AT,
  MOCK_TODAY,
  MOCK_TREND,
  MOCK_URGENT_TASKS,
  PARTNER_DEMO_ACCOUNT,
} from "../data/partnerMock";
import type { DashboardPeriod, PartnerDashboardData } from "../types/partner.types";

const USE_MOCK = true;
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api", headers: { "Content-Type": "application/json" } });
const delay = (ms = 450) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const periodDays: Record<DashboardPeriod, number> = { TODAY: 1, LAST_7_DAYS: 7, THIS_MONTH: MOCK_TREND.length };

export const partnerApi = {
  async getDashboard(period: DashboardPeriod): Promise<PartnerDashboardData> {
    if (!USE_MOCK) return (await api.get<PartnerDashboardData>("/partner/dashboard", { params: { period } })).data; // TODO: endpoint Spring Boot cho đối tác
    await delay();

    // Mọi chỉ số được tính từ cùng một chuỗi dữ liệu ngày để không lệch nhau giữa các thẻ.
    const days = MOCK_TREND.slice(-periodDays[period]);
    const revenue = days.reduce((sum, day) => sum + day.revenue, 0);
    const occupancyPct = days.reduce((sum, day) => sum + day.occupancyPct, 0) / days.length;
    const stats = MOCK_PERIOD_STATS[period];

    return {
      hotel: PARTNER_DEMO_ACCOUNT.hotels[0],
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
      trend: MOCK_TREND.slice(-14),
      roomStatus: MOCK_ROOM_STATUS,
      urgentTasks: MOCK_URGENT_TASKS,
      recentBookings: MOCK_RECENT_BOOKINGS,
      totalBookings: MOCK_PERIOD_STATS.THIS_MONTH.bookings,
    };
  },

  async syncNow(): Promise<string> {
    if (!USE_MOCK) return (await api.post<{ syncedAt: string }>("/partner/sync")).data.syncedAt; // TODO: endpoint Spring Boot cho đối tác
    await delay(900);
    return new Date().toISOString();
  },
};

export default partnerApi;
