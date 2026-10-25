package com.mego.backend.auth.internal.service;

import com.mego.backend.shared.security.JwtProvider;
import com.mego.backend.auth.internal.domain.RoleName;
import com.mego.backend.auth.internal.domain.UserStatus;
import com.mego.backend.auth.internal.dto.request.LoginRequest;
import com.mego.backend.auth.internal.dto.request.RegisterRequest;
import com.mego.backend.auth.internal.dto.request.VerifyOtpRequest;
import com.mego.backend.auth.internal.dto.response.AuthResponse;
import com.mego.backend.auth.internal.entity.EmailOtpCode;
import com.mego.backend.auth.internal.entity.User;
import com.mego.backend.auth.internal.repository.EmailOtpCodeRepository;
import com.mego.backend.auth.internal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

/**
 * Service xử lý nghiệp vụ đăng ký và đăng nhập cho MeGo.
 *
 * <h3>Luồng đăng ký:</h3>
 * <ol>
 *   <li>Kiểm tra email chưa tồn tại.</li>
 *   <li>Tạo User với status {@code PENDING_VERIFICATION}.</li>
 *   <li>Tạo OTP 6 số, lưu DB, gửi email bất đồng bộ.</li>
 *   <li>Client gọi {@code /verify-otp} → kích hoạt tài khoản → trả JWT.</li>
 * </ol>
 *
 * <h3>Luồng đăng nhập:</h3>
 * <ol>
 *   <li>Xác thực email + password qua {@link AuthenticationManager}.</li>
 *   <li>Kiểm tra tài khoản ACTIVE và emailVerified.</li>
 *   <li>Trả JWT ngay (không cần OTP lần 2).</li>
 * </ol>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private final UserRepository          userRepository;
    private final EmailOtpCodeRepository  otpRepository;
    private final PasswordEncoder         passwordEncoder;
    private final AuthenticationManager   authenticationManager;
    private final JwtProvider             jwtProvider;
    private final EmailService            emailService;
    private final JdbcTemplate            jdbcTemplate;

    // -----------------------------------------------------------------------
    // ĐĂNG KÝ – Bước 1: Tạo tài khoản & gửi OTP
    // -----------------------------------------------------------------------

    /**
     * Tạo tài khoản mới và gửi OTP xác minh email.
     *
     * @throws IllegalArgumentException nếu email đã tồn tại
     */
    @Transactional
    public void register(RegisterRequest req) {
        // 1. Kiểm tra email trùng
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email '" + req.getEmail() + "' đã được đăng ký.");
        }

        // 2. Tạo User với status PENDING_VERIFICATION
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .role(RoleName.CUSTOMER)
                .status(UserStatus.PENDING_VERIFICATION)
                .emailVerified(false)
                .loyaltyPoints(0)
                .build();
        userRepository.save(user);
        log.info("[AuthService] Đã tạo user: {}", req.getEmail());

        // 3. Gửi OTP xác minh
        sendOtp(req.getEmail(), req.getFullName());
    }

    // -----------------------------------------------------------------------
    // ĐĂNG KÝ – Bước 2: Xác minh OTP → kích hoạt + trả JWT
    // -----------------------------------------------------------------------

    /**
     * Xác minh OTP đăng ký. Nếu đúng → kích hoạt tài khoản → trả JWT.
     *
     * @throws IllegalArgumentException nếu OTP sai, hết hạn, hoặc email không tồn tại
     */
    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest req) {
        // 1. Tìm OTP hợp lệ
        EmailOtpCode otpCode = otpRepository.findLatestValidOtp(req.getEmail(), LocalDateTime.now())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại."));

        // 2. So sánh OTP
        if (!otpCode.getOtpCode().equals(req.getOtp())) {
            throw new IllegalArgumentException("Mã OTP không đúng.");
        }

        // 3. Đánh dấu OTP đã dùng
        otpCode.setUsed(true);
        otpRepository.save(otpCode);

        // 4. Kích hoạt tài khoản
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại."));
        user.setStatus(UserStatus.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);
        log.info("[AuthService] Kích hoạt tài khoản: {}", req.getEmail());

        // 5. Tạo JWT và trả về
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null,
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()))
        );
        String jwt = jwtProvider.generateToken(authentication);

        return AuthResponse.builder()
                .jwt(jwt)
                .message("Xác minh thành công! Chào mừng bạn đến với MeGo.")
                .role(user.getRole())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    // -----------------------------------------------------------------------
    // GỬI LẠI OTP
    // -----------------------------------------------------------------------

    /**
     * Gửi lại OTP cho email (vô hiệu OTP cũ trước khi gửi mới).
     *
     * @throws IllegalArgumentException nếu email không tồn tại hoặc đã xác minh
     */
    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại."));

        if (user.isEmailVerified()) {
            throw new IllegalArgumentException("Tài khoản đã được xác minh rồi.");
        }

        sendOtp(email, user.getFullName());
    }

    // -----------------------------------------------------------------------
    // ĐĂNG NHẬP
    // -----------------------------------------------------------------------

    /**
     * Đăng nhập bằng email + password. Trả JWT nếu thành công.
     *
     * @throws org.springframework.security.core.AuthenticationException nếu sai thông tin
     * @throws IllegalStateException nếu tài khoản chưa xác minh hoặc bị khóa
     */
    public AuthResponse login(LoginRequest req) {
        // 1. Kiểm tra email tồn tại trước để đưa ra thông báo rõ ràng
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Email hoặc mật khẩu không đúng."));

        // 2. Kiểm tra trạng thái tài khoản
        if (!user.isEmailVerified() || user.getStatus() == UserStatus.PENDING_VERIFICATION) {
            throw new IllegalStateException(
                    "Tài khoản chưa xác minh email. Vui lòng kiểm tra hộp thư và nhập mã OTP.");
        }
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new IllegalStateException(
                    "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        }

        // 3. Xác thực email + password (Spring Security kiểm tra password hash)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // 4. Sinh JWT
        String jwt = jwtProvider.generateToken(authentication);
        log.info("[AuthService] Đăng nhập thành công: {}", req.getEmail());

        String approvalStatus = null;
        if (user.getRole() == RoleName.PARTNER && user.getId() != null) {
            try {
                java.util.List<String> statuses = jdbcTemplate.queryForList(
                        "SELECT approval_status FROM partner_profiles WHERE user_id = ? LIMIT 1",
                        String.class,
                        user.getId()
                );
                if (!statuses.isEmpty()) {
                    approvalStatus = statuses.get(0);
                }
            } catch (Exception ex) {
                log.debug("[AuthService] Không lấy được approval_status cho partner {}: {}", user.getEmail(), ex.getMessage());
            }
        }

        return AuthResponse.builder()
                .jwt(jwt)
                .message("Đăng nhập thành công!")
                .role(user.getRole())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .approvalStatus(approvalStatus)
                .build();
    }

    // -----------------------------------------------------------------------
    // Private helper
    // -----------------------------------------------------------------------

    /**
     * Tạo OTP mới, vô hiệu OTP cũ, lưu DB, gửi email (async).
     */
    private void sendOtp(String email, String fullName) {
        // Vô hiệu OTP cũ chưa dùng
        otpRepository.invalidateAllByEmail(email);

        // Tạo OTP mới bằng SecureRandom (an toàn hơn java.util.Random)
        String otp = generateSecureOtp();

        EmailOtpCode otpCode = EmailOtpCode.builder()
                .email(email)
                .otpCode(otp)
                .expiredAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .used(false)
                .build();
        otpRepository.save(otpCode);

        // Gửi email (bất đồng bộ – không block luồng chính)
        emailService.sendOtpEmail(email, otp, fullName);
        log.info("[AuthService] Đã gửi OTP tới: {}", email);
    }

    /** Tạo chuỗi OTP 6 chữ số bằng SecureRandom (không dùng java.util.Random). */
    private String generateSecureOtp() {
        SecureRandom random = new SecureRandom();
        int otpValue = 100000 + random.nextInt(900000); // 100000 – 999999
        return String.valueOf(otpValue);
    }
}
