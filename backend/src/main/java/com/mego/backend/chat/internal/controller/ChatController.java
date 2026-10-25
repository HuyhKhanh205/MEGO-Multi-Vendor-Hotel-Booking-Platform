package com.mego.backend.chat.internal.controller;

import com.mego.backend.chat.internal.dto.ChatBookingRequestDto;
import com.mego.backend.chat.internal.dto.ChatBookingResponseDto;
import com.mego.backend.chat.internal.dto.ChatRequestDto;
import com.mego.backend.chat.internal.dto.ChatResponseDto;
import com.mego.backend.chat.internal.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller cho Trợ lý AI Nghiệp vụ Khách sạn MeGo.
 *
 * <ul>
 *   <li>{@code POST /api/chat} — Truy vấn nghiệp vụ khách sạn & trả về danh sách Card phòng.</li>
 *   <li>{@code POST /api/chat/book} — Đặt phòng theo từng bước ngay trên khung Chatbox & trừ tồn kho CSDL.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(@Valid @RequestBody ChatRequestDto request) {
        ChatResponseDto response = chatService.processChat(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/book")
    public ResponseEntity<ChatBookingResponseDto> bookFromChat(@Valid @RequestBody ChatBookingRequestDto request) {
        ChatBookingResponseDto response = chatService.createBookingFromChat(request);
        return ResponseEntity.ok(response);
    }
}
