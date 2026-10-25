package com.mego.backend.shared.security;

/**
 * Hằng số JWT – giữ lại để tương thích code cũ.
 *
 * ⚠️  SECRET_KEY KHÔNG còn được đọc từ System.getenv() trực tiếp ở đây nữa
 *      (dễ gây NullPointerException khi env chưa set).
 *      Giá trị thực được inject qua @Value("${jwt.secret}") trong
 *      {@link JwtProvider} và {@link JwtTokenValidator}.
 */
public class JWT_CONSTANT {

    /**
     * @deprecated Dùng @Value("${jwt.secret}") thay thế để tránh NPE.
     *             Giữ lại field này để không break code cũ đang import.
     */
    @Deprecated(since = "MeGo refactor", forRemoval = true)
    public static final String SECRET_KEY =
            System.getenv("JWT_SECRET") != null
                    ? System.getenv("JWT_SECRET")
                    : "mego-dev-secret-key-change-in-production-min-32-chars";

    public static final String JWT_HEADER = "Authorization";
}
