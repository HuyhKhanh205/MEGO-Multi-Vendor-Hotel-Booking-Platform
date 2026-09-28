package com.mego.backend.controller;

import iuh.fit.backend.domain.UserRole;
import iuh.fit.backend.repository.UserRepository;
import iuh.fit.backend.request.LoginOtpRequest;
import iuh.fit.backend.request.LoginRequest;
import iuh.fit.backend.response.ApiResponse;
import iuh.fit.backend.response.AuthResponse;
import iuh.fit.backend.response.SignupRequest;
import iuh.fit.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author TrungNguyen
 * @created 4/15/2026
 * @description
 */

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest req) throws Exception {
        String jwt = authService.createUser(req);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Register success");
        res.setRole(UserRole.CUSTOMER);

        return ResponseEntity.ok(res);
    }

    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sendOtpHandler(@RequestBody LoginOtpRequest req) throws Exception {
        authService.sentLoginOtp(req.getEmail(), req.getRole());

        ApiResponse res = new ApiResponse();
        res.setMessage("otp sent successfully");


        return ResponseEntity.ok(res);
    }

    @PostMapping("/signing")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) throws Exception {
        AuthResponse authResponse = authService.signing(req);

        return ResponseEntity.ok(authResponse);
    }
}
