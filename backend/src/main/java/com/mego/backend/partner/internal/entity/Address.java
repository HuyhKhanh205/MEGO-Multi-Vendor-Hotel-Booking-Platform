package com.mego.backend.partner.internal.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
/**
 * @author Nguyễn Nam Trung Nguyên
 * @version 1.0
 * @MSSV 23640731
 * @Class DHKTPM19ATT
 * @since 9/21/2026
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "partner_addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String address;      // Số nhà, tên đường

    private String ward;         // Phường/Xã

    private String district;     // Quận/Huyện/Thị xã

    private String province;     // Tỉnh/Thành phố trực thuộc TW

    private String postalCode;   // Mã bưu chính (không bắt buộc)
}
