# Hợp đồng API cổng Partner (frontend ↔ Spring backend)

Frontend Partner đã gọi sẵn các endpoint dưới đây. Hiện chạy bằng dữ liệu mock vì backend chưa có controller.
Khi backend xong, đặt `VITE_PARTNER_USE_MOCK=false` trong `frontend/.env` là frontend chuyển sang gọi API thật.

## Quy ước chung

- **Base URL:** `VITE_API_BASE_URL`, mặc định `http://localhost:8080/api`.
- **Xác thực:** JWT qua header `Authorization: Bearer <jwt>`, do `apiClient` tự gắn.
- **Phân quyền:** mọi endpoint `/api/partner/**` cần role `PARTNER` hoặc `PARTNER_STAFF`. Backend chỉ trả dữ liệu thuộc `partner_profile` của user trong JWT; khách sạn không thuộc đối tác thì trả **404**.
- **Response:** trả DTO trực tiếp, không bọc `{ success, data }`.
- **Lỗi:** frontend đã xử lý cả 3 dạng mà backend đang dùng:
  - `{ message }`
  - `{ status, error, fields }` (lỗi validation)
  - `{ status, error, message }` (lỗi từ JwtTokenValidator)
- **Kiểu dữ liệu:** tên trường giữ nguyên như entity Java (xem `src/modules/partner/types/backend.types.ts`).
  - `BigDecimal` → number
  - `LocalTime` → `"HH:mm"` hoặc `"HH:mm:ss"`
  - Enum giữ nguyên tên, ví dụ `APPROVED`, `AVAILABLE`.

## Đăng nhập (đã có)

`POST /api/auth/login` trả `AuthResponse`. Với role PARTNER cần có `approvalStatus`, và backend hiện đã trả trường này.
- Đối tác `PENDING` / `REJECTED` / `SUSPENDED` vẫn được đăng nhập.
- Frontend tự đưa nhóm này về trang Theo dõi hồ sơ và chặn trang quản trị.

## Hồ sơ đối tác (P20 / P21)

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| POST | `/api/partner/applications` | public | `multipart/form-data`: part `application` (JSON `OnboardingForm`, có `password`) + file `documents[ID_FRONT]`, `documents[ID_BACK]`, `documents[BUSINESS_LICENSE]`, `documents[FIRE_SAFETY]` (PDF/JPG/PNG ≤ 15MB) | `PartnerApplication` |
| GET | `/api/partner/applications/me` | PARTNER (kể cả chưa duyệt) | – | `PartnerApplication`, hoặc 404 nếu chưa có |

**Xử lý phía backend khi nhận hồ sơ:**
- Tạo `User` (role `PARTNER`) và `PartnerProfile` (`approvalStatus = PENDING`).
- Lưu file, ghi URL vào `partner_documents`.
- Email đã tồn tại thì trả **400**, `message` có chữ "email". Frontend sẽ đưa người dùng về đúng ô email.

`PartnerApplication` gồm:
- thông tin hồ sơ: `code`, `representativeName`, `email`, `propertyName`, `hotelCategory`, `totalRooms`;
- `documents[]` (`category`, `fileName`, `size`, `mimeType`);
- mốc thời gian: `submittedAt`, `slaDueAt`;
- trạng thái: `status` (PartnerApprovalStatus), `rejectReason`;
- `formSnapshot`: dữ liệu form, không gồm mật khẩu.

