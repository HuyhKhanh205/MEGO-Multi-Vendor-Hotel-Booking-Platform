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
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100/70 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        {/* Bell Icon */}
        <svg
          className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Small Red Dot indicating unread */}
        {unreadCount > 0 && (
          <span
            aria-label="Có thông báo mới"
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/70 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900">Thông báo</h4>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                Dữ liệu demo
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11.5px] text-[#1677FF] hover:text-blue-700 font-medium hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">
                Không có thông báo nào.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-gray-50 flex items-start gap-3 ${
                    !item.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === "promo"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-[#1677FF]"
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
                      <p className={`text-[12.5px] leading-snug ${!item.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11.5px] text-gray-500 line-clamp-2 mt-0.5">
                      {item.content}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 text-center bg-gray-50/70 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">
              Hệ thống thông báo thời gian thực MeGo
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
