import React from "react";
import { TOP_NOTIFICATION } from "./offersData";

export const TopNotificationBar: React.FC = () => {
  return (
    <aside aria-label="Thông báo ưu đãi" className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            {TOP_NOTIFICATION.badge}
          </span>
          <span className="font-medium text-on-primary-container truncate max-w-[280px] sm:max-w-md lg:max-w-none">
            {TOP_NOTIFICATION.message}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-5 text-xs text-on-primary-container">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-medium">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            {TOP_NOTIFICATION.guarantee}
          </span>
          <span className="text-on-primary-container/40">•</span>
          <a
            href="tel:19006868"
            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            Hotline VIP: {TOP_NOTIFICATION.hotline}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default TopNotificationBar;
