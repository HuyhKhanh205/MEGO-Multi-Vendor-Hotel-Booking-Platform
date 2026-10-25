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
  PARTNER_DEMO_CREDENTIALS,
} from "../data/partnerMock";
import type { DashboardPeriod, PartnerAccount, PartnerDashboardData } from "../types/partner.types";

const USE_MOCK = true;
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api", headers: { "Content-Type": "application/json" } });
const delay = (ms = 450) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 5;
let failedAttempts = 0;
let lockedUntil = 0;

export interface PartnerLoginInput {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface PartnerLoginResult {
  account: PartnerAccount;
  token: string;
}

const periodDays: Record<DashboardPeriod, number> = { TODAY: 1, LAST_7_DAYS: 7, THIS_MONTH: MOCK_TREND.length };

export const partnerApi = {
  async login(input: PartnerLoginInput): Promise<PartnerLoginResult> {
    if (!USE_MOCK) return (await api.post<PartnerLoginResult>("/partner/auth/login", input)).data; // TODO: endpoint Spring Boot cho đối tác
    await delay();

    const now = Date.now();
    if (lockedUntil > now) {
      const minutes = Math.ceil((lockedUntil - now) / 60_000);
      throw new Error(`Tài khoản tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau ${minutes} phút hoặc liên hệ hotline.`);
    }

    const identifier = input.identifier.trim().toLowerCase();
    const matchesIdentifier = identifier === PARTNER_DEMO_CREDENTIALS.identifier
      || identifier === PARTNER_DEMO_ACCOUNT.hotels[0].code.toLowerCase();
    if (!matchesIdentifier || input.password !== PARTNER_DEMO_CREDENTIALS.password) {
      failedAttempts += 1;
      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        failedAttempts = 0;
        lockedUntil = now + LOCK_MINUTES * 60_000;
        throw new Error(`Bạn đã nhập sai ${MAX_FAILED_ATTEMPTS} lần. Tài khoản tạm khóa ${LOCK_MINUTES} phút để bảo vệ dữ liệu khách sạn.`);
      }
      const remaining = MAX_FAILED_ATTEMPTS - failedAttempts;
      throw new Error(`Email/mã đối tác hoặc mật khẩu không đúng. Còn ${remaining} lần thử trước khi tài khoản bị tạm khóa.`);
    }

    failedAttempts = 0;
    return { account: PARTNER_DEMO_ACCOUNT, token: `mego-partner-token-${now}` };
  },

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
