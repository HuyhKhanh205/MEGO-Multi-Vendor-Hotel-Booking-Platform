package com.mego.backend.repository;

import com.mego.backend.model.Room;
import com.mego.backend.domain.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho {@link Room} (phòng vật lý).
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /** Lấy danh sách phòng vật lý theo loại phòng. */
    List<Room> findByRoomTypeId(Long roomTypeId);

    /** Lấy danh sách phòng theo loại phòng và trạng thái. */
    List<Room> findByRoomTypeIdAndStatus(Long roomTypeId, RoomStatus status);
}
