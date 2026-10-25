package com.mego.backend.chat.internal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Request body cho API POST /api/chat.
 * Khớp với interface ChatRequest bên frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDto {

    @NotBlank(message = "Nội dung câu hỏi không được để trống.")
    private String message;

    @Builder.Default
    private List<ChatHistoryItemDto> history = new ArrayList<>();

    /** Vai trò người dùng trên giao diện: GUEST | CUSTOMER | PARTNER | ADMIN. */
    @Builder.Default
    private String role = "GUEST";

    /** Ngôn ngữ phản hồi: "vi" hoặc "en". */
    @Builder.Default
    private String language = "vi";
}
