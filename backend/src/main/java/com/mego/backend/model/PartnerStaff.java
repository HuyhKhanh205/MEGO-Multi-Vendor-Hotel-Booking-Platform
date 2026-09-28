package com.mego.backend.model;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Nhân viên của đối tác – do đối tác tạo tài khoản, phạm vi quản lý có thể
 * bị giới hạn theo một khách sạn cụ thể.
 */
@Entity
@Table(
        name = "partner_staffs",
        indexes = {
                @Index(name = "idx_pstaff_partner", columnList = "partner_profile_id"),
                @Index(name = "idx_pstaff_user", columnList = "user_id"),
                @Index(name = "idx_pstaff_hotel", columnList = "hotel_id")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_pstaff_user", columnNames = "user_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerStaff extends BaseEntity {

    /** Đối tác (chủ) sở hữu nhân viên này. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_profile_id", nullable = false)
    private PartnerProfile partnerProfile;

    /**
     * Tài khoản User của nhân viên (role = PARTNER_STAFF).
     * 1-1: mỗi User chỉ là nhân viên của một đối tác.
     */
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Chức vụ / vai trò trong khách sạn (Lễ tân, Quản lý...). */
    @Size(max = 100)
    @Column(name = "position", length = 100)
    private String position;

    /**
     * Giới hạn nhân viên theo khách sạn cụ thể (nullable).
     * {@code null} = nhân viên có thể quản lý mọi khách sạn của đối tác.
     * non-null = chỉ quản lý khách sạn này.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}
