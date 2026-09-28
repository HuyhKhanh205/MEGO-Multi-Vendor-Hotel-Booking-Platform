package com.mego.backend.domain;

/**
 * Trạng thái yêu cầu hoàn tiền.
 */
public enum RefundStatus {
    /** Đang chờ admin/hệ thống xử lý. */
    PENDING,
    /** Đã xử lý hoàn tiền thành công. */
    PROCESSED,
    /** Yêu cầu hoàn tiền bị từ chối. */
    REJECTED
}
