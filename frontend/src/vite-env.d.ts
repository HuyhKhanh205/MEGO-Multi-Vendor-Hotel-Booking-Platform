/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_CHAT_USE_MOCK?: string;
  readonly VITE_CHAT_MOCK_FAIL_ONCE?: string;
  /** "false" để cổng Partner gọi API Spring thật thay vì dữ liệu mock */
  readonly VITE_PARTNER_USE_MOCK?: string;
}
