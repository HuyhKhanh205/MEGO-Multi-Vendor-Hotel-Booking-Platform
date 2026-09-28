package com.mego.backend.model.entity;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Tồn kho phòng theo từng ngày – TRÁI TIM của cơ chế chống double booking.
 *
 * <p>Mỗi bản ghi đại diện cho lượng phòng khả dụng của một {@link RoomType}
 * trong một ngày cụ thể. Trước khi confirm booking, service phải kiểm tra và
 * khóa các bản ghi này bằng {@code PESSIMISTIC_WRITE}.</p>
 *
 * <h3>Luồng đặt phòng:</h3>
 * <pre>
 * 1. Lấy tồn kho (PESSIMISTIC_WRITE) cho [checkIn, checkOut).
 * 2. Kiểm tra availableRooms >= qty trong MỌI đêm.
 * 3. Gọi hold(qty) → chuyển availableRooms sang heldRooms.
 * 4. Tạo Booking(PENDING_PAYMENT), holdExpiresAt = now + 10 phút.
 * 5a. Thanh toán thành công → confirm(qty): giảm heldRooms.
 * 5b. Hết giờ / thất bại → releaseHold(qty): trả heldRooms về availableRooms.
 * 6. Khi huỷ booking đã CONFIRMED → restore(qty): tăng availableRooms.
 * </pre>
 *
 * <h3>Ràng buộc bất biến:</h3>
 * <ul>
 *   <li>{@code availableRooms >= 0}</li>
 *   <li>{@code heldRooms >= 0}</li>
 *   <li>{@code availableRooms + heldRooms <= totalRooms}</li>
 * </ul>
 */
