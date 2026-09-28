package com.mego.backend.repository;

import com.mego.backend.model.User;
import com.mego.backend.domain.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho {@link User}.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Tìm user theo email (dùng cho đăng nhập / kiểm tra trùng). */
    Optional<User> findByEmail(String email);

    /** Kiểm tra email đã tồn tại chưa (dùng khi đăng ký). */
    boolean existsByEmail(String email);

    /** Lấy danh sách user theo vai trò. */
    List<User> findByRole(RoleName role);
}
