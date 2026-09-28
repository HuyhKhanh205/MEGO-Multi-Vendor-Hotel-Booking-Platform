package com.mego.backend.model;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Ảnh minh họa của một loại phòng.
 */
@Entity
@Table(
        name = "room_type_images",
        indexes = @Index(name = "idx_rt_img_room_type", columnList = "room_type_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeImage extends BaseEntity {

    /** Loại phòng sở hữu ảnh này. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    /** URL đầy đủ của ảnh. */
    @NotBlank
    @Column(name = "url", nullable = false, length = 1000)
    private String url;

    /** Thứ tự hiển thị trong gallery (ASC). */
    @Builder.Default
    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;
}