## Khách sạn (màn Thông tin Khách sạn)

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/partner/hotels` | – | `HotelSummaryDto[]` (`id`, `name`, `slug`, `starRating`, `destinationName`, `approvalStatus`, `active`) |
| GET | `/api/partner/hotels/{id}` | – | `HotelDto` (kèm `amenityIds[]`, `images[]`) |
| PUT | `/api/partner/hotels/{id}` | `HotelUpdateRequest` (`name`, `destinationId`, `address`, `latitude`, `longitude`, `starRating`, `description`, `checkInTime`, `checkOutTime`, `distanceToCenterKm`) | `HotelDto` |
| PUT | `/api/partner/hotels/{id}/amenities` | `{ amenityIds: number[] }` | `HotelDto` |
| PUT | `/api/partner/hotels/{id}/images` | `HotelImageRequest[]` (`url`, `caption`, `primary`, `sortOrder`), thay toàn bộ danh sách | `HotelDto` |
| GET | `/api/partner/hotels/{id}/policy` | – | `HotelPolicyDto` |
| PUT | `/api/partner/hotels/{id}/policy` | `HotelPolicyDto` | `HotelPolicyDto` |
| GET | `/api/destinations` | public | `DestinationDto[]` |
| GET | `/api/amenities?scope=HOTEL\|ROOM` | – | `AmenityDto[]` |

Gợi ý: đối tác sửa thông tin hiển thị thì có thể chuyển `approvalStatus` về `PENDING` để admin duyệt lại. Frontend đã có banner cho trạng thái này.

## Hạng phòng & phòng (màn Loại phòng & Phòng)

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/partner/hotels/{hotelId}/room-types` | – | `RoomTypeDto[]` |
| POST | `/api/partner/hotels/{hotelId}/room-types` | `RoomTypeRequest` (các trường của `RoomTypeDto` trừ `id`, `hotelId`, `images`; thêm `imageUrls: string[]`) | `RoomTypeDto` |
| PUT | `/api/partner/room-types/{id}` | `RoomTypeRequest` | `RoomTypeDto` |
| PATCH | `/api/partner/room-types/{id}/active` | `{ active: boolean }` | `RoomTypeDto` |
| DELETE | `/api/partner/room-types/{id}` | – | 204; xóa kèm các phòng thuộc hạng |
| GET | `/api/partner/hotels/{hotelId}/rooms` | – | `RoomDto[]`, toàn bộ phòng của khách sạn (dùng cho thống kê) |
| GET | `/api/partner/room-types/{id}/rooms` | – | `RoomDto[]` |
| POST | `/api/partner/room-types/{id}/rooms` | `RoomRequest` (`roomNumber`, `floor`, `status`) | `RoomDto`; **400** nếu trùng số phòng (ràng buộc `uq_room_type_number`) |
| PUT | `/api/partner/rooms/{id}` | `RoomRequest` | `RoomDto` |
| DELETE | `/api/partner/rooms/{id}` | – | 204 |

## Giá & tồn kho theo ngày (màn Cấu hình giá phòng, Tồn kho & Đóng/Mở bán)

Dùng bảng `inventory_room_inventories` (entity `RoomInventory`), mỗi dòng là 1 hạng phòng × 1 đêm.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/partner/hotels/{hotelId}/inventory?from=yyyy-MM-dd&to=yyyy-MM-dd` | – | `RoomInventoryDto[]`, đủ mọi hạng phòng × mọi ngày trong khoảng (tối đa 366 ngày) |
| PATCH | `/api/partner/inventory/{id}` | `InventoryUpdateRequest` (`price?`, `availableRooms?`, `closed?`, `version`) | `RoomInventoryDto` |
| POST | `/api/partner/hotels/{hotelId}/inventory/bulk` | `InventoryBulkRequest` | `{ updatedCount }` |

**`RoomInventoryDto`:**
- các trường của entity: `id`, `roomTypeId`, `date`, `totalRooms`, `availableRooms`, `heldRooms`, `price` (null = dùng `basePrice` của hạng phòng), `closed`, `version`;
- thêm `effectivePrice = price ?? roomType.basePrice` để frontend hiển thị.
- **Ngày chưa có dòng trong DB:** backend trả dòng mặc định (`totalRooms = availableRooms = roomType.totalRooms`, `price = null`, `closed = false`), hoặc tạo sẵn khi tạo hạng phòng. Frontend cần đủ ô để vẽ lịch.

**Khóa lạc quan:** PATCH gửi kèm `version` đang hiển thị. Lệch với DB (`@Version`) thì trả **409**; frontend báo "Dữ liệu vừa được cập nhật bởi người khác" và tải lại.

**`InventoryBulkRequest`:**
- phạm vi: `roomTypeIds[]`, `from`, `to`, `weekdays[]` (1 = Thứ Hai … 7 = Chủ nhật, ISO-8601);
- `price?: { mode, value }`:
  - `SET`: đặt giá = value;
  - `PERCENT`: giá hiện tại × (1 + value/100), làm tròn 1.000 ₫, value từ −90 đến 300;
  - `AMOUNT`: giá hiện tại + value;
  - `RESET`: `price = null`.
- `allotment?: { mode, value }`: `SET` đặt `availableRooms = min(value, totalRooms)`; `REDUCE` bớt value phòng (không âm).
- `closed?: boolean`: khóa / mở bán.
- Bỏ qua ngày đã qua và các thứ không chọn. Làm trong 1 transaction: một ô vi phạm thì trả 400, không ô nào bị đổi.

**Ràng buộc (frontend đã kiểm tra, backend nên kiểm tra lại):**
- giá ≥ 50.000 ₫;
- `0 ≤ availableRooms ≤ totalRooms`;
- không sửa ngày đã qua;
- khoảng ngày ≤ 366.

## Nhân viên & phân quyền (màn Nhân viên & Phân quyền)

Chỉ role `PARTNER` (chủ cơ sở) được gọi; `PARTNER_STAFF` nhận **403**. Mọi thao tác lọc theo `partner_profile` của JWT.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/partner/staff` | – | `PartnerStaffDto[]` |
| GET | `/api/partner/staff/{id}` | – | `PartnerStaffDto` |
| POST | `/api/partner/staff` | `StaffRequest` (`fullName`, `email`, `phone`, `position`, `hotelId`, `permissions?`) | `PartnerStaffDto`; **400** nếu email đã tồn tại (message có chữ "email") |
| PUT | `/api/partner/staff/{id}` | `StaffRequest` (bỏ qua `email`) | `PartnerStaffDto` |
| PATCH | `/api/partner/staff/{id}/status` | `{ status: "ACTIVE" \| "LOCKED" }` | `PartnerStaffDto` |
| POST | `/api/partner/staff/{id}/invite` | – | 204; gửi lại email mời (chỉ khi `PENDING_VERIFICATION`) |
| DELETE | `/api/partner/staff/{id}` | – | 204 |
| PUT | `/api/partner/staff/{id}/permissions` | `{ permissions: PartnerPermission[] }` | `PartnerStaffDto` |

