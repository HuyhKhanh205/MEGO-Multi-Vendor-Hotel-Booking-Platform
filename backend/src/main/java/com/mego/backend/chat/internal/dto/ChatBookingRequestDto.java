package com.mego.backend.chat.internal.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request đặt phòng nhanh theo từng bước ngay trên khung Chatbox (POST /api/chat/book).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatBookingRequestDto {

    /** ID hạng phòng trong CSDL MariaDB (bảng inventory_room_types). */
    private Long roomDbId;

    /** Slug khách sạn trên frontend. */
    @NotBlank(message = "Thiếu mã khách sạn")
    private String hotelId;

    /** Slug hạng phòng trên frontend. */
    @NotBlank(message = "Thiếu mã hạng phòng")
    private String roomId;

    /** Ngày nhận phòng (YYYY-MM-DD). */
    @NotBlank(message = "Vui lòng chọn ngày nhận phòng")
    private String checkIn;

    /** Ngày trả phòng (YYYY-MM-DD). */
    @NotBlank(message = "Vui lòng chọn ngày trả phòng")
    private String checkOut;

    /** Số lượng phòng đặt. */
    @Min(value = 1, message = "Số lượng phòng tối thiểu là 1")
    private int rooms;

    /** Số khách người lớn. */
    @Min(value = 1, message = "Số lượng khách tối thiểu là 1")
    private int adults;

    /** Số trẻ em đi kèm. */
    private int children;

    /** Họ tên người liên hệ / nhận phòng. */
    @NotBlank(message = "Vui lòng nhập họ tên người nhận phòng")
    private String fullName;

    /** Email nhận xác nhận đặt phòng. */
    @NotBlank(message = "Vui lòng nhập email liên hệ")
    private String email;

    /** Số điện thoại liên hệ. */
    @NotBlank(message = "Vui lòng nhập số điện thoại")
    private String phone;

    /** Yêu cầu đặc biệt (nếu có). */
    private String specialRequest;

    /** Phương thức thanh toán (PAY_AT_HOTEL, MOMO, VNPAY, BANK_TRANSFER). */
    private String paymentMethod;
}