@Entity
@Table(
        name = "room_inventories",
        indexes = {
                @Index(name = "idx_inv_room_type_date", columnList = "room_type_id, date")
        },
        uniqueConstraints = @UniqueConstraint(
                name = "uq_inv_room_type_date",
                columnNames = {"room_type_id", "date"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomInventory extends BaseEntity {

    /** Loại phòng mà bản ghi tồn kho này quản lý. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    /** Ngày của bản ghi tồn kho (kiểu ngày, không có giờ). */
    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /** Tổng số phòng thuộc loại này (copy từ RoomType.totalRooms, cho phép override). */
    @Min(0)
    @Column(name = "total_rooms", nullable = false)
    private int totalRooms;

    /**
     * Số phòng hiện còn trống, sẵn sàng đặt.
     * Giảm khi {@link #hold(int)} được gọi; tăng khi {@link #releaseHold(int)} hoặc
     * {@link #restore(int)} được gọi.
     */
    @Min(0)
    @Column(name = "available_rooms", nullable = false)
    private int availableRooms;

    /**
     * Số phòng đang bị giữ chỗ tạm thời (~10 phút chờ thanh toán).
     * Giảm khi {@link #confirm(int)} hoặc {@link #releaseHold(int)} được gọi.
     */
    @Min(0)
    @Column(name = "held_rooms", nullable = false)
    private int heldRooms;

    /**
     * Giá ghi đè theo ngày (nullable → null thì lấy {@link RoomType#getBasePrice()}).
     * Cho phép partner điều chỉnh giá theo mùa / dịp lễ.
     */
    @DecimalMin("0.00")
    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    /**
     * Đóng bán cho ngày này (partner chủ động đóng, không nhận đặt mới).
     * {@code availableRooms} vẫn được tính nhưng {@code closed = true} → từ chối đặt.
     */
    @Builder.Default
    @Column(name = "closed", nullable = false)
    private boolean closed = false;

    /**
     * Phiên bản optimistic lock – Hibernate tự tăng khi update.
     * Ngăn race condition giữa các transaction đồng thời đọc cùng bản ghi.
     */
    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    // -----------------------------------------------------------------------
    // Domain utility methods
    // -----------------------------------------------------------------------

    /**
     * Trả về giá hiệu dụng cho đêm này.
     * Nếu {@code price} không null → dùng giá riêng; ngược lại dùng basePrice của RoomType.
     *
     * @return giá áp dụng cho đêm này (không null nếu roomType.basePrice không null)
     */
    public BigDecimal getEffectivePrice() {
        return (price != null) ? price : roomType.getBasePrice();
    }

    /**
     * Giữ chỗ tạm thời {@code qty} phòng (chờ thanh toán).
     * Chuyển {@code qty} từ {@code availableRooms} sang {@code heldRooms}.
     *
     * @param qty số phòng cần giữ (> 0)
     * @throws IllegalArgumentException nếu qty <= 0
     * @throws IllegalStateException    nếu không đủ phòng trống hoặc ngày đã đóng
     */
    public void hold(int qty) {
        validateQty(qty);
        if (closed) {
            throw new IllegalStateException(
                    "RoomInventory [roomTypeId=%d, date=%s] đã đóng bán.".formatted(
                            roomType.getId(), date));
        }
        if (availableRooms < qty) {
            throw new IllegalStateException(
                    "Không đủ phòng trống. Yêu cầu: %d, còn: %d [roomTypeId=%d, date=%s]".formatted(
                            qty, availableRooms, roomType.getId(), date));
        }
        availableRooms -= qty;
        heldRooms += qty;
        assertInvariant();
    }

    /**
     * Giải phóng giữ chỗ (timeout / thanh toán thất bại).
     * Trả {@code qty} phòng từ {@code heldRooms} về {@code availableRooms}.
     *
     * @param qty số phòng cần giải phóng (> 0)
     * @throws IllegalStateException nếu heldRooms < qty
     */
    public void releaseHold(int qty) {
        validateQty(qty);
        if (heldRooms < qty) {
            throw new IllegalStateException(
                    "heldRooms không đủ để release. Yêu cầu: %d, heldRooms: %d [roomTypeId=%d, date=%s]"
                            .formatted(qty, heldRooms, roomType.getId(), date));
        }
        heldRooms -= qty;
        availableRooms += qty;
        assertInvariant();
    }

    /**
     * Xác nhận đặt phòng thành công – giảm {@code heldRooms} (phòng đã được đặt chính thức).
     * {@code availableRooms} KHÔNG tăng lại vì phòng đã được bán.
     *
     * @param qty số phòng xác nhận (> 0)
     * @throws IllegalStateException nếu heldRooms < qty
     */
    public void confirm(int qty) {
        validateQty(qty);
        if (heldRooms < qty) {
            throw new IllegalStateException(
                    "heldRooms không đủ để confirm. Yêu cầu: %d, heldRooms: %d [roomTypeId=%d, date=%s]"
                            .formatted(qty, heldRooms, roomType.getId(), date));
        }
        heldRooms -= qty;
        assertInvariant();
    }

    /**
     * Hoàn phòng khi huỷ booking đã CONFIRMED.
     * Tăng {@code availableRooms} thêm {@code qty} (tái sử dụng phòng).
     *
     * @param qty số phòng hoàn lại (> 0)
     * @throws IllegalStateException nếu availableRooms + qty > totalRooms
     */
    public void restore(int qty) {
        validateQty(qty);
        if (availableRooms + heldRooms + qty > totalRooms) {
            throw new IllegalStateException(
                    "restore(%d) sẽ vượt quá totalRooms=%d [roomTypeId=%d, date=%s]"
                            .formatted(qty, totalRooms, roomType.getId(), date));
        }
        availableRooms += qty;
        assertInvariant();
    }

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    private void validateQty(int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("qty phải > 0, nhận: " + qty);
        }
    }

    /** Kiểm tra bất biến: availableRooms + heldRooms <= totalRooms và cả hai >= 0. */
    private void assertInvariant() {
        if (availableRooms < 0 || heldRooms < 0) {
            throw new IllegalStateException("availableRooms hoặc heldRooms không được âm.");
        }
        if (availableRooms + heldRooms > totalRooms) {
            throw new IllegalStateException(
                    "available(%d) + held(%d) > total(%d) [roomTypeId=%d, date=%s]"
                            .formatted(availableRooms, heldRooms, totalRooms, roomType.getId(), date));
        }
    }
}
