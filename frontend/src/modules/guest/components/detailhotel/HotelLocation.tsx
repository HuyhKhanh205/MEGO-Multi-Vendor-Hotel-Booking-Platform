import { MapPin, ExternalLink, Navigation } from "../../../../components/common/Icons";

interface HotelLocationProps {
  hotelName: string;
  address: string;
  city: string;
  district: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const DEFAULT_NEARBY = [
  { name: "Bãi biển gần nhất", distance: "50m", icon: "🏖️" },
  { name: "Trung tâm mua sắm & ẩm thực", distance: "1.2km", icon: "🛍️" },
  { name: "Địa điểm tham quan nổi tiếng", distance: "3.5km", icon: "🏛️" },
  { name: "Sân bay gần nhất", distance: "5.5km", icon: "✈️" },
];

export const HotelLocation = ({
  hotelName,
  address,
  city,
  location,
}: HotelLocationProps) => {
  const lat = location?.lat || 16.0544;
  const lng = location?.lng || 108.2022;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotelName}, ${address}`
  )}`;

  return (
    <section id="location-section" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* ── Section Title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Vị trí & Địa điểm xung quanh
          </h2>
          <div className="h-1 w-12 bg-[#1677FF] rounded-full" />
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1677FF] text-xs font-bold transition-all"
        >
          <span>Mở trên Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Address Text */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium">
        <MapPin className="w-4 h-4 text-[#1677FF] shrink-0" />
        <span>{address}</span>
      </div>

      {/* ── Visual Map Card Simulation ── */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-64 sm:h-72 border border-slate-700 shadow-inner flex flex-col justify-between p-4 sm:p-6 group">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#60A5FA 1px, transparent 1px), linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />

        {/* Top Info Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 backdrop-blur-md border border-slate-700 text-white text-xs font-medium">
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span>Khu vực: {city}</span>
          </div>

          <span className="text-[11px] text-slate-400">
            Tọa độ: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
          </span>
        </div>

        {/* Center Animated Hotel Pin */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
            <div className="w-12 h-12 rounded-2xl bg-[#1677FF] text-white flex items-center justify-center shadow-xl border-2 border-white relative z-10">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <span className="mt-2 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white font-bold text-xs border border-slate-700 shadow-md max-w-xs truncate text-center">
            {hotelName}
          </span>
        </div>

        {/* Bottom CTA to View in External Maps */}
        <div className="relative z-10 text-center">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Chỉ đường trực tiếp bằng Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── Nearby Landmarks Grid ── */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Khoảng cách đến các điểm lân cận
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {DEFAULT_NEARBY.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs text-slate-700 font-medium truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold text-[#1677FF] shrink-0">
                {item.distance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
