package com.mego.backend.shared.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

/**
 * Filter kiểm tra JWT token trong header Authorization cho mỗi request.
 *
 * <p>Khi token hợp lệ → set Authentication vào SecurityContext.<br>
 * Khi token không hợp lệ / hết hạn → trả về HTTP 401 JSON, KHÔNG throw exception
 * (tránh Spring trả về 500).</p>
 *
 * <p>Các endpoint trong whitelist (auth, public) không cần token và filter
 * sẽ tự bypass qua ({@code filterChain.doFilter()}).</p>
 */
@Component
public class JwtTokenValidator extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Không có token → tiếp tục filter chain (Security rules sẽ xử lý quyền)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            String email       = String.valueOf(claims.get("email"));
            String authorities = String.valueOf(claims.get("authorities"));

            List<GrantedAuthority> auths =
                    AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(email, null, auths);
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (ExpiredJwtException e) {
            sendUnauthorized(response, "Token đã hết hạn, vui lòng đăng nhập lại");
            return; // QUAN TRỌNG: return, không gọi filterChain tiếp
        } catch (SignatureException | MalformedJwtException e) {
            sendUnauthorized(response, "Token không hợp lệ");
            return;
        } catch (Exception e) {
            sendUnauthorized(response, "Lỗi xác thực token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Ghi response HTTP 401 với body JSON.
     * Dùng thay cho việc throw exception để Spring trả về 500.
     */
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}"
        );
    }
}
