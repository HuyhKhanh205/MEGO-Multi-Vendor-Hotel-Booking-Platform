package com.mego.backend.domain;

/**
 * Loại giảm giá của voucher.
 */
public enum VoucherType {
    /** Giảm theo phần trăm (%) trên tổng đơn hàng. */
    PERCENT,
    /** Giảm số tiền cố định (VND). */
    FIXED_AMOUNT
}
