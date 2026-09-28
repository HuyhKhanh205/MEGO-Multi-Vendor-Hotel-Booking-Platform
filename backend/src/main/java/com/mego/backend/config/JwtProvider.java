package com.mego.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Tạo và parse JWT token cho hệ thống MeGo.
 * Secret key được inject từ {@code application.properties} (jwt.secret)
 * – không còn đọc trực tiếp từ biến môi trường qua static field để tránh NPE.
 */
@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-ms:86400000}")
    private long expirationMs;

    /**
     * Sinh JWT token sau khi xác thực thành công.
     * Payload chứa: email (principal), authorities (vai trò), iat, exp.
     */
    public String generateToken(Authentication auth) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        String roles = populateAuthorities(auth.getAuthorities());

        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    /**
     * Lấy email từ JWT token (dùng trong service để load user hiện tại).
     *
     * @param jwt chuỗi token đầy đủ (có hoặc không có prefix "Bearer ")
     */
    public String getEmailFromJwtToken(String jwt) {
        // Loại bỏ "Bearer " prefix nếu có
        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
        return String.valueOf(claims.get("email"));
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }
}
