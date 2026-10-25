package com.mego.backend.hotel.internal.repository;

import com.mego.backend.hotel.internal.entity.Hotel;
import com.mego.backend.hotel.internal.domain.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link Hotel}.
 *
 * <p>Extends {@link JpaSpecificationExecutor} để hỗ trợ tìm kiếm động
 * (theo destination, khoảng giá, số sao, tiện nghi...) kết hợp phân trang.</p>
 *
 * <p>Tìm kiếm phức tạp (multi-filter) sẽ được xây dựng bằng {@code Specification<Hotel>}
 * ở tầng Service, không cần viết query cứng ở đây.</p>
 */
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>,
        JpaSpecificationExecutor<Hotel> {

    /** Tìm khách sạn theo slug (cho trang chi tiết SEO-friendly). */
    Optional<Hotel> findBySlug(String slug);

    /** Kiểm tra slug đã tồn tại chưa. */
    boolean existsBySlug(String slug);

    /**
     * Lấy danh sách khách sạn của một đối tác (phân trang).
     * Dùng cho dashboard partner.
     */
    Page<Hotel> findByPartnerProfileId(Long partnerProfileId, Pageable pageable);

    /**
     * Lấy danh sách khách sạn theo trạng thái duyệt (phân trang).
     * Dùng cho trang quản trị admin.
     */
    Page<Hotel> findByApprovalStatus(ApprovalStatus approvalStatus, Pageable pageable);

    /**
     * Lấy danh sách khách sạn đang hoạt động của một đối tác.
     * Dùng khi đối tác tạo voucher/payout.
     */
    Page<Hotel> findByPartnerProfileIdAndActiveTrue(Long partnerProfileId, Pageable pageable);
}
