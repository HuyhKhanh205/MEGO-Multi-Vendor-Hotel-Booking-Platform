package com.mego.backend.domain;

/**
 * Trạng thái hiển thị của đánh giá (review).
 */
public enum ReviewStatus {
    /** Đánh giá hiển thị công khai. */
    VISIBLE,
    /** Đánh giá bị ẩn bởi admin hoặc hệ thống. */
    HIDDEN,
    /** Đánh giá đang bị báo cáo vi phạm, chờ admin xem xét. */
    REPORTED
}
