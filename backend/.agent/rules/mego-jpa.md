# Quy ước JPA cho MEGO backend

- Package gốc là `com.mego.backend`. Tổ chức code theo module: entity ở `<module>.internal.entity`, enum ở `<module>.internal.domain`, repository ở `<module>.internal.repository`; API, DTO công khai và event công khai đặt trực tiếp trong package gốc của module.
- Module chỉ được tham chiếu package gốc của module khác. Không import bất kỳ class nào từ `internal` của module khác.
- `shared` chỉ chứa hạ tầng và kiểu dữ liệu dùng chung; không phụ thuộc module nghiệp vụ.
- Dùng `jakarta.persistence.*` và Lombok (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`). Không dùng `@Data` trên entity.
- Entity kế thừa `shared.persistence.BaseEntity` để dùng `Long` IDENTITY, `createdAt` và `updatedAt` từ JPA Auditing.
- Không tạo quan hệ JPA xuyên module. Tham chiếu dữ liệu module khác bằng ID như `userId`, `hotelId`; gọi API công khai của module đó khi cần thông tin.
- `@ManyToOne` và `@OneToOne` trong cùng module luôn dùng `FetchType.LAZY`. Khởi tạo collection rỗng; dùng `Set` khi cần loại trùng và `List` khi cần thứ tự.
- Không sinh `equals`/`hashCode` có thể duyệt quan hệ lazy. Dùng implementation theo ID của `BaseEntity`; `toString` không đọc lazy field.
- Enum lưu bằng `@Enumerated(EnumType.STRING)`.
- Tiền dùng `BigDecimal` với precision/scale phù hợp (thường `15,2`). Ngày lưu trú dùng `LocalDate`, thời điểm dùng `LocalDateTime`.
- Tên bảng và cột dùng snake_case; bảng có tiền tố module, ví dụ `auth_users`. Khai báo `@Table` với index và unique constraint khi nghiệp vụ cần.
- Tránh `CascadeType.REMOVE` và `orphanRemoval` với dữ liệu có thể được booking tham chiếu. Hotel, RoomType và User dùng xóa mềm khi nghiệp vụ yêu cầu.
- Viết comment tiếng Việt ngắn cho entity và field nghiệp vụ; thêm Bean Validation phù hợp.
- Giữ thay đổi trong đúng module được yêu cầu, không thêm TODO hoặc placeholder.
