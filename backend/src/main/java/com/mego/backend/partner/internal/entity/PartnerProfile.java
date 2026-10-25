package com.mego.backend.partner.internal.entity;

import com.mego.backend.shared.persistence.BaseEntity;
import com.mego.backend.partner.internal.domain.PartnerApprovalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Hồ sơ đối tác (Partner) – gắn với một User có role PARTNER.
 * Xóa mềm bằng {@code approvalStatus = SUSPENDED}.
 */
@Entity
@Table(
        name = "partner_profiles",
        indexes = {
                @Index(name = "idx_partner_approval", columnList = "approval_status"),
                @Index(name = "idx_partner_user", columnList = "user_id")
        },
        uniqueConstraints = @UniqueConstraint(name = "uq_partner_user", columnNames = "user_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerProfile extends BaseEntity {

    /** Tài khoản User gắn với đối tác (role = PARTNER). */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Tên doanh nghiệp / công ty. */
    @NotBlank
    @Column(name = "business_name", nullable = false, length = 200)
    private String businessName;

    /** Mã số thuế doanh nghiệp. */
    @Column(name = "tax_code", length = 20)
    private String taxCode;

    /** Địa chỉ trụ sở. */
    @Column(name = "address", length = 500)
    private String address;

    /** Số điện thoại liên hệ doanh nghiệp. */
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    /**
     * Danh sách URL tài liệu pháp lý (giấy phép kinh doanh, CMND đăng ký...).
     * Lưu vào bảng phụ {@code partner_documents}.
     */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "partner_documents",
            joinColumns = @JoinColumn(name = "partner_profile_id")
    )
    @Column(name = "document_url", length = 1000)
    @Builder.Default
    private List<String> legalDocumentUrls = new ArrayList<>();

    /** Tên ngân hàng nhận thanh toán. */
    @Column(name = "bank_name", length = 100)
    private String bankName;

    /** Số tài khoản ngân hàng. */
    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    /** Tên chủ tài khoản ngân hàng. */
    @Column(name = "bank_account_holder", length = 150)
    private String bankAccountHolder;

    /** Tỷ lệ hoa hồng sàn thu của đối tác (mặc định 15%). */
    @DecimalMin("0.00") @DecimalMax("100.00")
    @Builder.Default
    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionRate = new BigDecimal("15.00");

    /** Trạng thái duyệt hồ sơ đối tác. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "approval_status", nullable = false, length = 20)
    private PartnerApprovalStatus approvalStatus = PartnerApprovalStatus.PENDING;

    /** Lý do từ chối (nếu approvalStatus = REJECTED). */
    @Column(name = "reject_reason", length = 1000)
    private String rejectReason;
}
