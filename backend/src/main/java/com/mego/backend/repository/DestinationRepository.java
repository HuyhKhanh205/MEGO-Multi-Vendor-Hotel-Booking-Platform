package com.mego.backend.repository;

import com.mego.backend.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link Destination}.
 */
@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    /** Tìm điểm đến theo slug (dùng cho URL SEO-friendly). */
    Optional<Destination> findBySlug(String slug);

    /** Kiểm tra slug đã tồn tại chưa (dùng khi tạo mới). */
    boolean existsBySlug(String slug);
}
