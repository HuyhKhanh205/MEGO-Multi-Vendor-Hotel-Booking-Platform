package com.mego.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Response đơn giản chỉ chứa message – dùng cho các API không trả data phức tạp
 * (gửi OTP thành công, resend OTP...).
 */
@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
}
