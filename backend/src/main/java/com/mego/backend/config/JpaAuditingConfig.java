package com.mego.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Kích hoạt JPA Auditing cho toàn bộ ứng dụng MeGo.
 * @CreatedDate và @LastModifiedDate trong BaseEntity sẽ được tự động điền.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // Không cần bean bổ sung – Spring Data tự tạo AuditingEntityListener.
}
