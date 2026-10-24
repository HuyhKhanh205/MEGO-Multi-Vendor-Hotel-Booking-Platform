import React from "react";
import {
  Maximize2,
  Eye,
  BedDouble,
  Users,
} from "../../../../components/common/Icons";

interface RoomSpecificationsProps {
  areaM2: number;
  view?: string;
  bedType: string;
  maxGuests: number;
}

export const RoomSpecifications: React.FC<RoomSpecificationsProps> = ({
  areaM2,
  view = "Biển trực diện",
  bedType,
  maxGuests,
}) => {
  const specs = [
    {
      id: "area",
      label: "Diện tích phòng",
      value: `${areaM2} m²`,
      icon: <Maximize2 className="w-5 h-5 text-[#1677FF]" />,
    },
    {
      id: "view",
      label: "Hướng nhìn",
      value: view || "Biển trực diện",
      icon: <Eye className="w-5 h-5 text-[#1677FF]" />,
    },
    {
      id: "bed",
      label: "Loại giường",
      value: bedType || "1 Giường King Super",
      icon: <BedDouble className="w-5 h-5 text-[#1677FF]" />,
    },
    {
      id: "capacity",
      label: "Sức chứa tối đa",
      value: `${maxGuests} Người lớn + 2 Trẻ em`,
      icon: <Users className="w-5 h-5 text-[#1677FF]" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
      {specs.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs hover:border-blue-200 transition-all flex items-center gap-3 group"
        >
          {/* Blue icon circle */}
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            {item.icon}
          </div>

          {/* Texts */}
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              {item.label}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 block truncate mt-0.5">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomSpecifications;