package com.mego.backend.booking.internal.domain;

/**
 * Vòng đời của một đơn đặt phòng.
 */
public enum BookingStatus {
    /** Đã tạo booking, đang chờ thanh toán (giữ phòng tạm thời ~10 phút). */
    PENDING_PAYMENT,
    /** Đã thanh toán thành công, booking được xác nhận. */
    CONFIRMED,
    /** Khách đã check-in. */
    CHECKED_IN,
    /** Booking hoàn thành (khách đã check-out). */
    COMPLETED,
    /** Booking bị huỷ bởi khách hoặc hệ thống. */
    CANCELLED,
    /** Không đến (no-show). */
    NO_SHOW
}
