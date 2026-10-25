package com.mego.backend.chat.internal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mego.backend.chat.internal.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Dịch vụ Trợ lý Tư vấn Đặt phòng & Nghiệp vụ Khách sạn MeGo.
 * Văn phong lịch thiệp, sang trọng chuẩn Concierge 5 sao, không chứa ký tự Markdown thừa.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final JdbcTemplate jdbcTemplate;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String configuredGeminiKey;

    private static final String DEFAULT_ROOM_IMAGE =
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80";

    // ─── Records biểu diễn dữ liệu truy vấn từ CSDL MariaDB ──────────────────

    public record HotelRow(
            Long id,
            String name,
            String slug,
            String destinationName,
            String province,
            String address,
            int starRating,
            BigDecimal avgRating,
            int reviewCount,
            String checkInTime,
            String checkOutTime,
            BigDecimal distanceToCenterKm,
            String description,
            Integer freeCancelHours,
            BigDecimal cancelFeePercent,
            Boolean refundable,
            Boolean allowPayAtHotel,
            String childPolicy,
            String petPolicy
    ) {}

    public record RoomRow(
            Long id,
            Long hotelId,
            String name,
            String description,
            BigDecimal areaM2,
            int maxAdults,
            int maxChildren,
            String bedType,
            BigDecimal basePrice,
            int totalRooms,
            int availableRooms,
            int heldRooms
    ) {
        public String frontendRoomId() {
            if (description != null && description.contains("|")) {
                return description.split("\\|", 2)[0].trim();
            }
            return "room-" + id;
        }

        public String imageUrl() {
            if (description != null && description.contains("|")) {
                String url = description.split("\\|", 2)[1].trim();
                if (url.startsWith("http")) return url;
            }
            return DEFAULT_ROOM_IMAGE;
        }
    }

    public record MemberTierRow(
            String name,
            int minPoints,
            BigDecimal discountPercent,
            String benefits
    ) {}

    public record SystemStats(
            long totalHotels,
            long approvedHotels,
            long pendingHotels,
            long totalRoomTypes,
            long totalPhysicalRooms,
            long totalAvailableToday,
            long totalPartners,
            long pendingPartners,
            long totalUsers
    ) {}

    // ─── Main Entry Point: POST /api/chat ─────────────────────────────────────

    public ChatResponseDto processChat(ChatRequestDto request) {
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        String role = request.getRole() != null ? request.getRole().trim().toUpperCase() : "GUEST";
        String language = "en".equalsIgnoreCase(request.getLanguage()) ? "en" : "vi";

        // 1. Truy vấn dữ liệu thực tế từ CSDL MariaDB
        List<HotelRow> hotels = queryHotelsFromDb();
        Map<Long, List<RoomRow>> roomsByHotel = queryRoomsByHotelFromDb();
        List<MemberTierRow> memberTiers = queryMemberTiersFromDb();
        List<String> amenities = queryAmenitiesFromDb();
        SystemStats stats = querySystemStatsFromDb();

        // 2. Xác định danh sách Card phòng liên quan đến câu hỏi để đính kèm vào khung chat
        String normalized = normalizeText(userMessage);
        boolean triggerWizard = isBookingIntent(normalized);
        List<ChatRoomCardDto> matchingCards = selectRelevantRoomCards(normalized, role, hotels, roomsByHotel);

        // 3. Xây dựng ngữ cảnh CSDL (Database Context Snapshot)
        String dbContext = buildDatabaseContextSnapshot(hotels, roomsByHotel, memberTiers, amenities, stats, role);

        // 4. Nếu có GEMINI_API_KEY trong .env → gọi Gemini kết hợp dữ liệu CSDL
        String apiKey = resolveGeminiApiKey();
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String geminiReply = callGeminiWithDatabaseContext(
                        apiKey, userMessage, request.getHistory(), role, language, dbContext);
                if (geminiReply != null && !geminiReply.isBlank()) {
                    return ChatResponseDto.builder()
                            .reply(cleanAiText(geminiReply))
                            .cards(matchingCards)
                            .triggerBookingWizard(triggerWizard)
                            .build();
                }
            } catch (Exception ex) {
                log.info("[ChatService] Chuyển sang bộ truy vấn CSDL trực tiếp (Gemini API fallback: {})", ex.getMessage());
            }
        }

        // 5. Trả lời trực tiếp bằng Bộ máy Truy vấn Nghiệp vụ Khách sạn kết nối CSDL MariaDB
        String directDbReply = buildSmartDatabaseReply(
                userMessage, role, language, hotels, roomsByHotel, memberTiers, amenities, stats, triggerWizard);

        return ChatResponseDto.builder()
                .reply(cleanAiText(directDbReply))
                .cards(matchingCards)
                .triggerBookingWizard(triggerWizard)
                .build();
    }

    // ─── Đặt phòng từng bước ngay trên Chatbox: POST /api/chat/book ───────────

    @Transactional
    public ChatBookingResponseDto createBookingFromChat(ChatBookingRequestDto request) {
        LocalDate checkInDate;
        LocalDate checkOutDate;
        try {
            checkInDate = LocalDate.parse(request.getCheckIn());
            checkOutDate = LocalDate.parse(request.getCheckOut());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Ngày nhận và trả phòng không hợp lệ.");
        }

        long nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        if (nights < 1) {
            throw new IllegalArgumentException("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.");
        }

        List<HotelRow> hotels = queryHotelsFromDb();
        Map<Long, List<RoomRow>> roomsByHotel = queryRoomsByHotelFromDb();

        HotelRow matchedHotel = hotels.stream()
                .filter(h -> h.slug().equalsIgnoreCase(request.getHotelId()) || String.valueOf(h.id()).equals(request.getHotelId()))
                .findFirst()
                .orElse(hotels.isEmpty() ? null : hotels.getFirst());

        if (matchedHotel == null) {
            throw new IllegalArgumentException("Không tìm thấy khách sạn trong hệ thống.");
        }

        List<RoomRow> hotelRooms = roomsByHotel.getOrDefault(matchedHotel.id(), List.of());
        RoomRow matchedRoom = hotelRooms.stream()
                .filter(r -> (request.getRoomDbId() != null && r.id().equals(request.getRoomDbId()))
                        || r.frontendRoomId().equalsIgnoreCase(request.getRoomId()))
                .findFirst()
                .orElse(hotelRooms.isEmpty() ? null : hotelRooms.getFirst());

        if (matchedRoom == null) {
            throw new IllegalArgumentException("Không tìm thấy hạng phòng trong hệ thống.");
        }

        if (request.getRooms() > matchedRoom.availableRooms()) {
            throw new IllegalArgumentException(
                    "Hiện chỉ còn " + matchedRoom.availableRooms() + " phòng trống cho hạng phòng này.");
        }

        int updated = jdbcTemplate.update("""
                UPDATE inventory_room_inventories
                SET available_rooms = GREATEST(available_rooms - ?, 0),
                    held_rooms = held_rooms + ?,
                    version = version + 1,
                    updated_at = NOW()
                WHERE room_type_id = ? AND date = CURDATE() AND available_rooms >= ?
                """,
                request.getRooms(), request.getRooms(), matchedRoom.id(), request.getRooms());

        int remainingRooms = Math.max(0, matchedRoom.availableRooms() - request.getRooms());
        if (updated == 0 && matchedRoom.availableRooms() < request.getRooms()) {
            throw new IllegalArgumentException("Hạng phòng này vừa hết chỗ trống. Quý khách vui lòng chọn hạng phòng khác.");
        }

        BigDecimal subtotal = matchedRoom.basePrice()
                .multiply(BigDecimal.valueOf(nights))
                .multiply(BigDecimal.valueOf(request.getRooms()));
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.10"));
        BigDecimal totalAmount = subtotal.add(tax);

        String bookingCode = "MEGO-" + LocalDate.now().getYear() + "-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);

        return ChatBookingResponseDto.builder()
                .success(true)
                .bookingCode(bookingCode)
                .message("Đặt phòng thành công.")
                .hotelId(matchedHotel.slug())
                .hotelName(matchedHotel.name())
                .roomId(matchedRoom.frontendRoomId())
                .roomName(matchedRoom.name())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .nights((int) nights)
                .rooms(request.getRooms())
                .pricePerNight(matchedRoom.basePrice())
                .totalAmount(totalAmount)
                .remainingAvailableRooms(remainingRooms)
                .build();
    }

    // ─── Chọn lọc danh sách Card phòng từ CSDL tương ứng câu hỏi ──────────────

    private boolean isBookingIntent(String normalized) {
        return containsAny(normalized,
                "dat phong", "muon dat", "book phong", "dat ngay", "giu phong", "dat tung buoc", "ho tro dat");
    }

    private List<ChatRoomCardDto> selectRelevantRoomCards(
            String normalized,
            String role,
            List<HotelRow> hotels,
            Map<Long, List<RoomRow>> roomsByHotel
    ) {
        if (hotels.isEmpty()) return List.of();

        if (("ADMIN".equals(role) || "PARTNER".equals(role))
                && containsAny(normalized, "thong ke", "admin", "doi tac", "hoa hong", "tai khoan", "overbooking")
                && !containsAny(normalized, "phong", "khach san", "dat", "gia")) {
            return List.of();
        }

        List<HotelRow> matchedHotels = hotels.stream()
                .filter(h -> matchesHotelOrDestination(normalized, h))
                .toList();

        if (normalized.contains("5 sao") || normalized.contains("5 star")) {
            List<HotelRow> star5 = (matchedHotels.isEmpty() ? hotels : matchedHotels).stream()
                    .filter(h -> h.starRating() == 5)
                    .toList();
            if (!star5.isEmpty()) matchedHotels = star5;
        } else if (normalized.contains("4 sao") || normalized.contains("4 star")) {
            List<HotelRow> star4 = (matchedHotels.isEmpty() ? hotels : matchedHotels).stream()
                    .filter(h -> h.starRating() == 4)
                    .toList();
            if (!star4.isEmpty()) matchedHotels = star4;
        }

        if (containsAny(normalized, "thu cung", "cho meo", "pet")) {
            List<HotelRow> petFriendly = (matchedHotels.isEmpty() ? hotels : matchedHotels).stream()
                    .filter(h -> h.petPolicy() != null && normalizeText(h.petPolicy()).contains("cho phep"))
                    .toList();
            if (!petFriendly.isEmpty()) matchedHotels = petFriendly;
        }

        List<HotelRow> targetHotels = matchedHotels.isEmpty() ? hotels : matchedHotels;

        List<ChatRoomCardDto> allCards = new ArrayList<>();
        for (HotelRow h : targetHotels) {
            List<RoomRow> rooms = roomsByHotel.getOrDefault(h.id(), List.of());
            for (RoomRow r : rooms) {
                allCards.add(toCardDto(h, r));
            }
        }

        if (containsAny(normalized, "suite", "villa", "penthouse", "hang sang", "cao cap", "vip")) {
            List<ChatRoomCardDto> luxury = allCards.stream()
                    .filter(c -> containsAny(normalizeText(c.getRoomName()), "suite", "villa", "penthouse", "premier"))
                    .toList();
            if (!luxury.isEmpty()) allCards = new ArrayList<>(luxury);
        } else if (containsAny(normalized, "gia re", "re nhat", "tiet kiem", "duoi 2 trieu", "binh dan")) {
            allCards.sort(Comparator.comparing(ChatRoomCardDto::getPricePerNight));
        }

        List<ChatRoomCardDto> exactRoomMatch = allCards.stream()
                .filter(c -> {
                    String rName = normalizeText(c.getRoomName());
                    return !rName.isBlank() && (normalized.contains(rName)
                            || (normalized.contains("ocean suite") && rName.contains("ocean suite"))
                            || (normalized.contains("emerald bay") && rName.contains("emerald bay"))
                            || (normalized.contains("mimosa") && rName.contains("mimosa"))
                            || (normalized.contains("camellia") && rName.contains("camellia"))
                            || (normalized.contains("heaven penthouse") && rName.contains("penthouse")));
                })
                .toList();
        if (!exactRoomMatch.isEmpty()) {
            return exactRoomMatch.stream().limit(4).toList();
        }

        if (!matchedHotels.isEmpty()) {
            return allCards.stream().limit(4).toList();
        }

        List<ChatRoomCardDto> diverseCards = new ArrayList<>();
        for (HotelRow h : targetHotels) {
            List<RoomRow> rooms = roomsByHotel.getOrDefault(h.id(), List.of());
            if (!rooms.isEmpty()) {
                diverseCards.add(toCardDto(h, rooms.getFirst()));
            }
            if (diverseCards.size() >= 4) break;
        }
        return diverseCards;
    }

    private ChatRoomCardDto toCardDto(HotelRow h, RoomRow r) {
        return ChatRoomCardDto.builder()
                .roomDbId(r.id())
                .hotelId(h.slug())
                .hotelName(h.name())
                .city(h.destinationName() != null ? h.destinationName() : "")
                .address(h.address())
                .stars(h.starRating())
                .rating(h.avgRating())
                .roomId(r.frontendRoomId())
                .roomName(r.name())
                .bedType(r.bedType())
                .areaM2(r.areaM2())
                .maxAdults(r.maxAdults())
                .maxChildren(r.maxChildren())
                .pricePerNight(r.basePrice())
                .availableRooms(r.availableRooms())
                .imageUrl(r.imageUrl())
                .freeCancellation(Boolean.TRUE.equals(h.refundable()))
                .payAtHotel(Boolean.TRUE.equals(h.allowPayAtHotel()))
                .build();
    }

    // ─── Đọc GEMINI_API_KEY từ properties / env / file .env ───────────────────

    private String resolveGeminiApiKey() {
        if (configuredGeminiKey != null && !configuredGeminiKey.isBlank()) {
            return configuredGeminiKey.trim();
        }
        String envKey = System.getenv("GEMINI_API_KEY");
        if (envKey != null && !envKey.isBlank()) {
            return envKey.trim();
        }
        for (String candidate : List.of(".env", "backend/.env", "../backend/.env")) {
            try {
                Path path = Path.of(candidate);
                if (Files.exists(path)) {
                    for (String line : Files.readAllLines(path, StandardCharsets.UTF_8)) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("GEMINI_API_KEY=")) {
                            return trimmed.substring("GEMINI_API_KEY=".length()).trim();
                        }
                    }
                }
            } catch (Exception ignored) {
            }
        }
        return null;
    }

    // ─── Truy vấn trực tiếp CSDL MariaDB ──────────────────────────────────────

    private List<HotelRow> queryHotelsFromDb() {
        try {
            return jdbcTemplate.query("""
                    SELECT h.id, h.name, h.slug,
                           d.name AS destination_name, d.province,
                           h.address, h.star_rating, h.avg_rating, h.review_count,
                           h.check_in_time, h.check_out_time, h.distance_to_center_km, h.description,
                           p.free_cancel_before_hours, p.cancellation_fee_percent,
                           p.refundable, p.allow_pay_at_hotel, p.child_policy, p.pet_policy
                    FROM hotel_hotels h
                    LEFT JOIN hotel_destinations d ON h.destination_id = d.id
                    LEFT JOIN hotel_policies p ON p.hotel_id = h.id
                    WHERE h.active = true
                    ORDER BY h.star_rating DESC, h.avg_rating DESC
                    LIMIT 20
                    """,
                    (rs, rowNum) -> new HotelRow(
                            rs.getLong("id"),
                            rs.getString("name"),
                            rs.getString("slug"),
                            rs.getString("destination_name"),
                            rs.getString("province"),
                            rs.getString("address"),
                            rs.getInt("star_rating"),
                            rs.getBigDecimal("avg_rating"),
                            rs.getInt("review_count"),
                            rs.getString("check_in_time"),
                            rs.getString("check_out_time"),
                            rs.getBigDecimal("distance_to_center_km"),
                            rs.getString("description"),
                            (Integer) rs.getObject("free_cancel_before_hours"),
                            rs.getBigDecimal("cancellation_fee_percent"),
                            (Boolean) rs.getObject("refundable"),
                            (Boolean) rs.getObject("allow_pay_at_hotel"),
                            rs.getString("child_policy"),
                            rs.getString("pet_policy")
                    ));
        } catch (Exception ex) {
            log.warn("[ChatService] Không thể truy vấn bảng hotel_hotels: {}", ex.getMessage());
            return List.of();
        }
    }

    private Map<Long, List<RoomRow>> queryRoomsByHotelFromDb() {
        try {
            List<RoomRow> rows = jdbcTemplate.query("""
                    SELECT rt.id, rt.hotel_id, rt.name, rt.description, rt.area_m2,
                           rt.max_adults, rt.max_children, rt.bed_type,
                           COALESCE(ri.price, rt.base_price) AS effective_price,
                           rt.total_rooms,
                           COALESCE(ri.available_rooms, rt.total_rooms) AS available_rooms,
                           COALESCE(ri.held_rooms, 0) AS held_rooms
                    FROM inventory_room_types rt
                    LEFT JOIN inventory_room_inventories ri
                           ON ri.room_type_id = rt.id AND ri.date = CURDATE()
                    WHERE rt.active = true
                    ORDER BY effective_price ASC
                    """,
                    (rs, rowNum) -> new RoomRow(
                            rs.getLong("id"),
                            rs.getLong("hotel_id"),
                            rs.getString("name"),
                            rs.getString("description"),
                            rs.getBigDecimal("area_m2"),
                            rs.getInt("max_adults"),
                            rs.getInt("max_children"),
                            rs.getString("bed_type"),
                            rs.getBigDecimal("effective_price"),
                            rs.getInt("total_rooms"),
                            rs.getInt("available_rooms"),
                            rs.getInt("held_rooms")
                    ));
            return rows.stream().collect(Collectors.groupingBy(RoomRow::hotelId));
        } catch (Exception ex) {
            log.warn("[ChatService] Không thể truy vấn bảng inventory_room_types: {}", ex.getMessage());
            return Map.of();
        }
    }

    private List<MemberTierRow> queryMemberTiersFromDb() {
        try {
            return jdbcTemplate.query("""
                    SELECT name, min_points, discount_percent, benefits
                    FROM promotion_member_tiers
                    ORDER BY min_points ASC
                    """,
                    (rs, rowNum) -> new MemberTierRow(
                            rs.getString("name"),
                            rs.getInt("min_points"),
                            rs.getBigDecimal("discount_percent"),
                            rs.getString("benefits")
                    ));
        } catch (Exception ex) {
            return List.of();
        }
    }

    private List<String> queryAmenitiesFromDb() {
        try {
            return jdbcTemplate.query(
                    "SELECT name FROM hotel_catalog_amenities ORDER BY scope, id",
                    (rs, rowNum) -> rs.getString(1));
        } catch (Exception ex) {
            return List.of();
        }
    }

    private SystemStats querySystemStatsFromDb() {
        long totalHotels = safeCount("SELECT COUNT(*) FROM hotel_hotels");
        long approvedHotels = safeCount("SELECT COUNT(*) FROM hotel_hotels WHERE approval_status = 'APPROVED'");
        long pendingHotels = safeCount("SELECT COUNT(*) FROM hotel_hotels WHERE approval_status = 'PENDING'");
        long totalRoomTypes = safeCount("SELECT COUNT(*) FROM inventory_room_types WHERE active = true");
        long totalPhysicalRooms = safeCount("SELECT COALESCE(SUM(total_rooms), 0) FROM inventory_room_types WHERE active = true");
        long totalAvailableToday = safeCount("SELECT COALESCE(SUM(available_rooms), 0) FROM inventory_room_inventories WHERE date = CURDATE()");
        long totalPartners = safeCount("SELECT COUNT(*) FROM partner_profiles");
        long pendingPartners = safeCount("SELECT COUNT(*) FROM partner_profiles WHERE approval_status = 'PENDING'");
        long totalUsers = safeCount("SELECT COUNT(*) FROM auth_users");

        return new SystemStats(
                totalHotels,
                approvedHotels,
                pendingHotels,
                totalRoomTypes,
                totalPhysicalRooms,
                totalAvailableToday,
                totalPartners,
                pendingPartners,
                totalUsers
        );
    }

    private long safeCount(String sql) {
        try {
            Long val = jdbcTemplate.queryForObject(sql, Long.class);
            return val != null ? val : 0L;
        } catch (Exception ex) {
            return 0L;
        }
    }

    // ─── Xây dựng Snapshot CSDL cho Prompt AI ─────────────────────────────────

    private String buildDatabaseContextSnapshot(
            List<HotelRow> hotels,
            Map<Long, List<RoomRow>> roomsByHotel,
            List<MemberTierRow> tiers,
            List<String> amenities,
            SystemStats stats,
            String role
    ) {
        StringBuilder sb = new StringBuilder();
        sb.append("DỮ LIỆU THỰC TẾ TRONG HỆ THỐNG MEGO:\n");
        sb.append(String.format(
                "Thống kê: %d khách sạn (%d đang hoạt động, %d chờ duyệt), %d hạng phòng, tổng %d phòng, hôm nay còn trống %d phòng, %d đối tác, %d người dùng.\n\n",
                stats.totalHotels(), stats.approvedHotels(), stats.pendingHotels(),
                stats.totalRoomTypes(), stats.totalPhysicalRooms(), stats.totalAvailableToday(),
                stats.totalPartners(), stats.totalUsers()
        ));

        for (HotelRow h : hotels) {
            sb.append(String.format(
                    "- %s (%d sao, %s) tại %s. Nhận phòng %s, trả phòng %s. Hủy miễn phí trước %d giờ.\n",
                    h.name(), h.starRating(), h.destinationName(), h.address(),
                    h.checkInTime(), h.checkOutTime(),
                    h.freeCancelHours() != null ? h.freeCancelHours() : 24
            ));
            if (h.childPolicy() != null) {
                sb.append("  Chính sách trẻ em: ").append(h.childPolicy()).append("\n");
            }
            if (h.petPolicy() != null) {
                sb.append("  Chính sách thú cưng: ").append(h.petPolicy()).append("\n");
            }

            List<RoomRow> rooms = roomsByHotel.getOrDefault(h.id(), List.of());
            for (RoomRow r : rooms) {
                sb.append(String.format(
                        "  + Hạng phòng %s: %sm², %s, tối đa %d người lớn, giá %s VNĐ/đêm, còn trống %d phòng.\n",
                        r.name(), r.areaM2(), r.bedType(), r.maxAdults(),
                        formatVnd(r.basePrice()), r.availableRooms()
                ));
            }
            sb.append("\n");
        }

        if (!tiers.isEmpty()) {
            sb.append("Hạng thẻ hội viên MeGo Club:\n");
            for (MemberTierRow t : tiers) {
                sb.append(String.format("- Hạng %s (từ %d điểm): Giảm %s%%. %s\n",
                        t.name(), t.minPoints(), t.discountPercent(), t.benefits()));
            }
        }
        return sb.toString();
    }

    // ─── Gọi Google Gemini API với văn phong Concierge 5 sao sang trọng ───────

    private String callGeminiWithDatabaseContext(
            String apiKey,
            String userMessage,
            List<ChatHistoryItemDto> history,
            String role,
            String language,
            String dbContext
    ) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        String systemInstruction = "en".equals(language)
                ? "You are the luxury 5-star Concierge of MEGO Hotel Booking Platform. " +
                  "Write in a refined, warm, concise, and natural tone (2 to 4 sentences). " +
                  "STRICT RULE: Do NOT use Markdown symbols like **, *, #, `, or excessive emojis. Use clean plain text only. " +
                  "Rely strictly on the database facts below. Since interactive room cards are displayed below your message, keep your text brief and elegant.\n\n" + dbContext
                : "Bạn là Chuyên viên Tư vấn Lưu trú Cao cấp (Luxury Concierge) của nền tảng đặt phòng khách sạn MEGO. " +
                  "QUY TẮC BẮT BUỘC: " +
                  "1. Tuyệt đối KHÔNG dùng các ký tự đánh dấu Markdown như dấu sao (** hoặc *), dấu thăng (#), dấu backtick (`) hay các ký tự lạ. " +
                  "2. KHÔNG lạm dụng icon/emoji lòe loẹt. Viết bằng văn bản thuần túy, lịch thiệp, sang trọng, súc tích và tự nhiên như lễ tân khách sạn 5 sao (khoảng 2 đến 4 câu ngắn gọn, xuống dòng thoáng mắt). " +
                  "3. Chỉ sử dụng số liệu thực tế từ CSDL bên dưới. Vì danh sách thẻ phòng chi tiết đã hiển thị ngay bên dưới tin nhắn, bạn chỉ cần giới thiệu tinh tế điểm nổi bật và mời quý khách chọn thẻ phòng bên dưới để xem chi tiết hoặc đặt phòng trực tiếp.\n\n" + dbContext;

        List<Map<String, Object>> contents = new ArrayList<>();
        if (history != null) {
            int start = Math.max(0, history.size() - 6);
            for (int i = start; i < history.size(); i++) {
                ChatHistoryItemDto item = history.get(i);
                if (item.getContent() == null || item.getContent().isBlank()) continue;
                String geminiRole = "assistant".equalsIgnoreCase(item.getRole()) ? "model" : "user";
                contents.add(Map.of(
                        "role", geminiRole,
                        "parts", List.of(Map.of("text", item.getContent()))
                ));
            }
        }
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userMessage))
        ));

        Map<String, Object> payload = new HashMap<>();
        payload.put("system_instruction", Map.of(
                "parts", List.of(Map.of("text", systemInstruction))
        ));
        payload.put("contents", contents);
        payload.put("generationConfig", Map.of(
                "temperature", 0.2,
                "maxOutputTokens", 450
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
            if (!textNode.isMissingNode()) {
                return textNode.asText();
            }
        }
        return null;
    }

    // ─── Bộ máy Truy vấn Nghiệp vụ Khách sạn (Văn phong Sang trọng, Không ký tự rác) ─

    private String buildSmartDatabaseReply(
            String userMessage,
            String role,
            String language,
            List<HotelRow> hotels,
            Map<Long, List<RoomRow>> roomsByHotel,
            List<MemberTierRow> memberTiers,
            List<String> amenities,
            SystemStats stats,
            boolean triggerWizard
    ) {
        String normalized = normalizeText(userMessage);

        if (triggerWizard) {
            return "MeGo xin gửi tới quý khách các hạng phòng đang còn chỗ trống phù hợp nhất hiện nay.\n\n" +
                   "Quý khách có thể chạm vào từng thẻ phòng bên dưới để xem không gian chi tiết, hoặc chọn Đặt trên Chat để hoàn tất giữ phòng nhanh trong 3 bước.";
        }

        List<HotelRow> matchedHotels = hotels.stream()
                .filter(h -> matchesHotelOrDestination(normalized, h))
                .toList();

        if (normalized.contains("5 sao") || normalized.contains("5 star")) {
            List<HotelRow> starFiltered = (matchedHotels.isEmpty() ? hotels : matchedHotels).stream()
                    .filter(h -> h.starRating() == 5)
                    .toList();
            if (!starFiltered.isEmpty()) matchedHotels = starFiltered;
        } else if (normalized.contains("4 sao") || normalized.contains("4 star")) {
            List<HotelRow> starFiltered = (matchedHotels.isEmpty() ? hotels : matchedHotels).stream()
                    .filter(h -> h.starRating() == 4)
                    .toList();
            if (!starFiltered.isEmpty()) matchedHotels = starFiltered;
        }

        if (containsAny(normalized, "thong ke", "tong quan", "he thong", "admin", "duyet", "pending", "doi tac", "hoa hong", "quan ly", "tai khoan", "user", "overbooking", "giu cho")) {
            if ("ADMIN".equals(role) || containsAny(normalized, "admin", "he thong", "tai khoan", "user", "cho duyet")) {
                return buildAdminDatabaseReply(stats, memberTiers);
            }
            if ("PARTNER".equals(role) || containsAny(normalized, "doi tac", "hoa hong", "overbooking", "giu cho", "ton kho")) {
                return buildPartnerDatabaseReply(stats);
            }
        }

        if (containsAny(normalized, "hang thanh vien", "mego club", "loyalty", "diem thuong", "uu dai", "giam gia", "silver", "gold", "platinum", "khuyen mai", "voucher")) {
            return buildMemberTierReply(memberTiers);
        }

        if (containsAny(normalized, "huy", "chinh sach", "check in", "check-in", "check out", "check-out", "nhan phong", "tra phong", "thu cung", "cho meo", "tre em", "hoan tien", "thanh toan")) {
            List<HotelRow> targetHotels = matchedHotels.isEmpty() ? hotels : matchedHotels;
            return buildPolicyDatabaseReply(targetHotels);
        }

        if (containsAny(normalized, "tien nghi", "ho boi", "be boi", "spa", "gym", "san bay", "buffet", "an sang", "bon tam")) {
            List<HotelRow> targetHotels = matchedHotels.isEmpty() ? hotels : matchedHotels;
            return buildAmenityDatabaseReply(targetHotels, amenities);
        }

        List<HotelRow> targetHotels = matchedHotels.isEmpty() ? hotels : matchedHotels;
        if ("ADMIN".equals(role) && matchedHotels.isEmpty() && !containsAny(normalized, "phong", "khach san", "gia")) {
            return buildAdminDatabaseReply(stats, memberTiers);
        }
        if ("PARTNER".equals(role) && matchedHotels.isEmpty() && !containsAny(normalized, "phong", "khach san", "gia")) {
            return buildPartnerDatabaseReply(stats);
        }
        return buildHotelAndRoomsDatabaseReply(targetHotels, roomsByHotel, !matchedHotels.isEmpty());
    }

    private String buildHotelAndRoomsDatabaseReply(
            List<HotelRow> targetHotels,
            Map<Long, List<RoomRow>> roomsByHotel,
            boolean isFilteredByQuery
    ) {
        if (targetHotels.isEmpty()) {
            return "Hiện tại MeGo chưa ghi nhận cơ sở lưu trú nào khớp với tiêu chí tìm kiếm này. Quý khách có thể tham khảo các khu nghỉ dưỡng tại Đà Nẵng, Phú Quốc, Nha Trang, Đà Lạt, Vũng Tàu hoặc TP. Hồ Chí Minh.";
        }

        StringBuilder sb = new StringBuilder();
        if (isFilteredByQuery) {
            sb.append("Dựa trên yêu cầu của quý khách, MeGo xin gợi ý các khu nghỉ dưỡng và hạng phòng đang có sẵn dưới đây:\n\n");
        } else {
            sb.append("MeGo xin giới thiệu các khách sạn và khu nghỉ dưỡng tiêu biểu đang có phòng trống hôm nay:\n\n");
        }

        int count = 0;
        for (HotelRow h : targetHotels) {
            if (count++ >= 3) break;
            List<RoomRow> rooms = roomsByHotel.getOrDefault(h.id(), List.of());
            String priceText = rooms.isEmpty() ? "Liên hệ" : "từ " + formatVnd(rooms.getFirst().basePrice()) + " VNĐ/đêm";
            sb.append(String.format("• %s (%d sao, %s) — Giá %s.\n",
                    h.name(), h.starRating(), h.destinationName(), priceText));
        }

        sb.append("\nQuý khách có thể chọn trực tiếp vào thẻ phòng bên dưới để xem chi tiết hoặc đặt giữ phòng ngay trên cuộc trò chuyện.");
        return sb.toString();
    }

    private String buildPolicyDatabaseReply(List<HotelRow> targetHotels) {
        StringBuilder sb = new StringBuilder();
        sb.append("MeGo xin thông tin chi tiết quy định lưu trú tại các khách sạn:\n\n");

        int count = 0;
        for (HotelRow h : targetHotels) {
            if (count++ >= 3) break;
            sb.append(String.format("• %s (%s):\n", h.name(), h.destinationName()));
            sb.append(String.format("  Giờ nhận phòng từ %s, trả phòng trước %s. Hỗ trợ hủy miễn phí trước %d giờ.\n",
                    h.checkInTime(), h.checkOutTime(),
                    h.freeCancelHours() != null ? h.freeCancelHours() : 24));
            if (h.childPolicy() != null) {
                sb.append("  Trẻ em: ").append(h.childPolicy()).append("\n");
            }
            if (h.petPolicy() != null) {
                sb.append("  Thú cưng: ").append(h.petPolicy()).append("\n");
            }
            sb.append("\n");
        }
        sb.append("Quý khách có thể nhấn vào thẻ phòng bên dưới để xem chi tiết từng hạng phòng.");
        return sb.toString().trim();
    }

    private String buildMemberTierReply(List<MemberTierRow> tiers) {
        StringBuilder sb = new StringBuilder();
        sb.append("Chương trình khách hàng thân thiết MeGo Club mang đến các đặc quyền chiết khấu trực tiếp theo hạng thẻ:\n\n");
        for (MemberTierRow t : tiers) {
            sb.append(String.format("• Hạng %s (từ %s điểm): Giảm trực tiếp %s%% giá phòng. %s\n\n",
                    t.name(),
                    NumberFormat.getInstance(Locale.of("vi", "VN")).format(t.minPoints()),
                    t.discountPercent(),
                    t.benefits()));
        }
        sb.append("Quý khách có thể áp dụng quyền lợi hội viên ngay khi đặt các hạng phòng bên dưới.");
        return sb.toString().trim();
    }

    private String buildAmenityDatabaseReply(List<HotelRow> targetHotels, List<String> amenities) {
        StringBuilder sb = new StringBuilder();
        sb.append("Các khu nghỉ dưỡng trên hệ thống MeGo đều được trang bị tiện nghi tiêu chuẩn cao cấp:\n");
        if (!amenities.isEmpty()) {
            sb.append("• ").append(String.join(", ", amenities)).append(".\n\n");
        }
        sb.append("Dưới đây là các hạng phòng nổi bật đáp ứng đầy đủ tiện ích để quý khách lựa chọn:");
        return sb.toString().trim();
    }

    private String buildPartnerDatabaseReply(SystemStats stats) {
        return String.format(
                "Tổng quan dữ liệu Cổng Đối tác trên hệ thống MeGo:\n\n" +
                "• Số cơ sở lưu trú: %d khách sạn (%d đang hoạt động, %d chờ duyệt).\n" +
                "• Quy mô quỹ phòng: %d hạng phòng với tổng cộng %d phòng vật lý.\n" +
                "• Tồn kho khả dụng hôm nay: %d phòng sẵn sàng mở bán.\n\n" +
                "Hệ thống tự động giữ chỗ tạm thời 10 phút khi khách thanh toán để bảo vệ đối tác khỏi tình trạng đặt trùng phòng.",
                stats.totalHotels(), stats.approvedHotels(), stats.pendingHotels(),
                stats.totalRoomTypes(), stats.totalPhysicalRooms(), stats.totalAvailableToday()
        );
    }

    private String buildAdminDatabaseReply(SystemStats stats, List<MemberTierRow> tiers) {
        return String.format(
                "Báo cáo dữ liệu vận hành hệ thống MeGo theo thời gian thực:\n\n" +
                "• Tài khoản người dùng: %d tài khoản.\n" +
                "• Hồ sơ đối tác: %d đối tác (%d hồ sơ đang chờ phê duyệt).\n" +
                "• Cơ sở lưu trú: %d khách sạn (%d đã duyệt, %d chờ duyệt).\n" +
                "• Quỹ phòng hôm nay: %d hạng phòng, còn trống %d/%d phòng.\n" +
                "• Hạng hội viên MeGo Club: %d hạng thẻ (%s).",
                stats.totalUsers(),
                stats.totalPartners(), stats.pendingPartners(),
                stats.totalHotels(), stats.approvedHotels(), stats.pendingHotels(),
                stats.totalRoomTypes(), stats.totalAvailableToday(), stats.totalPhysicalRooms(),
                tiers.size(), tiers.stream().map(MemberTierRow::name).collect(Collectors.joining(", "))
        );
    }

    // ─── Làm sạch ký tự Markdown thừa để văn bản hiển thị sang trọng, tự nhiên ─

    private String cleanAiText(String raw) {
        if (raw == null) return "";
        return raw
                .replaceAll("\\*\\*(.*?)\\*\\*", "$1")
                .replaceAll("__(.*?)__", "$1")
                .replaceAll("`([^`]*)`", "$1")
                .replaceAll("(?m)^#{1,6}\\s*", "")
                .replaceAll("(?m)^\\s*\\*\\s+", "• ")
                .replaceAll("\\*", "")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();
    }

    // ─── Text Matching & Formatting Utilities ─────────────────────────────────

    private boolean matchesHotelOrDestination(String normalizedQuery, HotelRow h) {
        String dest = normalizeText(h.destinationName());
        String prov = normalizeText(h.province());
        String name = normalizeText(h.name());

        if (!dest.isBlank() && normalizedQuery.contains(dest)) return true;
        if (!prov.isBlank() && normalizedQuery.contains(prov)) return true;
        if (!name.isBlank() && normalizedQuery.contains(name)) return true;

        for (String keyword : List.of(
                "danang", "da nang", "phu quoc", "nha trang", "vinpearl",
                "da lat", "dalat", "edensee", "vung tau", "imperial",
                "sai gon", "saigon", "ho chi minh", "furama", "sunrise",
                "intercontinental", "marriott", "emerald")) {
            if (normalizedQuery.contains(keyword)
                    && (name.contains(keyword.replace(" ", "")) || name.contains(keyword) || dest.contains(keyword))) {
                return true;
            }
        }
        return false;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }

    private String normalizeText(String input) {
        if (input == null) return "";
        String decomposed = Normalizer.normalize(input, Normalizer.Form.NFD);
        return decomposed.replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    private String formatVnd(BigDecimal amount) {
        if (amount == null) return "0";
        return NumberFormat.getInstance(Locale.of("vi", "VN")).format(amount.longValue());
    }
}
