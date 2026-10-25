package com.mego.backend.auth.internal.repository;

import com.mego.backend.auth.internal.entity.EmailOtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository cho {@link EmailOtpCode} – mã OTP xác minh email.
 */
@Repository
public interface EmailOtpCodeRepository extends JpaRepository<EmailOtpCode, Long> {

    /**
     * Lấy OTP mới nhất, còn hạn và chưa dùng cho email.
     * Sắp xếp DESC theo createdAt để lấy lần gửi gần nhất.
     *
     * <p>Lưu ý: truyền {@code now} từ Java thay vì dùng {@code CURRENT_TIMESTAMP} của DB.
     * Vì Hibernate cấu hình {@code hibernate.jdbc.time_zone=UTC}, giá trị {@code expiredAt}
     * được quy đổi sang UTC khi lưu; nếu so với giờ của DB (có thể là GMT+7) sẽ lệch 7 tiếng
     * và OTP luôn bị coi là hết hạn. Truyền tham số giúp hai vế được quy đổi giống nhau.</p>
     */
    @Query("""
            SELECT o FROM EmailOtpCode o
            WHERE o.email = :email
              AND o.used = false
              AND o.expiredAt > :now
            ORDER BY o.createdAt DESC
            LIMIT 1
            """)
    Optional<EmailOtpCode> findLatestValidOtp(@Param("email") String email,
                                              @Param("now") LocalDateTime now);

    /**
     * Vô hiệu hóa tất cả OTP cũ của email (trước khi gửi OTP mới).
     * Tránh dùng mã cũ sau khi đã resend.
     */
    @Modifying
    @Query("UPDATE EmailOtpCode o SET o.used = true WHERE o.email = :email AND o.used = false")
    void invalidateAllByEmail(@Param("email") String email);
}
