package com.mego.backend.config;

import com.mego.backend.model.entity.User;
import com.mego.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Tích hợp Spring Security với database MeGo.
 *
 * <p>Spring Security gọi {@link #loadUserByUsername(String)} khi xử lý
 * đăng nhập (username ở đây là email). Method này load {@link User} từ DB
 * và bọc vào {@link UserDetails} mà Security framework hiểu được.</p>
 *
 * <p>Authorities được map từ {@link com.mego.backend.model.enums.RoleName}
 * với prefix {@code ROLE_} (chuẩn Spring Security).<br>
 * Ví dụ: {@code ROLE_CUSTOMER}, {@code ROLE_PARTNER}, {@code ROLE_ADMIN}.</p>
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Load user bằng email (username = email trong hệ thống MeGo).
     *
     * @param email email đăng nhập
     * @return UserDetails để Spring Security xác thực password và build Authentication
     * @throws UsernameNotFoundException nếu không tìm thấy user với email này
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy tài khoản với email: " + email));

        // Map RoleName → ROLE_<NAME> (chuẩn Spring Security)
        String authority = "ROLE_" + user.getRole().name();

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())   // BCrypt hash
                .authorities(List.of(new SimpleGrantedAuthority(authority)))
                .accountLocked(isLocked(user))
                .disabled(isDisabled(user))
                .build();
    }

    /** Tài khoản bị khóa khi status = LOCKED. */
    private boolean isLocked(User user) {
        return switch (user.getStatus()) {
            case LOCKED -> true;
            default     -> false;
        };
    }

    /** Tài khoản bị disable khi chưa xác minh email. */
    private boolean isDisabled(User user) {
        return !user.isEmailVerified();
    }
}
