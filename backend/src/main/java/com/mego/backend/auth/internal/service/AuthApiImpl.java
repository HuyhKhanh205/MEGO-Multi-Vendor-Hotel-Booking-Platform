package com.mego.backend.auth.internal.service;

import com.mego.backend.auth.AuthApi;
import com.mego.backend.auth.UserSummary;
import com.mego.backend.auth.internal.entity.User;
import com.mego.backend.auth.internal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
class AuthApiImpl implements AuthApi {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<UserSummary> findUserSummaryById(Long userId) {
        return userRepository.findById(userId).map(this::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long userId) {
        return userRepository.existsById(userId);
    }

    private UserSummary toSummary(User user) {
        return new UserSummary(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
