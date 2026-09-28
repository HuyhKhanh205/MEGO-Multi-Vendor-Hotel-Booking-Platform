package com.mego.backend.model;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

/**
 * Hạng thành viên trong chương trình khách hàng thân thiết (Silver, Gold, Platinum...).
 * Được tham chiếu bởi User – tạo trước để tránh dependency vòng.
 */
@Entity
@Table(
        name = "member_tiers",
        uniqueConstraints = @UniqueConstraint(name = "uq_member_tier_name", columnNames = "name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberTier extends BaseEntity {

    /** Tên hạng (Silver, Gold, Platinum...). */
    @NotNull
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    /** Số điểm tối thiểu để đạt hạng này. */
    @Column(name = "min_points", nullable = false)
    private int minPoints;

    /** Phần trăm giảm giá ưu tiên cho hạng này (0-100). */
    @DecimalMin("0.00") @DecimalMax("100.00")
    @Column(name = "discount_percent", precision = 5, scale = 2)
    private BigDecimal discountPercent;

    /** Mô tả quyền lợi chi tiết (free breakfast, late check-out...). */
    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;
}
