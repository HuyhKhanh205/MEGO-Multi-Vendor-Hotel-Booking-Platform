package com.mego.backend.chat.internal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Đồng bộ dữ liệu khách sạn & hạng phòng chuẩn của sàn MeGo vào CSDL MariaDB
 * để Trợ lý AI truy vấn trực tiếp từ CSDL và điều hướng chính xác tới trang chi tiết phòng.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ChatDataSeeder implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            seedMemberTiersIfEmpty();
            seedAmenitiesIfEmpty();
            syncWebHotelsAndRooms();
        } catch (Exception ex) {
            log.warn("[ChatDataSeeder] Bỏ qua đồng bộ dữ liệu mẫu: {}", ex.getMessage());
        }
    }

    private void seedMemberTiersIfEmpty() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM promotion_member_tiers", Integer.class);
        if (count != null && count > 0) {
            return;
        }

        jdbcTemplate.update("""
                INSERT INTO promotion_member_tiers (name, min_points, discount_percent, benefits, created_at, updated_at)
                VALUES
                ('Silver', 0, 5.00, 'Giảm 5% giá phòng cơ bản, tích 1 điểm cho mỗi 10.000đ chi tiêu, hỗ trợ khách hàng ưu tiên.', NOW(), NOW()),
                ('Gold', 1000, 10.00, 'Giảm 10% giá phòng, miễn phí bữa sáng cho 2 khách, nhận phòng sớm từ 12:00 (tùy tình trạng phòng).', NOW(), NOW()),
                ('Platinum', 5000, 15.00, 'Giảm 15% mọi đặt phòng, nâng hạng phòng miễn phí, trả phòng muộn tới 15:00 và quyền vào phòng chờ VIP.', NOW(), NOW())
                """);
        log.info("[ChatDataSeeder] Đã khởi tạo 3 hạng thành viên MeGo Club (Silver, Gold, Platinum).");
    }

    private void seedAmenitiesIfEmpty() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hotel_catalog_amenities", Integer.class);
        if (count != null && count > 0) {
            return;
        }

        jdbcTemplate.update("""
                INSERT INTO hotel_catalog_amenities (name, icon, scope, category, created_at, updated_at)
                VALUES
                ('Hồ bơi vô cực', 'waves', 'HOTEL', 'Giải trí & Thư giãn', NOW(), NOW()),
                ('WiFi tốc độ cao 500Mbps', 'wifi', 'HOTEL', 'Tiện ích chung', NOW(), NOW()),
                ('Buffet sáng Á - Âu', 'utensils', 'HOTEL', 'Ẩm thực', NOW(), NOW()),
                ('Spa & Massage trị liệu', 'sparkles', 'HOTEL', 'Giải trí & Thư giãn', NOW(), NOW()),
                ('Phòng Gym 24/7', 'dumbbell', 'HOTEL', 'Thể thao', NOW(), NOW()),
                ('Đưa đón sân bay', 'car', 'HOTEL', 'Di chuyển', NOW(), NOW()),
                ('Bồn tắm nằm hướng biển', 'bath', 'ROOM', 'Tiện nghi phòng', NOW(), NOW()),
                ('Smart TV 65 inch 4K', 'tv', 'ROOM', 'Giải trí trong phòng', NOW(), NOW())
                """);
        log.info("[ChatDataSeeder] Đã khởi tạo danh mục tiện nghi khách sạn & phòng.");
    }

    private void syncWebHotelsAndRooms() {
        Integer legacyCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hotel_hotels WHERE slug = 'mego-grand-danang-resort-spa'", Integer.class);
        if (legacyCount != null && legacyCount > 0) {
            // Dọn bản ghi cũ để đồng bộ 100% với danh sách khách sạn/phòng trên giao diện web
            jdbcTemplate.update("DELETE FROM inventory_room_inventories");
            jdbcTemplate.update("DELETE FROM inventory_room_types");
            jdbcTemplate.update("DELETE FROM hotel_policies");
            jdbcTemplate.update("DELETE FROM hotel_hotels");
        }

        Integer hotelCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hotel_hotels", Integer.class);
        if (hotelCount != null && hotelCount > 0) {
            return;
        }

        // 1. Đảm bảo các Điểm đến (hotel_destinations) tồn tại
        upsertDestination("Đà Nẵng", "da-nang", "Đà Nẵng", "Thành phố biển đáng sống với bãi biển Mỹ Khê, bán đảo Sơn Trà và cầu Rồng.", 16.0544070, 108.2021670);
        upsertDestination("Phú Quốc", "phu-quoc", "Kiên Giang", "Đảo Ngọc thiên đường nghỉ dưỡng nhiệt đới với bãi Khem và hoàng hôn tuyệt đẹp.", 10.2898790, 103.9840200);
        upsertDestination("Nha Trang", "nha-trang", "Khánh Hòa", "Vịnh biển xanh trong nằm trong top vịnh đẹp nhất thế giới.", 12.2387910, 109.1967490);
        upsertDestination("Đà Lạt", "da-lat", "Lâm Đồng", "Thành phố ngàn hoa với khí hậu se lạnh quanh năm và hồ Tuyền Lâm lãng mạn.", 11.9404190, 108.4583130);
        upsertDestination("Vũng Tàu", "vung-tau", "Bà Rịa - Vũng Tàu", "Thành phố biển sôi động gần TP.HCM với Bãi Sau cát trắng.", 10.3459900, 107.0842600);
        upsertDestination("Hồ Chí Minh", "ho-chi-minh", "TP. Hồ Chí Minh", "Trung tâm kinh tế - giải trí sầm uất với phố đi bộ Nguyễn Huệ và Quận 1.", 10.7768890, 106.7008060);

        Long daNangId = getDestId("da-nang");
        Long phuQuocId = getDestId("phu-quoc");
        Long nhaTrangId = getDestId("nha-trang");
        Long daLatId = getDestId("da-lat");
        Long vungTauId = getDestId("vung-tau");
        Long hcmId = getDestId("ho-chi-minh");

        // 2. Seed Khách sạn khớp 100% slug trên web (hotel_hotels)
        jdbcTemplate.update("""
                INSERT INTO hotel_hotels
                (partner_profile_id, destination_id, name, slug, address, star_rating, description, check_in_time, check_out_time, distance_to_center_km, approval_status, active, avg_rating, review_count, created_at, updated_at)
                VALUES
                (1, ?, 'Grand Sunrise Boutique Hotel Da Nang', 'grand-sunrise-boutique-hotel-da-nang', '28 Võ Nguyên Giáp, Bãi biển Mỹ Khê, Quận Sơn Trà, Đà Nẵng', 5, 'Khách sạn 5 sao mặt biển Mỹ Khê với hồ bơi chân mây tầng thượng và buffet sáng miễn phí.', '14:00', '12:00', 2.50, 'APPROVED', true, 4.85, 842, NOW(), NOW()),
                (1, ?, 'Furama Resort Danang Luxury & Villas', 'furama-resort-da-nang', '105 Võ Nguyên Giáp, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, Đà Nẵng', 5, 'Resort 5 sao biểu tượng tại bãi biển Bắc Mỹ An với hồ bơi nhiệt đới, bãi biển riêng tư và ẩm thực quốc tế.', '14:00', '12:00', 4.50, 'APPROVED', true, 4.92, 1290, NOW(), NOW()),
                (1, ?, 'InterContinental Danang Sun Peninsula Resort', 'intercontinental-danang-sun-peninsula', 'Bãi Bắc, Bán đảo Sơn Trà, Quận Sơn Trà, Đà Nẵng', 5, 'Khu nghỉ dưỡng 5 sao huyền thoại trên bán đảo Sơn Trà với nhà hàng Michelin La Maison 1888 và vịnh biển biệt lập.', '15:00', '12:00', 14.00, 'APPROVED', true, 4.98, 2100, NOW(), NOW()),
                (2, ?, 'JW Marriott Emerald Bay Phú Quốc', 'jw-marriott-phu-quoc', 'Bãi Khem, Phường An Thới, Thành phố Phú Quốc, Kiên Giang', 5, 'Kiệt tác nghỉ dưỡng 5 sao tại Bãi Khem do kiến trúc sư Bill Bensley thiết kế.', '15:00', '12:00', 18.00, 'APPROVED', true, 4.95, 1560, NOW(), NOW()),
                (2, ?, 'Vinpearl Resort & Spa Nha Trang', 'vinpearl-resort-spa-nha-trang', 'Đảo Hòn Tre, Phường Vĩnh Nguyên, Nha Trang, Khánh Hòa', 5, 'Khu nghỉ dưỡng 5 sao trên đảo Hòn Tre với bãi biển riêng, hồ bơi lớn và công viên giải trí VinWonders kề bên.', '14:00', '12:00', 3.50, 'APPROVED', true, 4.88, 980, NOW(), NOW()),
                (3, ?, 'Dalat Edensee Lake Resort & Spa', 'dalat-edensee-lake-resort', 'Khu du lịch Hồ Tuyền Lâm, Phường 4, Thành phố Đà Lạt, Lâm Đồng', 5, 'Khu nghỉ dưỡng 5 sao phong cách Châu Âu lãng mạn ẩn mình giữa rừng thông ven hồ Tuyền Lâm.', '14:00', '12:00', 10.00, 'APPROVED', true, 4.82, 720, NOW(), NOW()),
                (3, ?, 'The Imperial Hotel Vũng Tàu', 'the-imperial-hotel-vung-tau', '159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu', 5, 'Khách sạn 5 sao phong cách hoàng gia Anh cổ điển tại Bãi Sau Vũng Tàu với bãi biển riêng.', '14:00', '12:00', 2.00, 'APPROVED', true, 4.78, 840, NOW(), NOW()),
                (3, ?, 'Khách sạn Sài Gòn Luxury Suites', 'saigon-luxury-hotel-center', '88 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', 4, 'Khách sạn 4 sao cao cấp ngay trung tâm Quận 1, kề cận phố đi bộ Nguyễn Huệ và chợ Bến Thành.', '14:00', '12:00', 0.30, 'APPROVED', true, 4.70, 650, NOW(), NOW())
                """,
                daNangId, daNangId, daNangId, phuQuocId, nhaTrangId, daLatId, vungTauId, hcmId);

        Long sunriseId = getHotelId("grand-sunrise-boutique-hotel-da-nang");
        Long furamaId = getHotelId("furama-resort-da-nang");
        Long interconId = getHotelId("intercontinental-danang-sun-peninsula");
        Long jwId = getHotelId("jw-marriott-phu-quoc");
        Long vinpearlId = getHotelId("vinpearl-resort-spa-nha-trang");
        Long edenseeId = getHotelId("dalat-edensee-lake-resort");
        Long imperialId = getHotelId("the-imperial-hotel-vung-tau");
        Long saigonId = getHotelId("saigon-luxury-hotel-center");

        // 3. Seed Chính sách khách sạn (hotel_policies)
        jdbcTemplate.update("""
                INSERT INTO hotel_policies
                (hotel_id, check_in_from, check_in_until, check_out_until, free_cancel_before_hours, cancellation_fee_percent, refundable, allow_pay_at_hotel, require_manual_cancel_approval, child_policy, pet_policy, other_rules, created_at, updated_at)
                VALUES
                (?, '14:00:00', '23:30:00', '12:00:00', 24, 50.00, true, true, false, 'Miễn phí tối đa 2 trẻ em dưới 11 tuổi ngủ chung giường với bố mẹ.', 'Không cho phép mang theo thú cưng.', 'Bao gồm buffet sáng miễn phí hàng ngày.', NOW(), NOW()),
                (?, '14:00:00', '23:30:00', '12:00:00', 48, 50.00, true, true, false, 'Miễn phí 2 trẻ dưới 12 tuổi ngủ chung giường sẵn có.', 'Không cho phép mang thú cưng.', 'Miễn phí sử dụng hồ bơi nhiệt đới và bãi biển riêng.', NOW(), NOW()),
                (?, '15:00:00', '23:59:00', '12:00:00', 72, 100.00, true, true, false, 'Miễn phí trẻ dưới 12 tuổi đi cùng gia đình.', 'Không hỗ trợ thú cưng tại khu bảo tồn bán đảo Sơn Trà.', 'Đặc quyền cáp treo Nam Tram và trà chiều tại Club Lounge.', NOW(), NOW()),
                (?, '15:00:00', '23:59:00', '12:00:00', 72, 100.00, true, false, false, 'Trẻ em dưới 12 tuổi được miễn phí ăn sáng.', 'Không cho phép thú cưng vào khu vực biệt thự biển.', 'Hỗ trợ xe đón sân bay Phú Quốc khi đặt trước 24 giờ.', NOW(), NOW()),
                (?, '14:00:00', '23:00:00', '12:00:00', 48, 50.00, true, false, false, 'Miễn phí tối đa 2 trẻ dưới 6 tuổi; ưu đãi vé cáp treo VinWonders.', 'Không hỗ trợ mang thú cưng.', 'Miễn phí cano cao tốc sang đảo Hòn Tre.', NOW(), NOW()),
                (?, '14:00:00', '22:30:00', '12:00:00', 24, 20.00, true, true, false, 'Miễn phí 1 trẻ em dưới 10 tuổi ở cùng bố mẹ.', 'Cho phép mang thú cưng nhỏ dưới 10kg ở khu Garden Villa (báo trước lễ tân).', 'Có lò sưởi ấm áp trong phòng ngủ.', NOW(), NOW()),
                (?, '14:00:00', '23:00:00', '12:00:00', 24, 30.00, true, true, false, 'Miễn phí trẻ dưới 6 tuổi ngủ chung giường.', 'Cho phép thú cưng nhỏ dưới 7kg (có phụ phí vệ sinh).', 'Lối đi riêng qua cầu bộ hành ra Bãi Sau.', NOW(), NOW()),
                (?, '14:00:00', '23:59:00', '12:00:00', 24, 20.00, true, true, false, 'Miễn phí 1 trẻ dưới 11 tuổi ngủ chung giường.', 'Không cho phép thú cưng.', 'Cách phố đi bộ Nguyễn Huệ 200m.', NOW(), NOW())
                """,
                sunriseId, furamaId, interconId, jwId, vinpearlId, edenseeId, imperialId, saigonId);

        // 4. Seed Hạng phòng khớp 100% tên & giá trên giao diện web (inventory_room_types)
        // Lưu mã roomId của frontend trong cột description theo định dạng [roomId|imageUrl] để map 1-1
        jdbcTemplate.update("""
                INSERT INTO inventory_room_types
                (hotel_id, name, description, area_m2, max_adults, max_children, bed_type, base_price, total_rooms, active, created_at, updated_at)
                VALUES
                (?, 'Deluxe Giường Đôi Hướng Phố', 'room-sunrise-deluxe-city|https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', 32.00, 2, 1, '1 Giường đôi Queen', 1450000.00, 10, true, NOW(), NOW()),
                (?, 'Premier Hướng Biển Mỹ Khê', 'room-sunrise-premier-ocean|https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', 45.00, 3, 1, '1 Giường King hoặc 2 Giường đơn', 1950000.00, 8, true, NOW(), NOW()),
                (?, 'Deluxe Hướng Vườn Nhiệt Đới', 'room-furama-deluxe-garden|https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', 43.00, 2, 2, '1 Giường đôi King hoặc 2 Giường đơn', 3350000.00, 12, true, NOW(), NOW()),
                (?, 'Ocean Suite Hướng Biển Trực Diện', 'room-furama-ocean-suite|https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', 85.00, 3, 2, '1 Giường đôi Super King', 4950000.00, 6, true, NOW(), NOW()),
                (?, 'Classic Resort Ocean View', 'room-intercon-resort-classic|https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80', 70.00, 2, 2, '1 Giường King', 7800000.00, 8, true, NOW(), NOW()),
                (?, 'Heaven Penthouse Biệt Lập Sơn Trà', 'room-intercon-heaven-penthouse|https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 170.00, 4, 2, '2 Giường King lớn + Hồ bơi vô cực riêng', 14500000.00, 4, true, NOW(), NOW()),
                (?, 'Emerald Bay View Room', 'room-jw-emerald-bay-view|https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 54.00, 2, 2, '1 Giường King', 4890000.00, 10, true, NOW(), NOW()),
                (?, 'Turquoise Suite Bãi Khem', 'room-jw-turquoise-suite|https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', 90.00, 3, 2, '1 Giường King cỡ lớn + 1 Sofa bed', 7900000.00, 6, true, NOW(), NOW()),
                (?, 'Deluxe Hướng Biển', 'room-vinpearl-deluxe-ocean|https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', 45.00, 2, 2, '1 Giường đôi King hoặc 2 Giường đơn', 2690000.00, 15, true, NOW(), NOW()),
                (?, 'Villa Biển Đảo 2 Phòng Ngủ', 'room-vinpearl-ocean-villa|https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', 120.00, 4, 2, '2 Giường King lớn', 5200000.00, 6, true, NOW(), NOW()),
                (?, 'Mimosa Deluxe Garden View', 'room-edensee-mimosa-deluxe|https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80', 40.00, 2, 1, '1 Giường King', 2190000.00, 10, true, NOW(), NOW()),
                (?, 'Camellia Suite Ven Hồ Tuyền Lâm', 'room-edensee-lake-suite|https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', 70.00, 3, 2, '1 Giường King + Ban công ngắm hồ', 3350000.00, 6, true, NOW(), NOW()),
                (?, 'Deluxe Hướng Phố', 'room-imperial-deluxe|https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80', 40.00, 2, 1, '1 Giường đôi Queen', 1850000.00, 12, true, NOW(), NOW()),
                (?, 'Grand Suite Hướng Biển Hoàng Gia', 'room-imperial-ocean-suite|https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', 72.00, 3, 2, '1 Giường đôi King siêu lớn', 2950000.00, 6, true, NOW(), NOW()),
                (?, 'Deluxe Trung Tâm Sài Gòn', 'room-saigon-deluxe|https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80', 34.00, 2, 1, '1 Giường đôi Queen', 1250000.00, 12, true, NOW(), NOW()),
                (?, 'Executive Suite Ngắm Phố Đi Bộ', 'room-saigon-executive-suite|https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', 58.00, 3, 2, '1 Giường King + Phòng khách riêng biệt', 1890000.00, 8, true, NOW(), NOW())
                """,
                sunriseId, sunriseId, furamaId, furamaId, interconId, interconId, jwId, jwId,
                vinpearlId, vinpearlId, edenseeId, edenseeId, imperialId, imperialId, saigonId, saigonId);

        // 5. Seed Tồn kho phòng cho ngày hôm nay và ngày mai (inventory_room_inventories)
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        jdbcTemplate.update("""
                INSERT INTO inventory_room_inventories
                (room_type_id, date, total_rooms, available_rooms, held_rooms, price, closed, version, created_at, updated_at)
                SELECT id, ?, total_rooms, GREATEST(total_rooms - 3, 2), 1, base_price, false, 0, NOW(), NOW()
                FROM inventory_room_types
                """, today);
        jdbcTemplate.update("""
                INSERT INTO inventory_room_inventories
                (room_type_id, date, total_rooms, available_rooms, held_rooms, price, closed, version, created_at, updated_at)
                SELECT id, ?, total_rooms, GREATEST(total_rooms - 2, 2), 0, base_price, false, 0, NOW(), NOW()
                FROM inventory_room_types
                """, tomorrow);

        log.info("[ChatDataSeeder] Đã đồng bộ 8 khách sạn và 16 hạng phòng chuẩn của sàn MeGo vào CSDL MariaDB.");
    }

    private void upsertDestination(String name, String slug, String province, String desc, double lat, double lng) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM hotel_destinations WHERE slug = ?", Integer.class, slug);
        if (count == null || count == 0) {
            jdbcTemplate.update("""
                    INSERT INTO hotel_destinations (name, slug, province, country, description, latitude, longitude, created_at, updated_at)
                    VALUES (?, ?, ?, 'Việt Nam', ?, ?, ?, NOW(), NOW())
                    """, name, slug, province, desc, lat, lng);
        }
    }

    private Long getDestId(String slug) {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM hotel_destinations WHERE slug = ? LIMIT 1", Long.class, slug);
    }

    private Long getHotelId(String slug) {
        return jdbcTemplate.queryForObject(
                "SELECT id FROM hotel_hotels WHERE slug = ? LIMIT 1", Long.class, slug);
    }
}
