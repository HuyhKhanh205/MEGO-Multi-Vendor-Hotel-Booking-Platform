package com.mego.backend.model.enums;

/**
 * Loại giao dịch điểm tích lũy (loyalty points).
 */
public enum PointTransactionType {
    /** Tích điểm sau khi hoàn thành booking. */
    EARN,
    /** Dùng điểm để đổi voucher/ưu đãi. */
    REDEEM,
    /** Điểm hết hạn tự động. */
    EXPIRE,
    /** Điều chỉnh thủ công bởi admin (cộng/trừ). */
    ADJUST
}
