package com.mego.backend.auth.internal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request body cho API xác minh OTP sau đăng ký.
 * POST /api/auth/verify-otp
 */
@Data
public class VerifyOtpRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mã OTP không được để trống")
    @Size(min = 6, max = 6, message = "Mã OTP phải là 6 chữ số")
    private String otp;
}
