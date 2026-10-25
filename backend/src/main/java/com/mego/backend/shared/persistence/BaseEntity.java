package com.mego.backend.shared.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Lớp cơ sở cho tất cả entity trong hệ thống MeGo.
 * Cung cấp id (tự tăng) và 2 trường audit: createdAt, updatedAt.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    /** Khóa chính, tự tăng (IDENTITY strategy – MariaDB AUTO_INCREMENT). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    /** Thời điểm bản ghi được tạo – do JPA Auditing tự điền, không cập nhật lại. */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Thời điểm bản ghi được cập nhật lần cuối – JPA Auditing tự cập nhật mỗi lần save. */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // -----------------------------------------------------------------------
    // equals / hashCode theo id (null-safe cho entity chưa persist)
    // -----------------------------------------------------------------------

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BaseEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        // Dùng hằng số để tránh thay đổi hash sau khi persist
        return getClass().hashCode();
    }

    /** toString tối giản – KHÔNG tải lazy field để tránh N+1 / StackOverflow. */
    @Override
    public String toString() {
        return getClass().getSimpleName() + "(id=" + id + ")";
    }
}
