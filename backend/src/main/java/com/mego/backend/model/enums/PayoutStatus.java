package com.mego.backend.model.enums;

/**
 * Trạng thái yêu cầu thanh toán/rút tiền cho đối tác.
 */
public enum PayoutStatus {
    /** Yêu cầu mới, chờ admin duyệt. */
    PENDING,
    /** Admin đã duyệt, chờ chuyển khoản. */
    APPROVED,
    /** Đã chuyển khoản thành công cho đối tác. */
    PAID,
    /** Yêu cầu bị từ chối. */
    REJECTED
}
