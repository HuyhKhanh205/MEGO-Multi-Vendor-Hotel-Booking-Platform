package com.mego.backend.model.enums;

/**
 * Trạng thái của phòng vật lý (Room).
 */
public enum RoomStatus {
    /** Phòng sẵn sàng đón khách. */
    AVAILABLE,
    /** Phòng đang có khách ở. */
    OCCUPIED,
    /** Phòng đang bảo trì, không nhận đặt. */
    MAINTENANCE,
    /** Phòng đang dọn dẹp. */
    CLEANING
}
