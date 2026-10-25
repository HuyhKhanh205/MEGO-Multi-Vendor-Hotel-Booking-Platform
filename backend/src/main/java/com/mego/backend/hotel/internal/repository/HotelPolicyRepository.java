package com.mego.backend.hotel.internal.repository;

import com.mego.backend.hotel.internal.entity.HotelPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho {@link HotelPolicy}.
 */
@Repository
public interface HotelPolicyRepository extends JpaRepository<HotelPolicy, Long> {

    /** Lấy chính sách của khách sạn theo hotelId. */
    Optional<HotelPolicy> findByHotelId(Long hotelId);
}
