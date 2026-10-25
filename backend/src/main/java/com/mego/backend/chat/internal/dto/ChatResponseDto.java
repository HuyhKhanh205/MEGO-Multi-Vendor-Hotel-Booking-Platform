package com.mego.backend.chat.internal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response trả về từ API POST /api/chat.
 * Khớp với interface ChatResponse bên frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDto {

    /** Câu trả lời từ trợ lý AI kết hợp dữ liệu CSDL MeGo. */
    private String reply;

    /** Danh sách Card phòng/khách sạn từ CSDL để người dùng click xem chi tiết hoặc đặt ngay. */
    private List<ChatRoomCardDto> cards;

    /** Cờ báo hiệu tự động mở khung hướng dẫn đặt phòng từng bước nếu người dùng yêu cầu đặt phòng. */
    private Boolean triggerBookingWizard;
}
