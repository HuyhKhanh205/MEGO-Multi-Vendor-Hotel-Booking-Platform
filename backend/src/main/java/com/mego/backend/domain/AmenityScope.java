package com.mego.backend.domain;

/**
 * Phạm vi áp dụng của tiện nghi (Amenity).
 * Xác định tiện nghi thuộc về khách sạn (cơ sở vật chất chung)
 * hay thuộc về từng loại phòng.
 */
public enum AmenityScope {
    /** Tiện nghi của khách sạn (hồ bơi, gym, spa, đỗ xe...). */
    HOTEL,
    /** Tiện nghi trong phòng (TV, minibar, điều hòa, bồn tắm...). */
    ROOM
}
