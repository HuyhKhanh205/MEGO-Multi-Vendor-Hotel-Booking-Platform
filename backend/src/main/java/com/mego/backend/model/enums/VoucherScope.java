package com.mego.backend.model.enums;

/**
 * Phạm vi áp dụng của voucher.
 */
public enum VoucherScope {
    /** Voucher toàn sàn – do admin tạo, áp dụng cho mọi khách sạn. */
    PLATFORM,
    /** Voucher của đối tác – chỉ áp dụng cho khách sạn thuộc đối tác đó. */
    PARTNER
}
