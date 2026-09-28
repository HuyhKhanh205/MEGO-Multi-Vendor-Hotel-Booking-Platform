package com.mego.backend.domain;

/**
 * Trạng thái duyệt hồ sơ – dùng chung cho PartnerProfile và Hotel.
 */
public enum ApprovalStatus {
    /** Chờ admin duyệt. */
    PENDING,
    /** Đã được duyệt, đang hoạt động. */
    APPROVED,
    /** Bị từ chối, kèm lý do. */
    REJECTED,
    /** Tạm đình chỉ (vi phạm chính sách). */
    SUSPENDED
}
