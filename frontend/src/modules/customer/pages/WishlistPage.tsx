import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, MenuItem, Rating, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { AccountLayout, EmptyState, PageHeading, panelClass } from "../components/CustomerShared";
import { customerApiMethods } from "../services/customerApi";
import type { WishlistHotel } from "../types/customer.types";
import { formatVnd } from "../utils/formatters";
export default function WishlistPage() {
  const [items, setItems] = useState<WishlistHotel[]>([]); const [sort, setSort] = useState("recent"); const [error, setError] = useState("");
  const load = () => customerApiMethods.getWishlist().then(setItems).catch(() => setError("Không thể tải danh sách yêu thích.")); useEffect(() => { void load(); }, []);
  const sorted = useMemo(() => [...items].sort((a, b) => sort === "price" ? a.priceFrom - b.priceFrom : sort === "rating" ? b.rating - a.rating : b.addedAt.localeCompare(a.addedAt)), [items, sort]);
  const remove = async (hotel: WishlistHotel) => { await customerApiMethods.removeWishlist(hotel.id); setItems((current) => current.filter((item) => item.id !== hotel.id)); toast("Đã bỏ yêu thích", { onClick: () => void customerApiMethods.restoreWishlist(hotel).then(load), autoClose: 5000 }); };
  return <AccountLayout><PageHeading title="Khách sạn yêu thích" /><TextField select size="small" label="Sắp xếp" value={sort} onChange={(event) => setSort(event.target.value)}><MenuItem value="recent">Mới thêm</MenuItem><MenuItem value="price">Giá thấp trước</MenuItem><MenuItem value="rating">Đánh giá cao</MenuItem></TextField>{error && <p role="alert" className="text-red-600">{error} <button onClick={() => void load()}>Thử lại</button></p>}{sorted.length === 0 ? <EmptyState title="Danh sách yêu thích đang trống." /> : <div className="mt-4 grid gap-4 sm:grid-cols-2">{sorted.map((hotel) => <article key={hotel.id} className={panelClass}><img src={hotel.imageUrl} alt={hotel.name} className="h-44 w-full rounded-xl object-cover" /><h2 className="mt-3 font-bold">{hotel.name}</h2><p className="text-sm text-slate-500">{hotel.location} · {"★".repeat(hotel.stars)}</p><div className="flex items-center gap-2"><Rating value={hotel.rating / 2} precision={0.5} readOnly size="small" /><span>{hotel.rating.toFixed(1)}</span></div><p className="font-semibold">Từ {formatVnd(hotel.priceFrom)} / đêm</p><div className="mt-3 flex gap-2"><Button component={Link} to={`/hotels/${hotel.hotelId}`}>Xem chi tiết</Button><Button color="error" onClick={() => void remove(hotel)} aria-label={`Bỏ yêu thích ${hotel.name}`}>Bỏ yêu thích</Button></div></article>)}</div>}</AccountLayout>;
}

