package com.mego.backend.shared.config;

import com.mego.backend.shared.security.JwtTokenValidator;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Cấu hình Spring Security cho MeGo.
 *
 * <h3>Phân quyền endpoint:</h3>
 * <ul>
 *   <li>{@code /api/auth/**}   → public (đăng ký, đăng nhập, verify OTP, resend OTP)</li>
 *   <li>{@code /api/public/**} → public (tìm kiếm khách sạn, xem chi tiết)</li>
 *   <li>{@code GET /api/hotels/**} → public (guest xem thông tin khách sạn)</li>
 *   <li>{@code /api/**}        → yêu cầu JWT hợp lệ</li>
 * </ul>
 *
 * <h3>CORS:</h3>
 * Danh sách origin cho phép đọc từ {@code app.cors.allowed-origins} trong
 * {@code application.properties}. Hỗ trợ credentials vì frontend cần
 * gửi cookie refresh token (nếu dùng sau này).
 */
@Configuration
@EnableWebSecurity
public class AppConfig {

    /**
     * Danh sách origin frontend cho phép.
     * Đọc từ application.properties: {@code app.cors.allowed-origins=http://localhost:3000,...}
     */
    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:5173}")
    private String[] allowedOrigins;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
                                            JwtTokenValidator jwtTokenValidator) throws Exception {
        http
            // Không dùng session (JWT stateless)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Phân quyền endpoint
            .authorizeHttpRequests(auth -> auth

                // ── Public: Auth flow (đăng ký, đăng nhập, OTP) ──────────────
                .requestMatchers("/api/auth/**").permitAll()

                // ── Public: Tìm kiếm & xem khách sạn (guest không cần login) ─
                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hotels/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/destinations/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/room-types/**").permitAll()

                // ── Mọi /api/** khác → phải có JWT ───────────────────────────
                .requestMatchers("/api/**").authenticated()

                // ── Các request không phải /api/** (actuator, swagger...) ─────
                .anyRequest().permitAll()
            )

            // Thêm JWT filter TRƯỚC BasicAuthenticationFilter
            // JwtTokenValidator đã là @Component → inject trực tiếp, không dùng new
            .addFilterBefore(jwtTokenValidator, BasicAuthenticationFilter.class)

            // Tắt CSRF (REST API dùng JWT, không dùng cookie session)
            .csrf(csrf -> csrf.disable())

            // CORS với danh sách origin cụ thể
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    /**
     * CORS Configuration.
     *
     * <p>Dùng danh sách origin cụ thể thay vì wildcard {@code *} vì bật
     * {@code allowCredentials=true}. Hai thứ này không thể dùng cùng nhau
     * theo CORS spec – browser sẽ block.</p>
     */
    private CorsConfigurationSource corsConfigurationSource() {
        return (HttpServletRequest request) -> {
            CorsConfiguration cfg = new CorsConfiguration();

            // Origin cụ thể (đọc từ properties) – tương thích với allowCredentials=true
            cfg.setAllowedOrigins(Arrays.asList(allowedOrigins));

            // Cho phép tất cả HTTP method
            cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

            // Header phổ biến – thêm Authorization để frontend gửi Bearer token
            cfg.setAllowedHeaders(List.of(
                    "Authorization", "Content-Type", "Accept",
                    "X-Requested-With", "Cache-Control"
            ));

            // Cho phép frontend đọc header Authorization từ response (nếu cần)
            cfg.setExposedHeaders(List.of("Authorization"));

            // Cho phép gửi cookie / credentials (dùng khi có refresh token cookie)
            cfg.setAllowCredentials(true);

            // Cache CORS preflight 1 giờ
            cfg.setMaxAge(3600L);

            return cfg;
        };
    }

    /** Bean mã hóa mật khẩu bằng BCrypt (cost factor mặc định = 10). */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean AuthenticationManager – dùng trong AuthService khi gọi
     * {@code authenticationManager.authenticate(token)} lúc login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /** RestTemplate để gọi API bên ngoài (payment gateway, SMS OTP...). */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
