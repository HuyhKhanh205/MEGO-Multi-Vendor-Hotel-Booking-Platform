package com.mego.backend.domain;
/**
 * @author TrungNguyen
 * @created 4/11/2026
 * @description
 */
public enum AccountStatus {
    PENDING_VERIFICATION,   // Tài khoản đã được tạo nhưng chưa được xác minh
    ACTIVE,                 // Tài khoản đang hoạt động và ở trạng thái tốt.
    SUSPENDED,              // Tài khoản bị tạm thời đình chỉ, có thể do vi phạm
    DEACTIVATED,            // Tài khoản đã bị vô hiệu hóa, người dùng có thể đã chọn vô hiệu hóa tài khoản này.
    BANNED,                 // Tài khoản bị cấm vĩnh viễn do vi phạm nghiêm trọng
    CLOSED                  // Tài khoản đã bị đóng vĩnh viễn, có thể theo yêu cầu của người dùng.
}
