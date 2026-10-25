package com.mego.backend.auth.internal.controller;

import com.mego.backend.auth.internal.dto.request.LoginRequest;
import com.mego.backend.auth.internal.dto.request.RegisterRequest;
import com.mego.backend.auth.internal.dto.request.ResendOtpRequest;
import com.mego.backend.auth.internal.dto.request.VerifyOtpRequest;
import com.mego.backend.auth.internal.dto.response.AuthResponse;
import com.mego.backend.auth.internal.service.AuthService;
import com.mego.backend.shared.dto.MessageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các API xác thực (Authentication) của MeGo.
 *
 * <p>Base path: {@code /api/auth} – toàn bộ endpoint trong class này
 * được cấu hình {@code permitAll()} trong {@link com.mego.backend.shared.config.AppConfig}.</p>
 *
 * <table border="1">
 *   <tr><th>Method</th><th>Path</th><th>Mô tả</th></tr>
 *   <tr><td>POST</td><td>/api/auth/register</td><td>Đăng ký tài khoản, gửi OTP</td></tr>
 *   <tr><td>POST</td><td>/api/auth/verify-otp</td><td>Xác minh OTP, kích hoạt + trả JWT</td></tr>
 *   <tr><td>POST</td><td>/api/auth/resend-otp</td><td>Gửi lại OTP</td></tr>
 *   <tr><td>POST</td><td>/api/auth/login</td><td>Đăng nhập, trả JWT</td></tr>
 * </table>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // -----------------------------------------------------------------------
    // POST /api/auth/register
    // -----------------------------------------------------------------------

    /**
     * Đăng ký tài khoản mới.
     *
     * <p>Request body: {@link RegisterRequest} – email, password, fullName, phone.<br>
     * Kết quả: tạo user {@code PENDING_VERIFICATION} + gửi OTP tới email.</p>
     *
     * <p>Response: 201 Created + message hướng dẫn nhập OTP.</p>
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponse(
                        "Đăng ký thành công! Vui lòng kiểm tra email " + req.getEmail()
                        + " và nhập mã OTP để kích hoạt tài khoản."));
    }

    // -----------------------------------------------------------------------
    // POST /api/auth/verify-otp
    // -----------------------------------------------------------------------

    /**
     * Xác minh OTP đăng ký.
     *
     * <p>Request body: email + otp (6 chữ số).<br>
     * Nếu đúng → kích hoạt tài khoản + trả JWT (đăng nhập luôn).</p>
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest req) {
        AuthResponse response = authService.verifyOtp(req);
        return ResponseEntity.ok(response);
    }

    // -----------------------------------------------------------------------
    // POST /api/auth/resend-otp
    // -----------------------------------------------------------------------

    /**
     * Gửi lại OTP xác minh email (khi OTP cũ hết hạn).
     *
     * <p>Vô hiệu OTP cũ → tạo và gửi OTP mới.</p>
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<MessageResponse> resendOtp(@Valid @RequestBody ResendOtpRequest req) {
        authService.resendOtp(req.getEmail());
        return ResponseEntity.ok(new MessageResponse(
                "Đã gửi lại mã OTP tới " + req.getEmail() + ". Mã có hiệu lực trong 10 phút."));
    }

    // -----------------------------------------------------------------------
    // POST /api/auth/login
    // -----------------------------------------------------------------------

    /**
     * Đăng nhập bằng email + password.
     *
     * <p>Request body: {@link LoginRequest} – email, password.<br>
     * Response: JWT token + thông tin user.</p>
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }
}
