import React from "react";
import {
  Bath,
  Tv,
  Coffee,
  Sparkles,
} from "../../../../components/common/Icons";
import type { RoomAmenityGroup } from "../../../../types/hotel";

interface RoomAmenitiesProps {
  groups: RoomAmenityGroup[];
}

export const RoomAmenities: React.FC<RoomAmenitiesProps> = ({ groups }) => {
  // Compute total amenities
  const totalCount = groups.reduce((acc, grp) => acc + grp.items.length, 0);

  const getGroupIcon = (title: string, iconName?: string) => {
    const key = (iconName || title).toLowerCase();
    if (key.includes("tắm") || key.includes("bath"))
      return <Bath className="w-4 h-4 text-[#1677FF]" />;
    if (key.includes("nghệ") || key.includes("trí") || key.includes("tv"))
      return <Tv className="w-4 h-4 text-[#1677FF]" />;
    if (key.includes("thực") || key.includes("uống") || key.includes("coffee"))
      return <Coffee className="w-4 h-4 text-[#1677FF]" />;
    return <Sparkles className="w-4 h-4 text-[#1677FF]" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Tiện nghi phòng cao cấp
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Trang bị tiêu chuẩn 5 sao sang trọng
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1677FF] border border-blue-100 shadow-2xs">
          {totalCount} tiện ích
        </span>
      </div>

      {/* Amenity Sub-groups */}
      <div className="space-y-3.5">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className="rounded-xl p-3.5 sm:p-4 bg-slate-50/70 border border-slate-100 hover:border-blue-100 transition-colors"
          >
            {/* Group Title with Blue Icon */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-[#1677FF] flex items-center justify-center shrink-0">
                {getGroupIcon(group.groupTitle, group.iconName)}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                {group.groupTitle}
              </h4>
            </div>

            {/* 2-Column List with Blue Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] mt-1.5 shrink-0" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAmenities;