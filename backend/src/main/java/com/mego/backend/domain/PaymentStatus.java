package com.mego.backend.domain;

/**
 * Trạng thái của giao dịch thanh toán.
 */
public enum PaymentStatus {
    /** Đang chờ xử lý / chờ cổng thanh toán phản hồi. */
    PENDING,
    /** Thanh toán thành công. */
    SUCCESS,
    /** Thanh toán thất bại. */
    FAILED,
    /** Đã hoàn tiền toàn bộ. */
    REFUNDED,
    /** Đã hoàn tiền một phần. */
    PARTIALLY_REFUNDED
}
