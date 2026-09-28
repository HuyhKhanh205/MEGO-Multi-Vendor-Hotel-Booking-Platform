package com.mego.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Service gửi email hệ thống MeGo.
 * Mọi email được gửi bất đồng bộ ({@code @Async}) để không block luồng chính.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Gửi email chứa mã OTP xác minh tài khoản.
     *
     * @param toEmail   địa chỉ email người nhận
     * @param otpCode   mã OTP 6 chữ số
     * @param fullName  tên người nhận (để cá nhân hóa nội dung)
     */
    @Async
    public void sendOtpEmail(String toEmail, String otpCode, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("MeGo – Mã xác minh tài khoản của bạn");
            helper.setText(buildOtpEmailHtml(fullName, otpCode), true); // true = HTML

            mailSender.send(message);
            log.info("[EmailService] Đã gửi OTP tới: {}", toEmail);

        } catch (MessagingException e) {
            log.error("[EmailService] Gửi OTP thất bại tới {}: {}", toEmail, e.getMessage());
            // Không throw để tránh rollback transaction – lỗi email log riêng
        }
    }

    /**
     * Tạo nội dung HTML cho email OTP.
     */
    private String buildOtpEmailHtml(String fullName, String otpCode) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;
                            border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px;">
                  <h2 style="color: #FF6B35; margin-bottom: 4px;">MeGo</h2>
                  <p style="color: #555;">Xin chào <strong>%s</strong>,</p>
                  <p style="color: #555;">Mã xác minh tài khoản MeGo của bạn là:</p>
                  <div style="text-align: center; margin: 24px 0;">
                    <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px;
                                 color: #FF6B35; background: #FFF3EF; padding: 12px 24px;
                                 border-radius: 8px;">%s</span>
                  </div>
                  <p style="color: #888; font-size: 13px;">
                    ⏱ Mã có hiệu lực trong <strong>10 phút</strong>.<br>
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                  </p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
                  <p style="color: #bbb; font-size: 11px; text-align: center;">
                    © 2026 MeGo – Đặt phòng khách sạn trực tuyến
                  </p>
                </div>
                """.formatted(fullName, otpCode);
    }
}
