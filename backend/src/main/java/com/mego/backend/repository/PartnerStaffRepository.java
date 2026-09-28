package com.mego.backend.repository;

import com.mego.backend.model.PartnerStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho {@link PartnerStaff}.
 */
@Repository
public interface PartnerStaffRepository extends JpaRepository<PartnerStaff, Long> {

    /** Lấy danh sách nhân viên của đối tác. */
    List<PartnerStaff> findByPartnerProfileId(Long partnerProfileId);

    /** Lấy danh sách nhân viên được giao cho khách sạn cụ thể. */
    List<PartnerStaff> findByHotelId(Long hotelId);

    /** Tìm nhân viên theo userId (quan hệ 1-1). */
    Optional<PartnerStaff> findByUserId(Long userId);
}
