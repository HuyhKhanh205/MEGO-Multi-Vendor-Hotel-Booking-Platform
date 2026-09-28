package com.mego.backend.model.enums;

/**
 * Phương thức thanh toán được hỗ trợ.
 */
public enum PaymentMethod {
    /** Cổng thanh toán VNPay (nội địa Việt Nam). */
    VNPAY,
    /** Chuyển khoản ngân hàng. */
    BANK_TRANSFER,
    /** Thanh toán trực tiếp tại khách sạn khi check-in. */
    PAY_AT_HOTEL
}
