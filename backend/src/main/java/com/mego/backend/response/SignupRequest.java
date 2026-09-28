package com.mego.backend.response;

import lombok.Data;

/**
 * @author TrungNguyen
 * @created 4/15/2026
 * @description
 */

@Data
public class SignupRequest {

    private String email;
    private String fullName;
    private String phone;
    private String otp;
}
