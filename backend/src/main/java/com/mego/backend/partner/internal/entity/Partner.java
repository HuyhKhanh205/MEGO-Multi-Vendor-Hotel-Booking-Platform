package com.mego.backend.partner.internal.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mego.backend.partner.internal.domain.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
/**
 * @author Nguyễn Nam Trung Nguyên
 * @version 1.0
 * @MSSV 23640731
 * @Class DHKTPM19ATT
 * @since 9/21/2026
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "partner_partners")
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sellerName;

    private String phone;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @OneToOne(cascade = CascadeType.ALL) //một seller có một địa chỉ, khi xóa seller thì xóa luôn địa chỉ
    @JsonIgnore
    private Address pickupAddress = new Address();

    private String MST;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.PARTNER;

    private boolean isEmailVerified = false;



}
