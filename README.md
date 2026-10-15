<div align="center">

# MeGo

### Multi-Vendor Hotel Booking Platform

Nền tảng đặt phòng khách sạn trực tuyến theo mô hình **Direct Booking**, kết nối trực tiếp khách hàng với cơ sở lưu trú.

![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL%20%2F%20MariaDB-4479A1?style=flat&logo=mysql&logoColor=white)

*Find your stay. Make your journey better.*

</div>

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Tính năng chính](#2-tính-năng-chính)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Công nghệ sử dụng](#4-công-nghệ-sử-dụng)
5. [Bắt đầu nhanh](#5-bắt-đầu-nhanh)
6. [Cấu trúc dự án](#6-cấu-trúc-dự-án)
7. [Tài liệu phân tích & thiết kế](#7-tài-liệu-phân-tích--thiết-kế)
8. [Lộ trình phát triển](#8-lộ-trình-phát-triển)
9. [Quy trình đóng góp](#9-quy-trình-đóng-góp)
10. [Đội ngũ thực hiện](#10-đội-ngũ-thực-hiện)
11. [Thông tin học thuật](#11-thông-tin-học-thuật)
12. [Giấy phép](#12-giấy-phép)

---

## 1. Tổng quan

**MeGo** là hệ thống website giới thiệu cơ sở vật chất và đặt phòng trực tuyến, vận hành theo mô hình **multi-vendor**: nhiều đối tác (khách sạn) cùng quản lý thông tin và phòng của mình trên một nền tảng chung, trong khi khách hàng tìm kiếm và đặt phòng trực tiếp, không qua trung gian.

### Mục tiêu

| Mục tiêu | Mô tả |
| --- | --- |
| **Đơn giản** | Giao diện dễ dùng, luồng đặt phòng ngắn gọn |
| **Trực quan** | Giới thiệu khách sạn, phòng và tiện ích rõ ràng, đầy đủ |
| **Thuận tiện** | Hoàn tất tìm kiếm, đặt phòng và thanh toán trực tuyến |
| **Đa vai trò** | Phục vụ khách hàng, đối tác khách sạn và quản trị viên trên cùng một hệ thống |

### Đối tượng sử dụng

| Vai trò | Mô tả |
| --- | --- |
| **Guest** | Khách chưa đăng nhập: xem và tìm kiếm khách sạn |
| **Customer** | Khách hàng đã đăng ký: đặt phòng, thanh toán, quản lý đặt chỗ |
| **Partner** | Chủ/đối tác khách sạn: quản lý thông tin cơ sở lưu trú, phòng và đơn đặt phòng |
| **Admin** | Quản trị viên: quản lý và vận hành toàn hệ thống |

---

## 2. Tính năng chính

> Danh sách dưới đây mô tả phạm vi chức năng theo từng vai trò. Chi tiết xem tại [Use Case Specification](#7-tài-liệu-phân-tích--thiết-kế).

**Guest / Customer**
- Tìm kiếm, lọc và xem thông tin khách sạn, loại phòng
- Đăng ký, đăng nhập, quản lý tài khoản
- Đặt phòng trực tuyến và thanh toán qua **VNPay**
- Theo dõi lịch sử đặt phòng

**Partner**
- Quản lý thông tin khách sạn và loại phòng
- Quản lý đơn đặt phòng của cơ sở mình

**Admin**
- Quản lý người dùng và đối tác
- Giám sát, vận hành hệ thống

**Bảo mật**
- Xác thực và phân quyền theo vai trò (RBAC) với **Spring Security + JWT**

---

## 3. Kiến trúc hệ thống

Hệ thống theo mô hình client–server, tách biệt giao diện và dịch vụ:

```
┌──────────────┐   HTTPS / REST + JWT   ┌──────────────────┐   JPA/Hibernate   ┌────────────────┐
│   Frontend   │ ─────────────────────▶ │     Backend      │ ────────────────▶ │ MySQL/MariaDB  │
│ React + TS   │ ◀───────────────────── │   Spring Boot    │ ◀──────────────── │                │
└──────────────┘                        └────────┬─────────┘                   └────────────────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │    VNPay    │
                                          └─────────────┘
```

---

## 4. Công nghệ sử dụng

| Tầng | Công nghệ |
| --- | --- |
| **Frontend** | ReactJS, TypeScript, HTML5, CSS3, Tailwind CSS / Material UI |
| **Backend** | Java, Spring Boot, Spring Data JPA, Hibernate, Spring Security, JWT |
| **Database** | MariaDB / MySQL |
| **Thanh toán** | VNPay |
| **Công cụ** | IntelliJ IDEA, Visual Studio Code, Git & GitHub, Postman, PlantUML |

---

## 5. Bắt đầu nhanh

### Yêu cầu hệ thống

- JDK `<phiên bản>` trở lên
- Node.js `<phiên bản>` và npm/yarn
- MySQL hoặc MariaDB `<phiên bản>`
- Maven hoặc Gradle (theo cấu hình dự án)

> Điền các phiên bản thực tế mà nhóm đã dùng khi phát triển.

### Cài đặt

```bash
# 1. Clone repository
git clone <repository-url>
cd <project-folder>
```

### Cấu hình môi trường

Không commit thông tin nhạy cảm. Tạo file cấu hình cục bộ (ví dụ `application-local.yml` hoặc `.env`) với các biến sau:

| Biến | Mô tả |
| --- | --- |
| `DB_URL` | Chuỗi kết nối cơ sở dữ liệu |
| `DB_USERNAME` / `DB_PASSWORD` | Tài khoản cơ sở dữ liệu |
| `JWT_SECRET` | Khóa ký JWT |
| `JWT_EXPIRATION` | Thời hạn token |
| `VNPAY_TMN_CODE` / `VNPAY_HASH_SECRET` | Thông tin merchant VNPay (môi trường sandbox) |

### Chạy Backend

```bash
cd backend
# Maven
./mvnw spring-boot:run
```

### Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

> Lệnh và tên thư mục là mẫu, hãy chỉnh theo cấu trúc repo thực tế của nhóm.

---

## 6. Cấu trúc dự án

```
.
├── backend/        # Spring Boot application
├── frontend/       # React + TypeScript application
├── docs/           # Tài liệu phân tích & thiết kế
└── README.md
```

> Cập nhật theo cấu trúc thực tế của repository.

---

## 7. Tài liệu phân tích & thiết kế

Hệ thống được phân tích và thiết kế trước khi triển khai, gồm:

- Use Case Diagram
- Use Case Specification
- Activity Diagram
- Sequence Diagram
- Database Design (ERD)

Các sơ đồ được vẽ bằng **PlantUML**. Tài liệu đặt tại thư mục `docs/`.

---

## 8. Lộ trình phát triển

- [ ] Ứng dụng di động (Mobile)
- [ ] Gợi ý khách sạn bằng AI (tìm kiếm ngữ nghĩa, khách sạn tương tự)
- [ ] Chat trực tuyến giữa khách hàng và đối tác
- [ ] Tích hợp bản đồ và chỉ đường
- [ ] Dashboard phân tích cho Partner và Admin
- [ ] Bổ sung phương thức thanh toán
- [ ] Đa ngôn ngữ và đa tiền tệ

---

## 9. Quy trình đóng góp

1. Tạo nhánh từ `main`: `git checkout -b feature/<ten-tinh-nang>`
2. Commit theo quy ước [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`...
3. Đẩy nhánh và tạo **Pull Request**, mô tả rõ thay đổi và cách kiểm thử
4. Ít nhất một thành viên khác review trước khi merge

---

## 10. Đội ngũ thực hiện

**Nhóm 3**

| STT | MSSV | Họ và tên |
| :-: | --- | --- |
| 1 | 23640731 | Nguyễn Nam Trung Nguyên |
| 2 | 23653111 | Trương Trần Hùng |
| 3 | 23633041 | Chìu Kim Thi |
| 4 | 23659841 | Huỳnh Minh Khánh |
| 5 | 23652611 | Dương Vân Anh |

**Giảng viên hướng dẫn:** TS. Nguyễn Vũ Lâm

---

## 11. Thông tin học thuật

| Hạng mục | Nội dung |
| --- | --- |
| **Đề tài** | Xây dựng hệ thống website giới thiệu cơ sở vật chất và đặt phòng trực tuyến MeGo |
| **Hệ thống** | MeGo |
| **Đơn vị** | Trường Đại học Công nghiệp TP. Hồ Chí Minh (IUH) |
| **Loại hình** | Đồ án môn học |

---

## 12. Giấy phép

Dự án được thực hiện cho mục đích học tập. Chưa áp dụng giấy phép mã nguồn mở. Vui lòng liên hệ nhóm trước khi sử dụng lại mã nguồn.

---

<div align="center">

**MeGo** · Nhóm 3 · Trường Đại học Công nghiệp TP. Hồ Chí Minh (IUH)

</div>
