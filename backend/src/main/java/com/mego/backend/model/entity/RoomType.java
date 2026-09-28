package com.mego.backend.model.entity;

import com.mego.backend.model.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Loại phòng của khách sạn (Phòng Standard, Deluxe, Suite...).
 * <p>
 * Xóa mềm bằng {@code active = false} – KHÔNG xóa vật lý khi còn Booking tham chiếu.
 * </p>
 */
@Entity
@Table(
        name = "room_types",
        indexes = {
                @Index(name = "idx_room_type_hotel", columnList = "hotel_id"),
                @Index(name = "idx_room_type_active", columnList = "hotel_id, active")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomType extends BaseEntity {

    /** Khách sạn chứa loại phòng này. */
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    /** Tên loại phòng (Standard, Deluxe, Suite, Family...). */
    @NotBlank
    @Size(max = 150)
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    /** Mô tả chi tiết loại phòng. */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** Diện tích phòng (m²). */
    @Column(name = "area_m2", precision = 6, scale = 2)
    private BigDecimal areaM2;

    /** Số người lớn tối đa. */
    @Min(1)
    @Column(name = "max_adults", nullable = false)
    private int maxAdults;

    /** Số trẻ em tối đa (không tính phụ thu). */
    @Min(0)
    @Column(name = "max_children", nullable = false)
    private int maxChildren;

    /** Loại giường (King, Queen, Twin, Double, Single...). */
    @Size(max = 100)
    @Column(name = "bed_type", length = 100)
    private String bedType;

    /**
     * Giá cơ bản mỗi đêm (VND).
     * RoomInventory có thể ghi đè theo ngày cụ thể.
     */
    @NotNull
    @DecimalMin("0.00")
    @Column(name = "base_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal basePrice;

    /** Tổng số phòng vật lý thuộc loại này. */
    @Min(0)
    @Column(name = "total_rooms", nullable = false)
    private int totalRooms;

    /**
     * Cờ hoạt động – xóa mềm.
     * {@code false} = ẩn loại phòng, không nhận đặt mới.
     */
    @Builder.Default
    @Column(name = "active", nullable = false)
    private boolean active = true;

    // -----------------------------------------------------------------------
    // @ManyToMany với Amenity (RoomType là owning side)
    // -----------------------------------------------------------------------

    /** Tiện nghi trong phòng (TV, minibar, điều hòa...). */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "room_type_amenities",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    // -----------------------------------------------------------------------
    // @OneToMany với RoomTypeImage (cascade PERSIST/MERGE)
    // -----------------------------------------------------------------------

    /** Danh sách ảnh minh họa loại phòng. */
    @OneToMany(mappedBy = "roomType",
               cascade = {CascadeType.PERSIST, CascadeType.MERGE},
               fetch = FetchType.LAZY,
               orphanRemoval = false)
    @OrderBy("sortOrder ASC, id ASC")
    @Builder.Default
    private List<RoomTypeImage> images = new ArrayList<>();

    // -----------------------------------------------------------------------
    // Helper methods
    // -----------------------------------------------------------------------

    /** Thêm tiện nghi phòng. */
    public void addAmenity(Amenity amenity) {
        amenities.add(amenity);
    }

    /** Xóa tiện nghi phòng. */
    public void removeAmenity(Amenity amenity) {
        amenities.remove(amenity);
    }

    /** Thêm ảnh và đồng bộ hai chiều. */
    public void addImage(RoomTypeImage image) {
        images.add(image);
        image.setRoomType(this);
    }

    /** Xóa ảnh và đồng bộ hai chiều. */
    public void removeImage(RoomTypeImage image) {
        images.remove(image);
        image.setRoomType(null);
    }
}