**`PartnerStaffDto`:** `id`, `userId`, `fullName`, `email`, `phone` (lấy từ `User`), `position`, `hotelId` (null = mọi cơ sở), `status` (`UserStatus` của User), `lastLoginAt`, `permissions[]`.

**Luồng mời nhân viên (POST):**
- Tạo `User` role `PARTNER_STAFF`, `status = PENDING_VERIFICATION`, chưa có mật khẩu.
- Tạo `PartnerStaff` gắn `partnerProfile` của chủ cơ sở.
- Gửi email có link đặt mật khẩu; nhân viên đặt xong thì chuyển `ACTIVE`.
- Frontend không gửi mật khẩu. Không tạo được trạng thái `ACTIVE` trực tiếp từ `PENDING_VERIFICATION`.

**Đề xuất bổ sung ở backend:**
- `position`: lưu giá trị enum `FRONT_DESK` / `DUTY_MANAGER` / `ACCOUNTANT` / `HOUSEKEEPING`.
- Enum `PartnerPermission` (16 giá trị, xem `backend.types.ts`) và bảng `partner_staff_permissions(staff_id, permission)` (`@ElementCollection`).
- Quyền chỉ dành cho một số vai trò, backend từ chối (400) nếu gửi sai:
  - `BOOKING_CANCEL_NOSHOW`: chỉ Quản lý ca;
  - `FINANCE_REPORT_VIEW`: Kế toán, Quản lý ca;
  - `FINANCE_INVOICE`: chỉ Kế toán;
  - `FINANCE_PAYOUT`: không cấp cho nhân viên (chỉ chủ cơ sở).
- Đổi vai trò (PUT) thì tự gỡ các quyền không còn hợp lệ.
- Cần thêm `GET /api/partner/me` trả role + `permissions` của người đang đăng nhập để ẩn menu theo quyền (frontend chưa làm phần này).
- `lastLoginAt`: cập nhật ở `/api/auth/login` (User chưa có cột này).

## Tổng quan (Dashboard)

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/partner/dashboard?hotelId=&period=TODAY\|LAST_7_DAYS\|THIS_MONTH` | – | `PartnerDashboardData` (`src/modules/partner/types/partner.types.ts`) |
| POST | `/api/partner/sync` | – | `{ syncedAt }` |

`roomStatus` tính từ `inventory_rooms.status`. Doanh thu, lượt đặt và đơn gần nhất cần có module Booking/Payment, hiện frontend vẫn dùng dữ liệu mẫu.

## Lưu ý về dữ liệu seed hiện tại (`ChatDataSeeder`)

- **`partner_profile_id` của 8 khách sạn đang gán cứng 1/2/3.** Hệ quả: tài khoản PENDING sở hữu 3 khách sạn APPROVED, còn Grand Sunrise không thuộc `partner@sunrise-danang.vn`.
  - Mock frontend phân lại theo đúng ý đồ: `partner@sunrise-danang.vn` sở hữu khách sạn 1–3, `partner@mego.vn` sở hữu khách sạn 4–8.
- **Mỗi lần khởi động, seeder ghi đè `approval_status`**, nên trạng thái admin duyệt sẽ mất khi restart.
- **Cột `description` của hạng phòng đang chứa `frontendRoomId|imageUrl`**, nên chuyển ảnh sang bảng `inventory_room_type_images`.
- **Tên "Khu nghỉ dưỡng Лаvender Đà Lạt" có chữ Kirin** (Л, а).
- **Seeder chưa tạo phòng vật lý** (`inventory_rooms`) nên mock frontend tự sinh.
- **Seeder chưa sinh `inventory_room_inventories` và `partner_staffs`.** Mock frontend tự sinh tồn kho theo ngày (chỉ lưu ô bị sửa) và 8 nhân viên mẫu (6 của `partner@sunrise-danang.vn`, 2 của `partner@mego.vn`).
