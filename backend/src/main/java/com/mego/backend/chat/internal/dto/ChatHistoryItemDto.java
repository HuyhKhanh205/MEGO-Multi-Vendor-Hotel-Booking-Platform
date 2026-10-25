package com.mego.backend.chat.internal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Một tin nhắn trong lịch sử hội thoại gửi kèm từ frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryItemDto {

    /** Vai trò: "user" hoặc "assistant". */
    private String role;

    /** Nội dung tin nhắn. */
    private String content;
}
