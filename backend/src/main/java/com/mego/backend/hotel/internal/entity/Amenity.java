package com.mego.backend.hotel.internal.entity;

import com.mego.backend.shared.persistence.BaseEntity;
import com.mego.backend.hotel.internal.domain.AmenityScope;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Tiện nghi của khách sạn hoặc phòng (hồ bơi, wifi, minibar...).
 * Phân biệt bằng {@code scope}: HOTEL (tiện nghi chung) hoặc ROOM (trong phòng).
 */
@Entity
@Table(
        name = "hotel_catalog_amenities",
        indexes = {
                @Index(name = "idx_amenity_scope", columnList = "scope"),
                @Index(name = "idx_amenity_category", columnList = "category")
        },
        uniqueConstraints = @UniqueConstraint(
                name = "uq_amenity_name_scope",
                columnNames = {"name", "scope"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity extends BaseEntity {

    /** Tên tiện nghi (WiFi miễn phí, Hồ bơi, Điều hòa...). */
    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /** Icon identifier (tên class icon hoặc URL SVG). */
    @Column(name = "icon", length = 100)
    private String icon;

    /**
     * Phạm vi: HOTEL (tiện nghi chung của khách sạn) hoặc ROOM (trong từng phòng).
     * Unique cùng với {@code name}.
     */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "scope", nullable = false, length = 10)
    private AmenityScope scope;

    /** Nhóm phân loại (Ăn uống, Giải trí, Tiện nghi phòng...). */
    @Column(name = "category", length = 100)
    private String category;
}
