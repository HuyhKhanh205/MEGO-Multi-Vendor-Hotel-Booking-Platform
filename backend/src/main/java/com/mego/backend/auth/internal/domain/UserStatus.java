package com.mego.backend.auth.internal.domain;

/**
 * Trạng thái tài khoản người dùng.
 */
public enum UserStatus {
    /** Tài khoản hoạt động bình thường. */
    ACTIVE,
    /** Tài khoản bị khóa (vi phạm, admin can thiệp). */
    LOCKED,
    /** Chờ xác minh email sau khi đăng ký. */
    PENDING_VERIFICATION
}
