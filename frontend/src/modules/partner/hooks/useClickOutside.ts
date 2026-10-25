import { useEffect, type RefObject } from "react";

/** Đóng popover khi click ra ngoài hoặc nhấn Escape. */
export const useClickOutside = (ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!active) return;
    const handlePointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [ref, active, onClose]);
};
