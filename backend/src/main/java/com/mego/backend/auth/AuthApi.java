package com.mego.backend.auth;

import java.util.Optional;

/** Public contract for other modules that need basic user information. */
public interface AuthApi {

    Optional<UserSummary> findUserSummaryById(Long userId);

    boolean existsById(Long userId);
}
