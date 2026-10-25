import { useEffect, useMemo, useState } from "react";
import { FavoriteOutlined, TuneOutlined } from "@mui/icons-material";
import { MenuItem, TextField } from "@mui/material";
import { toast } from "react-toastify";
import {
  AccountLayout,
  EmptyState,
} from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { WishlistHotel } from "../types/customer.types";
import { WishlistHotelCard } from "../components/WishlistHotelCard";
export default function WishlistPage() {
  const [items, setItems] = useState<WishlistHotel[]>([]);
  const [sort, setSort] = useState("recent");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const load = () =>
    customerApiMethods
      .getWishlist()
      .then(setItems)
      .catch(() => setError("Không thể tải danh sách yêu thích."));
  useEffect(() => {
    void load();
  }, []);
  const sorted = useMemo(
    () =>
      items
        .filter((item) => matchesCategory(item, category))
        .sort((a, b) =>
        sort === "price"
          ? a.priceFrom - b.priceFrom
          : sort === "rating"
            ? b.rating - a.rating
            : b.addedAt.localeCompare(a.addedAt),
        ),
    [category, items, sort],
  );
  const remove = async (hotel: WishlistHotel) => {
    await customerApiMethods.removeWishlist(hotel.id);
    setItems((current) => current.filter((item) => item.id !== hotel.id));
    toast("Đã bỏ yêu thích", {
      onClick: () => void customerApiMethods.restoreWishlist(hotel).then(load),
      autoClose: 5000,
    });
  };
  return (
    <AccountLayout>
      <div className="mb-5 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F62FE]/10 text-[#0F62FE]">
              <FavoriteOutlined sx={{ fontSize: 19 }} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Khách sạn yêu thích
            </h1>
            <span className="rounded-full bg-[#0F62FE]/10 px-2 py-1 text-[10px] font-bold text-[#0F62FE]">
              {items.length}
            </span>
          </div>
          <TextField
            select
            size="small"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            slotProps={{ input: { startAdornment: <TuneOutlined sx={{ mr: 0.75, color: "#0F62FE", fontSize: 16 }} /> } }}
            sx={{
              minWidth: 166,
              "& .MuiOutlinedInput-root": {
                height: 34,
                borderRadius: "8px",
                backgroundColor: "#f8faff",
                fontSize: 11,
                fontWeight: 600,
                "& fieldset": { borderColor: "#dbeafe" },
                "&:hover fieldset": { borderColor: "#93c5fd" },
              },
            }}
          >
            <MenuItem value="recent">Mới thêm gần đây</MenuItem>
            <MenuItem value="price">Giá thấp trước</MenuItem>
            <MenuItem value="rating">Đánh giá cao</MenuItem>
          </TextField>
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2.5 sm:px-5">
          {categories.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold transition-colors ${
                  active
                    ? "bg-[#0F62FE] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-[#0F62FE]"
                }`}
              >
                {item.label} ({countCategory(items, item.id)})
              </button>
            );
          })}
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
        >
          {error}{" "}
          <button onClick={() => void load()} className="ml-2 underline">
            Thử lại
          </button>
        </p>
      )}
      {sorted.length === 0 ? (
        <EmptyState title="Danh sách yêu thích đang trống." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((hotel) => (
            <WishlistHotelCard
              key={hotel.id}
              hotel={hotel}
              onRemove={() => void remove(hotel)}
            />
          ))}
        </div>
      )}
    </AccountLayout>
  );
}

const categories = [
  { id: "all", label: "Tất cả" },
  { id: "resort", label: "Resort biển" },
  { id: "city", label: "Khách sạn thành phố" },
  { id: "villa", label: "Biệt thự & Villa" },
];

function matchesCategory(hotel: WishlistHotel, category: string) {
  if (category === "all") return true;
  const text = `${hotel.name} ${hotel.location}`.toLowerCase();
  if (category === "resort") return /resort|biển|beach|đảo|island/.test(text);
  if (category === "city") return /hotel|khách sạn|city|thành phố|central/.test(text);
  return /villa|biệt thự/.test(text);
}

function countCategory(items: WishlistHotel[], category: string) {
  return category === "all" ? items.length : items.filter((item) => matchesCategory(item, category)).length;
}
