import type { SvgIconComponent } from "@mui/icons-material";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import BedOutlined from "@mui/icons-material/BedOutlined";
import EventBusyOutlined from "@mui/icons-material/EventBusyOutlined";
import EventNoteOutlined from "@mui/icons-material/EventNoteOutlined";
import GridViewOutlined from "@mui/icons-material/GridViewOutlined";
import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import RateReviewOutlined from "@mui/icons-material/RateReviewOutlined";
import SellOutlined from "@mui/icons-material/SellOutlined";
import SupportAgentOutlined from "@mui/icons-material/SupportAgentOutlined";

export type PartnerNavBadgeTone = "blue" | "red" | "green" | "slate";

export interface PartnerNavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  badge?: { text: string; tone: PartnerNavBadgeTone };
}

export interface PartnerNavGroup {
  title: string;
  items: PartnerNavItem[];
}

export const PARTNER_HOME_PATH = "/partner";

export const PARTNER_NAV: PartnerNavGroup[] = [
  {
    title: "Quản trị vận hành",
    items: [
      { label: "Tổng quan", path: PARTNER_HOME_PATH, icon: GridViewOutlined },
      { label: "Quản lý Khách sạn", path: "/partner/hotel", icon: ApartmentOutlined },
      { label: "Loại phòng & Phòng", path: "/partner/room-types", icon: BedOutlined },
      { label: "Cấu hình Giá phòng", path: "/partner/rates", icon: SellOutlined },
      { label: "Tồn kho & Đóng/Mở bán", path: "/partner/inventory", icon: Inventory2Outlined },
    ],
  },
  {
    title: "Đặt phòng & Doanh số",
    items: [
      { label: "Quản lý Đặt phòng", path: "/partner/bookings", icon: EventNoteOutlined, badge: { text: "12 mới", tone: "blue" } },
      { label: "Hủy & No-Show", path: "/partner/cancellations", icon: EventBusyOutlined, badge: { text: "3 chờ", tone: "red" } },
      { label: "Khuyến mãi & Voucher", path: "/partner/promotions", icon: LocalOfferOutlined },
      { label: "Báo cáo Doanh thu", path: "/partner/revenue", icon: InsertChartOutlined },
      { label: "Dòng tiền & Rút tiền", path: "/partner/payouts", icon: AccountBalanceWalletOutlined, badge: { text: "45,2 tr", tone: "green" } },
      { label: "Đánh giá từ khách", path: "/partner/reviews", icon: RateReviewOutlined, badge: { text: "4,8★", tone: "slate" } },
    ],
  },
  {
    title: "Hệ thống & Thiết lập",
    items: [
      { label: "Nhân viên & Phân quyền", path: "/partner/staff", icon: ManageAccountsOutlined },
      { label: "Trung tâm Hỗ trợ", path: "/partner/support", icon: SupportAgentOutlined },
    ],
  },
];

export const findPartnerNavItem = (pathname: string): PartnerNavItem | undefined =>
  PARTNER_NAV.flatMap((group) => group.items).find((item) => item.path === pathname.replace(/\/+$/, ""));
