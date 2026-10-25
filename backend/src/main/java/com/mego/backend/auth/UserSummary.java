package com.mego.backend.auth;

/** Public user data returned to other modules without exposing the JPA entity. */
public record UserSummary(Long id, String email, String fullName, String role) {
}
