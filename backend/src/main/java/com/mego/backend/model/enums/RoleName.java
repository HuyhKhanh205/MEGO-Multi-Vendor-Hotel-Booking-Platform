package com.mego.backend.model.enums;

/**
 * Vai trò của người dùng trong hệ thống MeGo.
 * Guest (khách vãng lai) không có tài khoản nên không có trong enum này.
 */
public enum RoleName {
    /** Khách hàng thông thường – đặt phòng, đánh giá. */
    CUSTOMER,
    /** Đối tác – sở hữu và quản lý khách sạn. */
    PARTNER,
    /** Nhân viên của đối tác – được đối tác tạo tài khoản, phạm vi giới hạn. */
    PARTNER_STAFF,
    /** Quản trị viên hệ thống. */
    ADMIN
}
