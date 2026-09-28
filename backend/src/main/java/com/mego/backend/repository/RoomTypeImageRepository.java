package com.mego.backend.repository;

import com.mego.backend.model.RoomTypeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho {@link RoomTypeImage}.
 */
@Repository
public interface RoomTypeImageRepository extends JpaRepository<RoomTypeImage, Long> {

    /** Lấy tất cả ảnh của loại phòng, sắp xếp theo sortOrder. */
    List<RoomTypeImage> findByRoomTypeIdOrderBySortOrderAscIdAsc(Long roomTypeId);
}
