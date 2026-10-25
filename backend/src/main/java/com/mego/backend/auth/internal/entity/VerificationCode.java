package com.mego.backend.auth.internal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity xác minh OTP tạm thời – sẽ được thay thế bằng PasswordResetToken
 * trong kiến trúc MeGo đầy đủ (lượt 2).
 * Giữ lại file này ở trạng thái tối giản để tránh lỗi biên dịch.
 *
 * @author Nguyễn Nam Trung Nguyên
 * @version 1.0
 * @MSSV 23640731
 * @Class DHKTPM19ATT
 * @since 9/21/2026
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "auth_verification_codes")
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String otp;

    private String email;

    @Column(name = "user_id", unique = true)
    private Long userId;

    // NOTE: Seller reference đã được loại bỏ – không có trong hệ thống MeGo.
    // Sẽ được refactor hoàn toàn ở lượt 2 (entity layer).
}
