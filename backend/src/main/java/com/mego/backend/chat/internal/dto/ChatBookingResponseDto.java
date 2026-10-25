package com.mego.backend.chat.internal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Kết quả trả về sau khi người dùng hoàn tất đặt phòng từng bước trên Chatbox.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatBookingResponseDto {

    private boolean success;
    private String bookingCode;
    private String message;
    private String hotelId;
    private String hotelName;
    private String roomId;
    private String roomName;
    private String checkIn;
    private String checkOut;
    private int nights;
    private int rooms;
    private BigDecimal pricePerNight;
    private BigDecimal totalAmount;
    private int remainingAvailableRooms;
}
