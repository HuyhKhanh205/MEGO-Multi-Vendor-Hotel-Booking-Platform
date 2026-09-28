package com.mego.backend.model.enums;

/**
 * Phân loại thông báo trong hệ thống.
 */
public enum NotificationType {
    /** Thông báo liên quan đến đặt phòng (xác nhận, huỷ, check-in...). */
    BOOKING,
    /** Thông báo liên quan đến thanh toán. */
    PAYMENT,
    /** Thông báo khuyến mãi, voucher. */
    PROMOTION,
    /** Thông báo hệ thống (bảo trì, cập nhật chính sách). */
    SYSTEM,
    /** Thông báo liên quan đến đánh giá (phản hồi từ đối tác, ẩn đánh giá...). */
    REVIEW
}
