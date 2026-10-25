package com.mego.backend.hotel.internal.entity;

import com.mego.backend.shared.persistence.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

/**
 * Chính sách của khách sạn: giờ check-in/out, chính sách huỷ phòng, thú cưng, trẻ em...
 * <p>
 * Quan hệ 1-1 với Hotel. HotelPolicy là owning side (giữ FK {@code hotel_id}).
 * </p>
 */
@Entity
@Table(
        name = "hotel_policies",
        uniqueConstraints = @UniqueConstraint(name = "uq_policy_hotel", columnNames = "hotel_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelPolicy extends BaseEntity {

    /**
     * Khách sạn áp dụng chính sách này.
     * HotelPolicy là owning side – giữ FK hotel_id.
     */
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    /** Giờ nhận phòng sớm nhất (vd: 14:00). */
    @Column(name = "check_in_from")
    private LocalTime checkInFrom;

    /** Giờ nhận phòng muộn nhất (vd: 22:00). */
    @Column(name = "check_in_until")
    private LocalTime checkInUntil;

    /** Giờ trả phòng muộn nhất (vd: 12:00). */
    @Column(name = "check_out_until")
    private LocalTime checkOutUntil;

    /**
     * Số giờ trước check-in được huỷ miễn phí.
     * Vd: 48 = huỷ trước 48 giờ không mất phí.
     */
    @Min(0)
    @Column(name = "free_cancel_before_hours")
    private int freeCancelBeforeHours;

    /**
     * Phí huỷ phòng tính theo % tổng tiền (nếu huỷ muộn).
     * 0 = miễn phí; 100 = mất toàn bộ.
     */
    @DecimalMin("0.00") @DecimalMax("100.00")
    @Column(name = "cancellation_fee_percent", precision = 5, scale = 2)
    private BigDecimal cancellationFeePercent;

    /** Có hỗ trợ hoàn tiền khi huỷ phòng không. */
    @Builder.Default
    @Column(name = "refundable", nullable = false)
    private boolean refundable = true;

    /** Có cho phép thanh toán tại khách sạn (Pay at Hotel) không. */
    @Builder.Default
    @Column(name = "allow_pay_at_hotel", nullable = false)
    private boolean allowPayAtHotel = false;

    /**
     * Yêu cầu admin duyệt thủ công khi khách huỷ phòng
     * (thay vì tự động hoàn tiền – dành cho khách sạn có chính sách đặc biệt).
     */
    @Builder.Default
    @Column(name = "require_manual_cancel_approval", nullable = false)
    private boolean requireManualCancelApproval = false;

    /** Chính sách trẻ em (dưới 12 tuổi ở miễn phí, cần thêm giường phụ...). */
    @Column(name = "child_policy", length = 500)
    private String childPolicy;

    /** Chính sách thú cưng (cho phép / không cho phép / có phụ thu). */
    @Column(name = "pet_policy", length = 500)
    private String petPolicy;

    /** Các quy định khác của khách sạn (không hút thuốc, giờ yên tĩnh...). */
    @Column(name = "other_rules", columnDefinition = "TEXT")
    private String otherRules;
}
