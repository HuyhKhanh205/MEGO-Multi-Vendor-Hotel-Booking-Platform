package com.mego.backend.model.entity;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Điểm đến / địa danh du lịch (Hà Nội, Đà Nẵng, Phú Quốc...).
 * Dùng để phân nhóm khách sạn và hỗ trợ tìm kiếm theo vùng.
 */
@Entity
@Table(
        name = "destinations",
        indexes = {
                @Index(name = "idx_dest_slug", columnList = "slug"),
                @Index(name = "idx_dest_province", columnList = "province"),
                @Index(name = "idx_dest_country", columnList = "country")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_dest_slug", columnNames = "slug")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination extends BaseEntity {

    /** Tên điểm đến (hiển thị cho người dùng). */
    @NotBlank
    @Size(max = 150)
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    /** Slug URL-friendly (vd: "ha-noi", "da-nang"). */
    @NotBlank
    @Size(max = 150)
    @Column(name = "slug", nullable = false, length = 150)
    private String slug;

    /** Tỉnh/thành phố trực thuộc. */
    @Size(max = 100)
    @Column(name = "province", length = 100)
    private String province;

    /** Quốc gia (mặc định Việt Nam). */
    @Size(max = 100)
    @Column(name = "country", length = 100)
    private String country;

    /** URL ảnh đại diện của điểm đến. */
    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    /** Mô tả chi tiết điểm đến (hỗ trợ HTML/Markdown). */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Vĩ độ (latitude) của điểm trung tâm điểm đến.
     * precision=10, scale=7 cho độ chính xác ~1cm.
     */
    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    /**
     * Kinh độ (longitude) của điểm trung tâm điểm đến.
     * precision=10, scale=7 cho độ chính xác ~1cm.
     */
    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;
}
