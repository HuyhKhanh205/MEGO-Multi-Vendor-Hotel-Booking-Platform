package com.mego.backend.promotion.internal.repository;

import com.mego.backend.promotion.internal.entity.MemberTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link MemberTier}.
 */
@Repository
public interface MemberTierRepository extends JpaRepository<MemberTier, Long> {

    /** Tìm hạng thành viên theo tên (Silver, Gold, Platinum...). */
    Optional<MemberTier> findByName(String name);

    /**
     * Tìm hạng thành viên phù hợp cao nhất cho một mức điểm.
     * Lấy hạng có minPoints <= loyaltyPoints, sắp xếp giảm dần để lấy hạng cao nhất.
     */
    Optional<MemberTier> findFirstByMinPointsLessThanEqualOrderByMinPointsDesc(int loyaltyPoints);
}
