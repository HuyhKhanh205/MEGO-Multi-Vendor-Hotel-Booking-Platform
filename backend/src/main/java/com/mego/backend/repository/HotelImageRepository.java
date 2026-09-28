package com.mego.backend.repository;

import com.mego.backend.model.entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho {@link HotelImage}.
 */
@Repository
public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {

    /** Lấy tất cả ảnh của khách sạn, sắp xếp theo sortOrder. */
    List<HotelImage> findByHotelIdOrderBySortOrderAscIdAsc(Long hotelId);

    /** Lấy ảnh đại diện (primaryImage = true) của khách sạn. */
    Optional<HotelImage> findByHotelIdAndPrimaryImageTrue(Long hotelId);
}
