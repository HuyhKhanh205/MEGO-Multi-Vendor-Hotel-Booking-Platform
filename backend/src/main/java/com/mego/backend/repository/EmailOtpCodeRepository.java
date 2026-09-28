package com.mego.backend.repository;

import com.mego.backend.model.EmailOtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link EmailOtpCode} – mã OTP xác minh email.
 */
@Repository
public interface EmailOtpCodeRepository extends JpaRepository<EmailOtpCode, Long> {

    /**
     * Lấy OTP mới nhất, còn hạn và chưa dùng cho email.
     * Sắp xếp DESC theo createdAt để lấy lần gửi gần nhất.
     */
    @Query("""
            SELECT o FROM EmailOtpCode o
            WHERE o.email = :email
              AND o.used = false
              AND o.expiredAt > CURRENT_TIMESTAMP
            ORDER BY o.createdAt DESC
            LIMIT 1
            """)
    Optional<EmailOtpCode> findLatestValidOtp(@Param("email") String email);

    /**
     * Vô hiệu hóa tất cả OTP cũ của email (trước khi gửi OTP mới).
     * Tránh dùng mã cũ sau khi đã resend.
     */
    @Modifying
    @Query("UPDATE EmailOtpCode o SET o.used = true WHERE o.email = :email AND o.used = false")
    void invalidateAllByEmail(@Param("email") String email);
}
