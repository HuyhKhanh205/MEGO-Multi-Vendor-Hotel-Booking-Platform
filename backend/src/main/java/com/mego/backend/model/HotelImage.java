package com.mego.backend.model;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Ảnh minh họa của khách sạn.
 * Mỗi khách sạn có thể có nhiều ảnh; một ảnh được đánh dấu là ảnh đại diện (primaryImage = true).
 */
@Entity
@Table(
        name = "hotel_images",
        indexes = {
                @Index(name = "idx_hotel_img_hotel", columnList = "hotel_id"),
                @Index(name = "idx_hotel_img_primary", columnList = "hotel_id, is_primary")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelImage extends BaseEntity {

    /** Khách sạn sở hữu ảnh này. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    /** URL đầy đủ của ảnh (Cloudinary / S3). */
    @NotBlank
    @Column(name = "url", nullable = false, length = 1000)
    private String url;

    /** Chú thích ảnh (optional). */
    @Column(name = "caption", length = 255)
    private String caption;

    /**
     * Cờ ảnh đại diện – hiển thị ở danh sách tìm kiếm.
     * Cột DB: {@code is_primary} (snake_case theo quy ước).
     */
    @Builder.Default
    @Column(name = "is_primary", nullable = false)
    private boolean primaryImage = false;

    /** Thứ tự hiển thị trong gallery (ASC). */
    @Builder.Default
    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;
}
