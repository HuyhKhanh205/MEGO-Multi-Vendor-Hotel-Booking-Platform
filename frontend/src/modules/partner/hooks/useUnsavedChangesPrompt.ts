import { useEffect } from "react";

/**
 * Hỏi xác nhận trước khi rời trang khi còn thay đổi chưa lưu.
 * App dùng <BrowserRouter> nên không có useBlocker; thay vào đó:
 *  - `beforeunload` cho đóng tab / tải lại;
 *  - bắt click vào link nội bộ ở pha capture (chạy trước handler của <Link>) để hỏi trước khi chuyển trang.
 * Nút Back của trình duyệt chưa chặn được (cần data router).
 */
export const useUnsavedChangesPrompt = (dirty: boolean, message = "Bạn có thay đổi chưa lưu. Rời trang và bỏ các thay đổi này?") => {
  useEffect(() => {
    if (!dirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.origin !== window.location.origin) return;
      if (anchor.pathname === window.location.pathname) return;
      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [dirty, message]);
};

export default useUnsavedChangesPrompt;
