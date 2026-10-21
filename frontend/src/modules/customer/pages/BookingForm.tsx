import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Header from "../../../components/headerCustomer/header";
import Footer from "../../../components/footerCustomer/footer";
import BookingProgress from "../components/BookingProgress";
import BookingSummary from "../components/BookingSummary";

type GuestType = "myself" | "other";

const initialRoomTotal = 4_000_000;

const BookingForm = () => {
  const [guestType, setGuestType] = useState<GuestType>("myself");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [clubMember, setClubMember] = useState(true);
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("15/10/2025");
  const [checkOut, setCheckOut] = useState("17/10/2025");

  const requests = [
    "Phòng tầng cao yên tĩnh",
    "1 giường đôi lớn (King Bed)",
    "Phòng không hút thuốc",
    "Phòng gần thang máy (nếu có)",
    "Nhận phòng sớm (sau 18:00)",
  ];

  const toggleRequest = (request: string) => {
    setSpecialRequests((current) =>
      current.includes(request)
        ? current.filter((item) => item !== request)
        : [...current, request],
    );
  };

  const discount = promoApplied ? 450_000 : 0;
  const clubDiscount = clubMember ? 50_000 : 0;
  const total = initialRoomTotal - discount - clubDiscount;

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#17233c]">
      {/* <Header /> */}

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <BookingProgress activeStep={1} />

        <div className="mb-6 flex items-start gap-3 rounded-xl bg-[#eaf2ff] px-4 py-3 text-xs text-[#31527f] shadow-sm">
          <InfoOutlinedIcon className="mt-0.5 shrink-0 text-[#1677ff]" sx={{ fontSize: 15 }} />
          <p>
            <strong>Giá ưu đãi đặc quyền</strong> được giữ trong{" "}
            <strong className="text-[#ed4d65]">14:50</strong> phút. Tiết kiệm ngay{" "}
            <strong className="text-[#1677ff]">450.000 VND</strong> khi hoàn tất trước thời hạn.
          </p>
          <span className="ml-auto hidden items-center gap-1 whitespace-nowrap sm:flex">
          <ShieldOutlinedIcon sx={{ fontSize: 14 }} /> Cam kết giữ phòng yên tâm
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_365px]">
          <div className="space-y-5">
            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="1" title="Thông tin người đặt & liên hệ" badge="Đã xác thực" />
              <p className="mb-4 text-[11px] text-[#8b94a7]">
                Xác nhận để đảm bảo thông tin chính xác cho việc đặt phòng.
              </p>

              <div className="mb-4 flex items-center justify-between rounded-lg bg-[#eef3ff] px-3 py-3 text-xs">
                <div>
                  <p className="font-semibold text-[#263b68]">Đã liên kết tài khoản: nguyenvan.trang@mego.vn</p>
                  <p className="mt-1 text-[10px] text-[#7181a1]">Thành viên MeGo từ 15/09/2024</p>
                </div>
                <button className="rounded-md bg-[#dce8ff] px-3 py-1.5 text-[11px] font-semibold text-[#1677ff]">
                  Thay đổi
                </button>
              </div>

              <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Họ và Tên đầy đủ <span className="text-[#ed4d65]">*</span></label>
              <input className="mb-4 w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none" value="Nguyễn Văn An" readOnly />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Email và xác nhận <span className="text-[#ed4d65]">*</span></label>
                  <input className="w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none" value="nguyenvan.trang@mego.vn" readOnly />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4b556b]">Số điện thoại liên hệ <span className="text-[#ed4d65]">*</span></label>
                  <input className="w-full rounded-lg border-0 bg-[#eef2fc] px-3 py-2.5 text-xs text-[#58647c] outline-none" value="+84 0912 345 678" readOnly />
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="2" title="Thông tin khách lưu trú" />
              <p className="mb-4 text-[11px] text-[#8b94a7]">Xác định danh tính người đi cùng để thuận tiện quản lý đặt phòng tại khách sạn.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <GuestChoice active={guestType === "myself"} onClick={() => setGuestType("myself")} title="Tôi là người lưu trú chính" description="Thông tin phòng sẽ gửi đến email của bạn" />
                <GuestChoice active={guestType === "other"} onClick={() => setGuestType("other")} title="Đặt phòng hộ người khác" description="Cần điền thêm thông tin khách" />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#eef3ff] px-3 py-3 text-xs">
                <span><strong className="mr-2 rounded-full bg-[#dbe8ff] px-2 py-1 text-[#4167ad]">2</strong> Khách 2 (Người đi cùng): Trần Thị Mai</span>
                <button className="flex items-center gap-1 font-semibold text-[#1677ff]"><EditIcon sx={{ fontSize: 12 }} /> Đổi tên khách</button>
              </div>
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="3" title="Yêu cầu đặc biệt cho chỗ nghỉ" badge="Không bắt buộc" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {requests.map((request) => (
                  <button key={request} onClick={() => toggleRequest(request)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition ${specialRequests.includes(request) ? "border-[#1677ff] bg-[#eaf2ff] text-[#1677ff]" : "border-transparent bg-[#eef2fc] text-[#56627c]"}`}>
                    <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${specialRequests.includes(request) ? "border-[#1677ff] bg-[#1677ff]" : "border-[#b8c2d9]"}`}>{specialRequests.includes(request) && <CheckIcon className="text-white" sx={{ fontSize: 12 }} />}</span>
                    {request}
                  </button>
                ))}
              </div>
              <button onClick={() => toggleRequest("Nhận phòng sớm")} className={`mt-2 w-full rounded-lg px-3 py-2.5 text-left text-xs ${specialRequests.includes("Nhận phòng sớm") ? "bg-[#eaf2ff] text-[#1677ff]" : "bg-[#eef2fc] text-[#56627c]"}`}>
                <span className="mr-2 inline-block h-3.5 w-3.5 rounded-sm border border-[#b8c2d9] align-middle" /> Nhận phòng sớm (nếu khách sạn có phòng trống sẵn)
              </button>
              <label className="mt-4 block text-xs font-semibold text-[#56627c]">Ghi chú hoặc lời nhắn đặc biệt cho quản gia:</label>
              <textarea className="mt-2 min-h-20 w-full resize-y rounded-lg border-0 bg-[#eef2fc] p-3 text-xs outline-none placeholder:text-[#aab3c7] focus:ring-2 focus:ring-[#b9d2ff]" placeholder="Ví dụ: Phòng có view biển, chuẩn bị giúp tôi khi nhận ngày cưới, cần thêm gối..." />
            </section>

            <section className="rounded-xl bg-white p-4 shadow-[0_3px_15px_rgba(30,60,120,0.06)] sm:p-5">
              <SectionTitle number="4" title="Mã giảm giá & Điểm thưởng MeGo Points" />
              <label className="mb-1 mt-4 block text-xs font-semibold text-[#56627c]">Mã ưu đãi đặc quyền</label>
              <div className="flex rounded-lg bg-[#eef2fc] p-1">
                <LocalOfferOutlinedIcon className="m-2 text-[#7381a2]" sx={{ fontSize: 15 }} />
                <input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="MEGOSEA" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#516995]" />
                <button onClick={() => setPromoApplied(Boolean(promoCode || !promoApplied))} className="rounded-md bg-[#1677ff] px-4 text-xs font-semibold text-white">{promoApplied ? "Đã áp dụng" : "Áp dụng"}</button>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg bg-[#dce9ff] px-3 py-2 text-[11px] text-[#5070ad]">
                <span>◉ MEGOSEA đã áp dụng - 450.000</span><button onClick={() => setPromoApplied(false)} className="font-semibold">Gỡ bỏ</button>
              </div>
              <button onClick={() => setClubMember(!clubMember)} className="mt-3 flex w-full items-center justify-between rounded-lg bg-[#e0f7f4] px-3 py-3 text-left">
                <span><strong className="block text-xs text-[#3f596d]">MeGo Club Points <small className="rounded bg-white px-1 text-[9px] text-[#00a389]">Đang dùng</small></strong><small className="text-[10px] text-[#527a7b]">Sử dụng 500 MeGo Points bạn được giảm trực tiếp <b className="text-[#00a389]">50.000 VND</b></small></span>
                <span className={`relative h-5 w-9 rounded-full ${clubMember ? "bg-[#1677ff]" : "bg-[#b8c2d0]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${clubMember ? "right-0.5" : "left-0.5"}`} /></span>
              </button>
            </section>
          </div>

          <BookingSummary
            checkIn={checkIn}
            checkOut={checkOut}
            total={total}
            roomTotal={initialRoomTotal}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
          />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

const SectionTitle = ({ number, title, badge }: { number: string; title: string; badge?: string }) => (
  <div className="flex items-center gap-2">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1677ff] text-xs font-bold text-white">{number}</span>
    <h2 className="text-sm font-bold text-[#26344f]">{title}</h2>
    {badge && <span className="rounded bg-[#fff1f0] px-1.5 py-0.5 text-[9px] font-semibold text-[#ed4d65]">{badge}</span>}
  </div>
);

const GuestChoice = ({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) => (
  <button onClick={onClick} className={`rounded-lg border p-3 text-left ${active ? "border-[#b8d1ff] bg-[#eef3ff]" : "border-transparent bg-[#f3f5fb]"}`}>
    <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border align-middle ${active ? "border-[#1677ff] bg-[#1677ff]" : "border-[#aeb8ca]"}`}>{active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
    <strong className="text-xs text-[#53617b]">{title}</strong>
    <small className="mt-1 block pl-6 text-[10px] text-[#8d98ad]">{description}</small>
  </button>
);

export default BookingForm;
