import React, { useState, useRef, useEffect } from "react";
import { DEMO_NOTIFICATIONS } from "./headerData";
import type { NotificationItem } from "./types";

interface NotificationPopoverProps {
  className?: string;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  className = "",
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DEMO_NOTIFICATIONS
  );
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Thông báo ${unreadCount > 0 ? `(${unreadCount} chưa đọc)` : ""}`}
        className="relative p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer
          text-gray-600 hover:text-blue-600 hover:bg-gray-100/70
          dark:text-[var(--icon-default)] dark:hover:text-[var(--brand-primary)] dark:hover:bg-[var(--bg-surface-hover)]"
      >
        <svg className="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span
            aria-label="Có thông báo mới"
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-[var(--header-bg)]"
          />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          style={{
            backgroundColor: "var(--popover-bg)",
            borderColor: "var(--popover-border)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Thông báo
              </h4>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium dark:bg-amber-900/30 dark:text-amber-400">
                Dữ liệu demo
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11.5px] text-[#1677FF] hover:text-blue-700 font-medium hover:underline dark:text-[var(--brand-primary)]"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div
            className="max-h-80 overflow-y-auto"
            style={{ borderColor: "var(--border-light)" }}
          >
            {notifications.length === 0 ? (
              <div
                className="p-6 text-center text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={`p-3.5 text-left transition-colors cursor-pointer flex items-start gap-3 border-b last:border-b-0`}
                  style={{
                    borderColor: "var(--border-light)",
                    backgroundColor: !item.isRead
                      ? "color-mix(in srgb, var(--brand-primary-bg) 40%, transparent)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--bg-surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      !item.isRead
                        ? "color-mix(in srgb, var(--brand-primary-bg) 40%, transparent)"
                        : "transparent";
                  }}
                >
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === "promo"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-[#1677FF] dark:bg-[var(--brand-primary-bg)] dark:text-[var(--brand-primary)]"
                    }`}
                  >
                    {item.type === "promo" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2m0 13a2 2 0 102 2 2 2 0 00-2-2zm0 0a2 2 0 10-2 2 2 2 0 002-2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-[12.5px] leading-snug ${
                          !item.isRead ? "font-bold" : "font-medium"
                        }`}
                        style={{
                          color: !item.isRead
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0 dark:bg-[var(--brand-primary)]" />
                      )}
                    </div>
                    <p
                      className="text-[11.5px] line-clamp-2 mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.content}
                    </p>
                    <span
                      className="text-[10px] mt-1 block"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="p-2 text-center border-t"
            style={{
              backgroundColor: "var(--bg-muted)",
              borderColor: "var(--border-light)",
            }}
          >
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Hệ thống thông báo thời gian thực MeGo
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
