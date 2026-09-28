package com.mego.backend.config;

import com.mego.backend.dto.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Xử lý tập trung tất cả exception trong MeGo backend.
 * Trả về JSON thống nhất thay vì Spring's default HTML error page.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Lỗi validation Bean Validation (@Valid) – trả 400 với danh sách field lỗi. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(err.getField(), err.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("error", "Dữ liệu không hợp lệ");
        body.put("fields", fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    /** Lỗi nghiệp vụ (email trùng, OTP sai...) – trả 400. */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new MessageResponse(ex.getMessage()));
    }

    /** Tài khoản bị khóa hoặc chưa xác minh – trả 403. */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<MessageResponse> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse(ex.getMessage()));
    }

    /** Sai email/password – trả 401. */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Email hoặc mật khẩu không đúng."));
    }

    /** Tài khoản bị disable (chưa verify email) – Spring Security ném khi login. */
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<MessageResponse> handleDisabled(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Tài khoản chưa xác minh email. Vui lòng nhập mã OTP."));
    }

    /** Tài khoản bị khóa – Spring Security ném khi login. */
    @ExceptionHandler(LockedException.class)
    public ResponseEntity<MessageResponse> handleLocked(LockedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new MessageResponse("Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ."));
    }

    /** Catch-all – lỗi không xác định – trả 500. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Lỗi hệ thống. Vui lòng thử lại sau."));
    }
}