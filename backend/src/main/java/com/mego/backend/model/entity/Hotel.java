package com.mego.backend.model.entity;

import com.mego.backend.model.base.BaseEntity;
import com.mego.backend.model.enums.ApprovalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Khách sạn / cơ sở lưu trú đăng ký trên nền tảng MeGo.
 * <p>
 * Quy ước xóa mềm: KHÔNG xóa vật lý – dùng {@code active = false} hoặc
 * {@code approvalStatus = SUSPENDED} để ngừng hoạt động, bảo toàn FK với Booking.
 * </p>
 */
@Entity
@Table(
        name = "hotels",
        indexes = {
                @Index(name = "idx_hotel_destination", columnList = "destination_id"),
                @Index(name = "idx_hotel_partner", columnList = "partner_profile_id"),
                @Index(name = "idx_hotel_approval", columnList = "approval_status"),
                @Index(name = "idx_hotel_star", columnList = "star_rating"),
                @Index(name = "idx_hotel_slug", columnList = "slug"),
                @Index(name = "idx_hotel_active", columnList = "active")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_hotel_slug", columnNames = "slug")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel extends BaseEntity {

    /** Đối tác sở hữu khách sạn. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_profile_id", nullable = false)
    private PartnerProfile partnerProfile;

    /** Điểm đến mà khách sạn thuộc về. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    /** Tên khách sạn. */
    @NotBlank
    @Size(max = 200)
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    /** Slug URL-friendly (vd: "vinpearl-ha-noi-2024"). */
    @NotBlank
    @Size(max = 200)
    @Column(name = "slug", nullable = false, length = 200)
    private String slug;

    /** Địa chỉ cụ thể của khách sạn. */
    @Column(name = "address", length = 500)
    private String address;

    /** Vĩ độ tọa độ khách sạn (precision 10, scale 7 ~ độ chính xác cm). */
    @Column(name = "latitude", precision = 10, scale = 7)
    private BigDecimal latitude;

    /** Kinh độ tọa độ khách sạn. */
    @Column(name = "longitude", precision = 10, scale = 7)
    private BigDecimal longitude;

    /**
     * Xếp hạng sao (1–5).
     * Validated bằng @Min/@Max; lưu là int.
     */
    @Min(1) @Max(5)
    @Column(name = "star_rating", nullable = false)
    private int starRating;

    /** Mô tả khách sạn (hỗ trợ HTML/Markdown, TEXT không giới hạn ký tự). */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Giờ nhận phòng sớm nhất (vd: "14:00"). Lưu dạng String cho linh hoạt. */
    @Column(name = "check_in_time", length = 10)
    private String checkInTime;

    /** Giờ trả phòng muộn nhất (vd: "12:00"). */
    @Column(name = "check_out_time", length = 10)
    private String checkOutTime;

    /** Khoảng cách từ khách sạn đến trung tâm thành phố (km). */
    @Column(name = "distance_to_center_km", precision = 6, scale = 2)
    private BigDecimal distanceToCenterKm;

    /** Trạng thái duyệt của admin – mặc định PENDING khi đăng ký. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    /** Lý do từ chối (nếu approvalStatus = REJECTED). */
    @Column(name = "reject_reason", length = 1000)
    private String rejectReason;

    /**
     * Cờ hoạt động – xóa mềm: khi partner ẩn khách sạn thì active = false.
     * Booking hiện tại vẫn còn FK hợp lệ.
     */
    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    /**
     * Điểm đánh giá trung bình (tính toán từ bảng Review).
     * precision=3, scale=2 → tối đa 9.99 (thực tế 1.00–5.00).
     * Cập nhật định kỳ bằng scheduled job hoặc sau mỗi review.
     */
    @Builder.Default
    @Column(name = "avg_rating", precision = 3, scale = 2)
    private BigDecimal avgRating = BigDecimal.ZERO;

    /** Tổng số đánh giá đã được duyệt. */
    @Builder.Default
    @Column(name = "review_count", nullable = false)
    private int reviewCount = 0;

    // -----------------------------------------------------------------------
    // Quan hệ @ManyToMany với Amenity (Hotel là owning side)
    // -----------------------------------------------------------------------

    /**
     * Danh sách tiện nghi của khách sạn.
     * Hotel là owning side → @JoinTable khai báo ở đây.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "hotel_amenities",
            joinColumns = @JoinColumn(name = "hotel_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    // -----------------------------------------------------------------------
    // Quan hệ @OneToMany với HotelImage (cascade PERSIST/MERGE, KHÔNG REMOVE)
    // -----------------------------------------------------------------------

    /**
     * Danh sách ảnh của khách sạn.
     * Cascade PERSIST/MERGE: lưu/update ảnh cùng hotel.
     * Không dùng CASCADE.REMOVE – ảnh xóa riêng để tránh mất dữ liệu.
     */
    @OneToMany(mappedBy = "hotel", cascade = {CascadeType.PERSIST, CascadeType.MERGE},
               fetch = FetchType.LAZY, orphanRemoval = false)
    @OrderBy("sortOrder ASC, id ASC")
    @Builder.Default
    private List<HotelImage> images = new ArrayList<>();

    // -----------------------------------------------------------------------
    // Quan hệ @OneToOne với HotelPolicy (inverse side, LAZY)
    // -----------------------------------------------------------------------

    /**
     * Chính sách khách sạn (check-in/out, huỷ phòng...).
     * mappedBy ở đây – HotelPolicy là owning side (giữ FK).
     */
    @OneToOne(mappedBy = "hotel", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private HotelPolicy policy;

    // -----------------------------------------------------------------------
    // Helper methods – đồng bộ hai chiều
    // -----------------------------------------------------------------------

    /** Thêm ảnh và đồng bộ quan hệ hai chiều. */
    public void addImage(HotelImage image) {
        images.add(image);
        image.setHotel(this);
    }

    /** Xóa ảnh và đồng bộ quan hệ hai chiều. */
    public void removeImage(HotelImage image) {
        images.remove(image);
        image.setHotel(null);
    }

    /** Thêm tiện nghi vào khách sạn. */
    public void addAmenity(Amenity amenity) {
        amenities.add(amenity);
    }

    /** Xóa tiện nghi khỏi khách sạn. */
    public void removeAmenity(Amenity amenity) {
        amenities.remove(amenity);
    }
}
