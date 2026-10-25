import { useEffect, useMemo, useState } from "react";
import {
  CalendarMonthOutlined,
  CloseOutlined,
  SearchOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import { Button, MenuItem, Pagination, Tab, Tabs, TextField } from "@mui/material";
import {
  AccountLayout,
  EmptyState,
} from "../components/CustomerShared";
import { BookingCard } from "../components/BookingCard";
import { customerApiMethods } from "../services/customerApi";
import type { BookingStatus, CustomerBooking } from "../types/customer.types";

const tabs: Array<{ label: string; status: BookingStatus | "ALL" }> = [
  { label: "Tất cả", status: "ALL" },
  { label: "Sắp đi", status: "CONFIRMED" },
  { label: "Đã hoàn thành", status: "COMPLETED" },
  { label: "Đã hủy", status: "CANCELLED" },
];

const dateInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#f8faff",
    fontSize: 12,
    height: 40,
    "& fieldset": { borderColor: "#dbeafe" },
    "&:hover fieldset": { borderColor: "#93c5fd" },
    "&.Mui-focused fieldset": { borderColor: "#0F62FE" },
  },
  "& .MuiInputLabel-root": { fontSize: 12 },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [draftDateRange, setDraftDateRange] = useState({ from: "", to: "" });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const hasDateFilter = Boolean(dateRange.from && dateRange.to);

  const load = () =>
    customerApiMethods
      .getBookings()
      .then(setBookings)
      .catch(() => setError("Không thể tải đơn đặt phòng."));

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      bookings
        .filter(
          (item) =>
            (filter === "ALL" || item.status === filter) &&
            `${item.bookingCode} ${item.hotelName}`
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (!dateRange.from ||
              !dateRange.to ||
              (item.checkOut >= dateRange.from && item.checkIn <= dateRange.to)),
        )
        .sort((a, b) =>
          sort === "price"
            ? b.total - a.total
            : b.createdAt.localeCompare(a.createdAt),
        ),
    [bookings, dateRange, filter, query, sort],
  );

  return (
    <AccountLayout>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Đơn đặt phòng của tôi
          </h1>
          <span className="rounded-full bg-[#0F62FE]/10 px-2 py-0.5 text-[10px] font-bold text-[#0F62FE]">
            {bookings.length} đơn
          </span>
        </div>
        <Button
          size="small"
          variant="outlined"
          startIcon={<CalendarMonthOutlined />}
          sx={{
            borderRadius: "8px",
            borderColor: "#bfdbfe",
            backgroundColor: "#ffffff",
            color: "#0F62FE",
            fontSize: 12,
            "&:hover": { borderColor: "#0F62FE", backgroundColor: "#eff6ff" },
          }}
        >
          Đồng bộ Google Calendar
        </Button>
      </div>

      <div className="relative mb-5 overflow-visible rounded-lg border border-[#0F62FE]/10 bg-white p-2 shadow-sm shadow-slate-200/60 sm:p-3">
        <Tabs
          value={filter}
          onChange={(_, value: BookingStatus | "ALL") => {
            setFilter(value);
            setPage(1);
          }}
          variant="scrollable"
          sx={{
            minHeight: 40,
            "& .MuiTabs-flexContainer": { gap: "4px" },
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 36,
              minWidth: "auto",
              padding: "6px 13px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              "&:hover": { backgroundColor: "#f1f5f9" },
              "&.Mui-selected": {
                color: "#ffffff",
                backgroundColor: "#0F62FE",
                "& span span": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "#ffffff",
                },
                "&:hover": { backgroundColor: "#0052CC" },
              },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.status}
              value={tab.status}
              label={
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {countFor(bookings, tab.status)}
                  </span>
                </span>
              }
            />
          ))}
        </Tabs>

        <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3 sm:grid-cols-[minmax(0,1fr)_185px_160px]">
          <TextField
            size="small"
            placeholder="Tìm theo mã đặt phòng hoặc tên khách sạn..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{ input: { startAdornment: <SearchOutlined sx={{ mr: 1, color: "#94a3b8", fontSize: 18 }} /> } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8faff",
                fontSize: 12,
                height: 38,
                "& fieldset": { borderColor: "#dbeafe" },
                "&:hover fieldset": { borderColor: "#93c5fd" },
                "&.Mui-focused fieldset": { borderColor: "#0F62FE" },
              },
            }}
          />
          <TextField
            select
            size="small"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8faff",
                fontSize: 12,
                height: 38,
                "& fieldset": { borderColor: "#dbeafe" },
                "&:hover fieldset": { borderColor: "#93c5fd" },
                "&.Mui-focused fieldset": { borderColor: "#0F62FE" },
              },
            }}
          >
            <MenuItem value="recent">Sắp xếp: Mới nhất trước</MenuItem>
            <MenuItem value="price">Sắp xếp: Giá cao trước</MenuItem>
          </TextField>
          <div className="relative">
            <Button
              size="small"
              onClick={() => {
                setDraftDateRange(dateRange);
                setDatePickerOpen((open) => !open);
              }}
              startIcon={<CalendarMonthOutlined sx={{ fontSize: 16 }} />}
              endIcon={<TuneOutlined sx={{ fontSize: 15 }} />}
              sx={{
                width: "100%",
                minHeight: 38,
                justifyContent: "space-between",
                borderRadius: "8px",
                backgroundColor: datePickerOpen || hasDateFilter ? "#eff6ff" : "#f8faff",
                color: datePickerOpen || hasDateFilter ? "#0F62FE" : "#334155",
                fontSize: 12,
                fontWeight: 600,
                border: `1px solid ${datePickerOpen || hasDateFilter ? "#0F62FE" : "#dbeafe"}`,
                "&:hover": { backgroundColor: "#eff6ff", borderColor: "#93c5fd" },
              }}
            >
              <span className="flex-1 text-center">LỌC</span>
            </Button>
            {datePickerOpen && (
              <div
                className="absolute right-0 z-50 mt-2 w-[min(340px,calc(100vw-40px))] rounded-lg border border-blue-100 bg-white p-4 shadow-xl shadow-slate-200/80"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-3">
                  <p className="text-xs font-bold text-slate-800">Lọc theo thời gian lưu trú</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    Hiển thị đơn có thời gian lưu trú giao với khoảng đã chọn.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <TextField
                    label="Từ ngày"
                    type="date"
                    size="small"
                    value={draftDateRange.from}
                    onChange={(event) => setDraftDateRange((range) => ({ ...range, from: event.target.value }))}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={dateInputSx}
                  />
                  <TextField
                    label="Đến ngày"
                    type="date"
                    size="small"
                    value={draftDateRange.to}
                    onChange={(event) => setDraftDateRange((range) => ({ ...range, to: event.target.value }))}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: draftDateRange.from || undefined },
                    }}
                    sx={dateInputSx}
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                  <Button
                    size="small"
                    onClick={() => {
                      setDateRange({ from: "", to: "" });
                      setDraftDateRange({ from: "", to: "" });
                      setPage(1);
                      setDatePickerOpen(false);
                    }}
                    sx={{ borderRadius: "8px", color: "#64748b", fontSize: 11 }}
                  >
                    Xóa lọc
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={!draftDateRange.from || !draftDateRange.to}
                    onClick={() => {
                      setDateRange(draftDateRange);
                      setPage(1);
                      setDatePickerOpen(false);
                    }}
                    sx={{ borderRadius: "8px", backgroundColor: "#0F62FE", fontSize: 11, "&:hover": { backgroundColor: "#0052CC" } }}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasDateFilter && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CalendarMonthOutlined sx={{ fontSize: 16, color: "#0F62FE" }} />
              <span>
                Đang lọc thời gian:
                <strong className="ml-1 text-[#0F62FE]">
                  {formatDateRangeLabel(dateRange)}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDateRange({ from: "", to: "" });
                setDraftDateRange({ from: "", to: "" });
                setPage(1);
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-white hover:text-[#0F62FE]"
            >
              <CloseOutlined sx={{ fontSize: 14 }} />
              Xóa lọc
            </button>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
          <button onClick={() => void load()} className="ml-2 font-medium underline">
            Thử lại
          </button>
        </p>
      )}

      {filtered.length === 0 ? (
        <EmptyState title="Chưa có đơn đặt phòng phù hợp." />
      ) : (
        <div className="space-y-4">
          {filtered.slice((page - 1) * 4, page * 4).map((item) => (
            <BookingCard key={item.id} booking={item} />
          ))}
        </div>
      )}
      <Pagination
        className="mt-6"
        count={Math.max(1, Math.ceil(filtered.length / 4))}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{
          "& .MuiPagination-ul": { justifyContent: "center" },
          "& .MuiPaginationItem-root": {
            borderRadius: "8px",
            color: "#64748b",
            "&.Mui-selected": {
              backgroundColor: "#0F62FE",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#0052CC" },
            },
          },
        }}
      />
    </AccountLayout>
  );
}

function countFor(bookings: CustomerBooking[], status: BookingStatus | "ALL") {
  return status === "ALL" ? bookings.length : bookings.filter((item) => item.status === status).length;
}

function formatDateRangeLabel(range: { from: string; to: string }) {
  if (!range.from || !range.to) return "Chưa chọn";
  return `${formatShortDate(range.from)} – ${formatShortDate(range.to)}`;
}

function formatShortDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
