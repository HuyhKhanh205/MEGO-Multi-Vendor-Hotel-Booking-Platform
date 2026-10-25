package com.mego.backend.inventory.internal.entity;

import com.mego.backend.shared.persistence.BaseEntity;
import com.mego.backend.inventory.internal.domain.RoomStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Phòng vật lý – đơn vị cụ thể trong khách sạn (Phòng 101, 202...).
 * <p>
 * Phân biệt với {@link RoomType} (loại phòng – trừu tượng) và
 * {@link RoomInventory} (tồn kho theo ngày).
 * </p>
 * Unique constraint: mỗi số phòng chỉ tồn tại một lần trong cùng loại phòng.
 */
@Entity
@Table(
        name = "inventory_rooms",
        indexes = {
                @Index(name = "idx_room_room_type", columnList = "room_type_id"),
                @Index(name = "idx_room_status", columnList = "status")
        },
        uniqueConstraints = @UniqueConstraint(
                name = "uq_room_type_number",
                columnNames = {"room_type_id", "room_number"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends BaseEntity {

    /** Loại phòng mà phòng vật lý này thuộc về. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    /** Số phòng (vd: "101", "2A", "Suite-05"). */
    @NotBlank
    @Size(max = 20)
    @Column(name = "room_number", nullable = false, length = 20)
    private String roomNumber;

    /** Tầng của phòng. */
    @Column(name = "floor")
    private Integer floor;

    /** Trạng thái hiện tại của phòng vật lý. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 20)
    private RoomStatus status = RoomStatus.AVAILABLE;
}
