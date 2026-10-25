package com.mego.backend.chat.internal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Thông tin Card hạng phòng/khách sạn hiển thị trực tiếp trong khung Chatbox.
 * Cho phép người dùng click để xem chi tiết phòng, đặt thủ công, hoặc đặt từng bước ngay trên Chat.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCardDto {

    /** ID bản ghi hạng phòng trong CSDL MariaDB (bảng inventory_room_types). */
    private Long roomDbId;

    /** Slug khách sạn dùng để điều hướng tới /hotels/{hotelId}. */
    private String hotelId;

    /** Tên khách sạn từ bảng hotel_hotels. */
    private String hotelName;

    /** Tên điểm đến/thành phố từ bảng hotel_destinations. */
    private String city;

    /** Địa chỉ khách sạn. */
    private String address;

    /** Số sao khách sạn (1-5). */
    private int stars;

    /** Điểm đánh giá trung bình. */
    private BigDecimal rating;

    /** Slug/ID hạng phòng dùng để điều hướng tới /hotels/{hotelId}/rooms/{roomId}. */
    private String roomId;

    /** Tên hạng phòng từ bảng inventory_room_types. */
    private String roomName;

    /** Loại giường (ví dụ: 1 Giường King). */
    private String bedType;

    /** Diện tích phòng (m²). */
    private BigDecimal areaM2;

    /** Sức chứa tối đa người lớn. */
    private int maxAdults;

    /** Sức chứa tối đa trẻ em. */
    private int maxChildren;

    /** Giá mỗi đêm (VNĐ) từ bảng inventory_room_types / inventory_room_inventories. */
    private BigDecimal pricePerNight;

    /** Số lượng phòng còn trống hôm nay từ bảng inventory_room_inventories. */
    private int availableRooms;

    /** Ảnh đại diện của phòng. */
    private String imageUrl;

    /** Chính sách hủy miễn phí. */
    private boolean freeCancellation;

    /** Hỗ trợ thanh toán tại khách sạn. */
    private boolean payAtHotel;
}
