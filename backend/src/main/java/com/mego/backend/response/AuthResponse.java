package com.mego.backend.response;
import com.mego.backend.domain.UserRole;
import lombok.Data;

/**
 * @author TrungNguyen
 * @created 4/19/2026
 * @description
 */

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private UserRole role;

}
