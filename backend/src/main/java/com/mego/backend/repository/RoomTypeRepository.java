package com.mego.backend.repository;

import com.mego.backend.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho {@link RoomType}.
 */
@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    /**
     * Lấy các loại phòng đang hoạt động của khách sạn.
     * Dùng cho trang chi tiết khách sạn và tìm kiếm.
     */
    List<RoomType> findByHotelIdAndActiveTrue(Long hotelId);

    /** Lấy tất cả loại phòng của khách sạn (kể cả inactive – dùng cho partner dashboard). */
    List<RoomType> findByHotelId(Long hotelId);
}
