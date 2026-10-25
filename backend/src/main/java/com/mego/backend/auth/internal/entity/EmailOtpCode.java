package com.mego.backend.auth.internal.entity;

import com.mego.backend.shared.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Lưu mã OTP dùng cho xác minh email khi đăng ký.
 *
 * <p>Mỗi lần gửi OTP tạo một bản ghi mới (hoặc upsert theo email).
 * OTP có hiệu lực trong {@code expiredAt} và chỉ dùng được một lần
 * ({@code used = true} sau khi xác minh thành công).</p>
 */
@Entity
@Table(
        name = "auth_email_otp_codes",
        indexes = {
                @Index(name = "idx_otp_email", columnList = "email"),
                @Index(name = "idx_otp_expires", columnList = "expired_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailOtpCode extends BaseEntity {

    /** Email nhận OTP – cũng là định danh để tìm kiếm. */
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    /** Mã OTP 6 chữ số. */
    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    /** Thời điểm hết hạn (thường = createdAt + 10 phút). */
    @Column(name = "expired_at", nullable = false)
    private LocalDateTime expiredAt;

    /**
     * Đánh dấu OTP đã được sử dụng thành công.
     * OTP đã used = true không thể dùng lại.
     */
    @Builder.Default
    @Column(name = "used", nullable = false)
    private boolean used = false;

    /** Tiện ích: kiểm tra OTP còn hạn và chưa dùng. */
    public boolean isValid() {
        return !used && LocalDateTime.now().isBefore(expiredAt);
    }
}
