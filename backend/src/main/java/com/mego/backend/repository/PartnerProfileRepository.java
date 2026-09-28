package com.mego.backend.repository;

import com.mego.backend.model.entity.PartnerProfile;
import com.mego.backend.model.enums.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link PartnerProfile}.
 */
@Repository
public interface PartnerProfileRepository extends JpaRepository<PartnerProfile, Long> {

    /** Tìm hồ sơ đối tác theo userId (quan hệ 1-1). */
    Optional<PartnerProfile> findByUserId(Long userId);

    /** Kiểm tra user đã có hồ sơ đối tác chưa. */
    boolean existsByUserId(Long userId);

    /** Lấy danh sách đối tác theo trạng thái duyệt (phân trang – dùng cho admin). */
    Page<PartnerProfile> findByApprovalStatus(ApprovalStatus approvalStatus, Pageable pageable);
}
