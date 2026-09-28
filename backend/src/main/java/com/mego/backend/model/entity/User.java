package com.mego.backend.model.entity;

import com.mego.backend.model.base.BaseEntity;
import com.mego.backend.model.enums.RoleName;
import com.mego.backend.model.enums.UserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Tài khoản người dùng hệ thống MeGo.
 * Bao gồm cả CUSTOMER, PARTNER, PARTNER_STAFF và ADMIN.
 * Xóa mềm bằng trường {@code status} (LOCKED thay vì xóa vật lý).
 */
@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email"),
                @Index(name = "idx_user_role", columnList = "role"),
                @Index(name = "idx_user_status", columnList = "status")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_user_email", columnNames = "email")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    /** Email đăng nhập – duy nhất, dùng làm username. */
    @NotBlank
    @Email
    @Column(name = "email", nullable = false, length = 255)
    private String email;

    /** Mật khẩu đã hash bằng BCrypt – KHÔNG lưu plaintext. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** Họ và tên đầy đủ. */
    @NotBlank
    @Size(max = 150)
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    /** Số điện thoại liên lạc. */
    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    /** URL ảnh đại diện (Cloudinary hoặc S3). */
    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;

    /** Ngày sinh – tùy chọn, dùng cho ưu đãi sinh nhật. */
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    /** Giới tính: MALE / FEMALE / OTHER (lưu String để linh hoạt). */
    @Column(name = "gender", length = 10)
    private String gender;

    /** Vai trò trong hệ thống. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private RoleName role;

    /** Trạng thái tài khoản – xóa mềm bằng cách chuyển sang LOCKED. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "status", nullable = false, length = 30)
    private UserStatus status = UserStatus.PENDING_VERIFICATION;

    /** Cờ xác nhận email (gửi link xác minh sau đăng ký). */
    @Builder.Default
    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    /** Điểm tích lũy loyalty (cộng sau mỗi booking hoàn thành). */
    @Builder.Default
    @Column(name = "loyalty_points", nullable = false)
    private int loyaltyPoints = 0;

    /**
     * Hạng thành viên hiện tại – cập nhật tự động khi loyaltyPoints thay đổi.
     * LAZY để tránh N+1 khi load danh sách user.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_tier_id")
    private MemberTier memberTier;
}
