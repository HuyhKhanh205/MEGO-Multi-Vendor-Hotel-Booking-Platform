package com.mego.backend.inventory.internal.repository;

import com.mego.backend.inventory.internal.entity.RoomInventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository cho {@link RoomInventory} – tồn kho phòng theo ngày.
 *
 * <p><b>Quan trọng:</b> các query có {@code @Lock(PESSIMISTIC_WRITE)} phải được
 * gọi trong một transaction đang chạy (service phải đánh {@code @Transactional}).
 * Không gọi các method này ngoài transaction.</p>
 */
@Repository
public interface RoomInventoryRepository extends JpaRepository<RoomInventory, Long> {

    // -----------------------------------------------------------------------
    // Query đọc thông thường (không lock)
    // -----------------------------------------------------------------------

    /**
     * Lấy tồn kho của một loại phòng trong khoảng ngày [checkIn, checkOut).
     * Dùng {@code date >= checkIn AND date < checkOut} vì checkOut là ngày trả phòng
     * (khách không cần phòng đêm đó).
     *
     * @param roomTypeId ID của loại phòng
     * @param checkIn    ngày nhận phòng (inclusive)
     * @param checkOut   ngày trả phòng (exclusive)
     * @return danh sách bản ghi tồn kho, sắp xếp theo ngày tăng dần
     */
    @Query("""
            SELECT ri FROM RoomInventory ri
            WHERE ri.roomType.id = :roomTypeId
              AND ri.date >= :checkIn
              AND ri.date < :checkOut
            ORDER BY ri.date ASC
            """)
    List<RoomInventory> findByRoomTypeIdAndDateBetween(
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    // -----------------------------------------------------------------------
    // Query khóa ghi PESSIMISTIC_WRITE (chống double booking)
    // -----------------------------------------------------------------------

    /**
     * Lấy tồn kho và đặt khóa ghi (SELECT ... FOR UPDATE) trong khoảng ngày [checkIn, checkOut).
     *
     * <p>Phải gọi trong transaction. Các transaction khác cố ghi cùng bản ghi sẽ bị block
     * cho đến khi transaction này commit hoặc rollback.</p>
     *
     * <p>Kết hợp với {@code @Version} (optimistic lock) để bảo vệ đa tầng:
     * <ul>
     *   <li>PESSIMISTIC_WRITE: block concurrent writers trong cùng cluster node.</li>
     *   <li>@Version: phát hiện conflict khi có nhiều JVM / node cùng ghi.</li>
     * </ul>
     * </p>
     *
     * @param roomTypeId ID của loại phòng
     * @param checkIn    ngày nhận phòng (inclusive)
     * @param checkOut   ngày trả phòng (exclusive)
     * @return danh sách bản ghi bị khóa, sắp xếp theo ngày tăng dần
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT ri FROM RoomInventory ri
            WHERE ri.roomType.id = :roomTypeId
              AND ri.date >= :checkIn
              AND ri.date < :checkOut
            ORDER BY ri.date ASC
            """)
    List<RoomInventory> findAndLockByRoomTypeIdAndDateRange(
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );

    // -----------------------------------------------------------------------
    // Query kiểm tra đủ phòng trong TOÀN BỘ các đêm
    // -----------------------------------------------------------------------

    /**
     * Đếm số đêm trong khoảng [checkIn, checkOut) mà loại phòng vẫn còn đủ chỗ:
     * {@code availableRooms >= quantity} VÀ {@code closed = false}.
     *
     * <p>Service so sánh kết quả với số đêm thực tế ({@code DATEDIFF(checkOut, checkIn)})
     * để xác nhận phòng còn trống trong MỌI đêm:</p>
     *
     * <pre>{@code
     * long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
     * long availableNights = inventoryRepo.countAvailableNights(roomTypeId, checkIn, checkOut, qty);
     * boolean fullyAvailable = availableNights == nights;
     * }</pre>
     *
     * @param roomTypeId ID của loại phòng
     * @param checkIn    ngày nhận phòng (inclusive)
     * @param checkOut   ngày trả phòng (exclusive)
     * @param quantity   số phòng cần đặt
     * @return số đêm trong khoảng thỏa mãn điều kiện (available >= quantity AND NOT closed)
     */
    @Query("""
            SELECT COUNT(ri) FROM RoomInventory ri
            WHERE ri.roomType.id = :roomTypeId
              AND ri.date >= :checkIn
              AND ri.date < :checkOut
              AND ri.availableRooms >= :quantity
              AND ri.closed = false
            """)
    long countAvailableNights(
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("quantity") int quantity
    );
}
