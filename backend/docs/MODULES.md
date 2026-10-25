# MEGO backend modules

The backend is a modular monolith under `com.mego.backend`. Each business module owns its controllers, services, repositories, entities, and DTOs under `internal`. Types in a module's root package form the API that other modules may use.

## Module responsibilities and current contents

| Module | Responsibility | Current contents |
| --- | --- | --- |
| `shared` | Common technical infrastructure such as configuration, security, persistence support, exceptions, and shared response DTOs. It must not depend on a business module. | Shared configuration, JWT classes, exception handling, `MessageResponse`, and `BaseEntity`. This module is open to support shared infrastructure access. |
| `auth` | Registration, login, email OTP verification, user identity, and the public user lookup contract. | Auth endpoints and services, user/OTP entities and repositories, Auth DTOs, `AuthApi`, and `UserSummary`. |
| `partner` | Partner accounts and profiles, partner staff, and partner-owned business details. | Existing partner entities and repositories. Cross-module references to users and hotels are stored as IDs. |
| `hotel` | Hotel catalog, destinations, amenities, hotel images, policies, and hotel approval state. | Existing hotel catalog entities and repositories. |
| `inventory` | Room types, physical rooms, room images, and dated room availability. | Existing inventory entities and repositories. Hotel and amenity references are IDs. |
| `booking` | Booking lifecycle, reservation records, cancellation, and guest booking history. | Currently has the existing `BookingStatus` enum only. |
| `payment` | Payment attempts, payment methods, refunds, and partner payouts. | Currently has the existing payment, refund, and payout enums only. |
| `promotion` | Vouchers, discounts, and customer loyalty tiers and points. | Existing `MemberTier` entity/repository and voucher/points enums. |
| `review` | Customer reviews, moderation, and hotel rating summaries. | Currently has the existing `ReviewStatus` enum only. |
| `notification` | Email, in-app, or other notifications triggered by business events. | Currently has the existing `NotificationType` enum only. |
| `support` | Customer support tickets and their lifecycle. | Currently has the existing `TicketStatus` enum only. |

Several entities and repositories for partner, hotel, inventory, and promotion were already present before this refactor; they were moved into their owning module. No new business workflows were added for those modules.

## Boundary rules

1. A module may import another module only through types in that module's root package, such as `AuthApi` and `UserSummary`. Never import a type from another module's `internal` package.
2. Keep controllers, services, repositories, entities, and module-specific DTOs inside their module's `internal` packages.
3. Do not create JPA entity relationships across modules. Store the other module's identifier, such as `userId`, `hotelId`, or `partnerProfileId`.
4. Do not inject another module's repository. Call that module's API for synchronous reads or commands.
5. Publish a public event from the owning module when another module should react independently. Event payloads should contain IDs and values, not JPA entities.
6. Keep `shared` limited to infrastructure and generic types. It must not depend on business modules.
7. Prefix new database tables and join tables with their owning module, for example `auth_users` or `inventory_room_types`. The existing entity tables were given module prefixes in this refactor. If a deployed database later contains data, use a reviewed schema migration when table names change; `ddl-auto=update` does not move old rows to renamed tables.

`ModularityTests` runs `ApplicationModules.of(BackendApplication.class).verify()` during `clean verify` to check internal package access and module dependency cycles.

## Calling another module's API

This example belongs in a future module's internal service. The consumer depends only on Auth's root API and receives a DTO rather than the `User` entity.

```java
@Service
@RequiredArgsConstructor
class BookingCustomerService {

    private final AuthApi authApi;

    UserSummary requireUser(Long userId) {
        return authApi.findUserSummaryById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
```

## Publishing and receiving an event

Illustrative example for future booking and notification workflows. The event type is declared in the publishing module's root package so subscribers do not depend on its `internal` package.

```java
// booking/BookingConfirmedEvent.java
public record BookingConfirmedEvent(Long bookingId, Long userId, Long hotelId) {}
```

```java
// In a booking service, after confirming the booking
publisher.publishEvent(new BookingConfirmedEvent(bookingId, userId, hotelId));
```

```java
// In notification/internal, in a separate notification service
@Async
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
void on(BookingConfirmedEvent event) {
    // Build and send the notification using the event's IDs.
}
```

## Checklist for a new module

1. Create `com.mego.backend.<module>` and place public APIs, DTO records, and public events directly in that root package.
2. Add `internal/controller`, `internal/service`, `internal/repository`, `internal/entity`, and `internal/dto` packages only as needed.
3. Keep other modules from importing `internal` types. Use an API for synchronous interaction and public events for independent reactions.
4. Replace cross-module JPA relations with ID fields. Keep JPA relations inside the module that owns both entities.
5. Prefix entity, collection, and join table names with the module name.
6. Add the module and its responsibility to this document, then run `./mvnw clean verify`. The Modulith verification test must pass before committing.

`shared` is intentionally open for common infrastructure. Keep business modules closed and expose only the types in their root packages.
