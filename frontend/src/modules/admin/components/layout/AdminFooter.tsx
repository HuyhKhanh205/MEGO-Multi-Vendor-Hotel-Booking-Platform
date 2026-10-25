import React from "react";

export const AdminFooter: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/70 px-4 sm:px-8 py-3 text-[11px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2.5">
      <div className="flex items-center gap-2">
        <span>© 2026 MeGo Hospitality Platform. All rights reserved. Enterprise Core v2.4.12</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 text-slate-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          ISO/IEC 27001 Certified
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-slate-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          SOC-2 Type II Validated
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">256-bit TLS Gateway</span>
      </div>
    </footer>
  );
};

export default AdminFooter;
