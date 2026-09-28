package com.mego.backend.repository;

import com.mego.backend.model.entity.Amenity;
import com.mego.backend.model.enums.AmenityScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository cho {@link Amenity}.
 */
@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    /** Lấy tất cả tiện nghi theo phạm vi (HOTEL hoặc ROOM). */
    List<Amenity> findByScope(AmenityScope scope);

    /** Lấy tất cả tiện nghi theo phạm vi và nhóm phân loại. */
    List<Amenity> findByScopeAndCategory(AmenityScope scope, String category);
}
