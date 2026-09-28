package com.mego.backend.dto.response;

import com.mego.backend.domain.RoleName;
import lombok.Builder;
import lombok.Data;

/**
 * Response trả về sau khi đăng nhập hoặc xác minh OTP thành công.
 */
@Data
@Builder
public class AuthResponse {

    /** JWT token dùng cho các request tiếp theo (đặt vào header Authorization: Bearer <jwt>). */
    private String jwt;

    /** Thông báo kết quả (Register success / Login success). */
    private String message;

    /** Vai trò của user – frontend dùng để điều hướng dashboard phù hợp. */
    private RoleName role;

    /** Email của user đã đăng nhập. */
    private String email;

    /** Tên đầy đủ của user. */
    private String fullName;
}
