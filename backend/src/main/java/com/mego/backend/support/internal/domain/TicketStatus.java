package com.mego.backend.support.internal.domain;

/**
 * Trạng thái của ticket hỗ trợ khách hàng.
 */
public enum TicketStatus {
    /** Ticket mới, chưa có nhân viên xử lý. */
    OPEN,
    /** Đang được nhân viên hỗ trợ xử lý. */
    IN_PROGRESS,
    /** Đã giải quyết, chờ khách hàng xác nhận. */
    RESOLVED,
    /** Đã đóng (khách hàng xác nhận hoặc hết thời gian). */
    CLOSED
}
