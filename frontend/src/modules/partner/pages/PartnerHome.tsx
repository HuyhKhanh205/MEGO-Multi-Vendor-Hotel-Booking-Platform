import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import RefreshOutlined from "@mui/icons-material/RefreshOutlined";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import KpiCards from "../components/dashboard/KpiCards";
import RecentBookingsTable from "../components/dashboard/RecentBookingsTable";
import RevenueOccupancyChart from "../components/dashboard/RevenueOccupancyChart";
import RoomStatusCard from "../components/dashboard/RoomStatusCard";
import UrgentTasksBanner from "../components/dashboard/UrgentTasksBanner";
import partnerApi from "../services/partnerApi";
import type { DashboardPeriod, PartnerDashboardData } from "../types/partner.types";

interface DashboardState {
  requestKey: string;
  /** Kỳ của dữ liệu đang hiển thị, để nhãn KPI không đổi trước khi số liệu mới về */
  period: DashboardPeriod;
  data: PartnerDashboardData | null;
  error: string | null;
}

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Đang tải dữ liệu tổng quan">
    <div className="h-28 rounded-3xl bg-white" />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 rounded-3xl bg-white" />)}
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="h-96 rounded-3xl bg-white" />
      <div className="h-96 rounded-3xl bg-white" />
    </div>
  </div>
);

export const PartnerHome = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<DashboardPeriod>("THIS_MONTH");
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<DashboardState>({ requestKey: "", period: "THIS_MONTH", data: null, error: null });
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [showUrgent, setShowUrgent] = useState(true);
  const requestKey = `${period}:${reloadCount}`;
  const loading = state.requestKey !== requestKey;

  useEffect(() => {
    document.title = "Tổng quan | MeGo Partner";
  }, []);

  useEffect(() => {
    let cancelled = false;
    partnerApi
      .getDashboard(period)
      .then((data) => { if (!cancelled) setState({ requestKey, period, data, error: null }); })
      .catch(() => { if (!cancelled) setState((previous) => ({ ...previous, requestKey, error: "Không thể tải dữ liệu tổng quan. Vui lòng kiểm tra kết nối và thử lại." })); });
    return () => { cancelled = true; };
  }, [period, requestKey]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      setSyncedAt(await partnerApi.syncNow());
      toast.success("Đã đồng bộ giá và tồn phòng với tất cả kênh OTA.");
    } catch {
      toast.error("Đồng bộ thất bại. Vui lòng thử lại sau ít phút.");
    } finally {
      setSyncing(false);
    }
  };

  const { data, error } = state;

  if (!data && error && !loading) {
    return (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white p-10 text-center">
        <ErrorOutlineOutlined className="text-red-500" sx={{ fontSize: 40 }} />
        <p className="font-semibold text-slate-800">{error}</p>
        <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1677FF] px-4 py-2 text-sm font-semibold text-white">
          <RefreshOutlined sx={{ fontSize: 18 }} /> Thử lại
        </button>
      </div>
    );
  }

  if (!data) return <DashboardSkeleton />;

  return (
    <div className="space-y-5">
      <DashboardHeader
        hotelName={data.hotel.name}
        today={data.today}
        syncedAt={syncedAt ?? data.syncedAt}
        period={period}
        syncing={syncing}
        onPeriodChange={setPeriod}
        onSync={handleSync}
        onExport={() => toast.info("Báo cáo tổng quan sẽ xuất được khi trang Báo cáo Doanh thu hoàn thành.")}
      />

      {showUrgent && (
        <UrgentTasksBanner
          tasks={data.urgentTasks}
          onReview={() => navigate("/partner/bookings?filter=early-checkin")}
          onDismiss={() => setShowUrgent(false)}
        />
      )}

      <div className={`transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
        <KpiCards period={state.period} kpis={data.kpis} roomStatus={data.roomStatus} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RevenueOccupancyChart trend={data.trend} today={data.today} />
        <RoomStatusCard roomStatus={data.roomStatus} onUpdate={() => navigate("/partner/inventory")} />
      </div>

      <RecentBookingsTable bookings={data.recentBookings} totalBookings={data.totalBookings} />
    </div>
  );
};

export default PartnerHome;
