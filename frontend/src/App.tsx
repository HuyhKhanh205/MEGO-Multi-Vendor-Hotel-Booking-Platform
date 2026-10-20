import { useState } from "react";
import { Link } from "react-router-dom";
import AppRoutes from "./routers/AppRoutes";

function App() {
  const [showDevPanel, setShowDevPanel] = useState(false);

  return (
    <>
      {/* Main Application Routing with Header */}
      <AppRoutes />

      {/* Floating Dev Router Helper (collapsed by default so Header is cleanly at top) */}
      <div className="fixed bottom-4 right-4 z-50">
        {!showDevPanel ? (
          <button
            type="button"
            onClick={() => setShowDevPanel(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/90 hover:bg-gray-900 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-105"
            title="Mở thanh chuyển đổi nhanh các vai trò"
          >
            <span>🧭</span>
            <span>Switch Role</span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-3 shadow-xl w-64 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800">🏨 Chuyển vai trò test</span>
              <button
                type="button"
                onClick={() => setShowDevPanel(false)}
                className="text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              <Link
                to="/"
                onClick={() => setShowDevPanel(false)}
                className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-center"
              >
                🏨 Guest
              </Link>
              <Link
                to="/customer"
                onClick={() => setShowDevPanel(false)}
                className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-center"
              >
                👤 Customer
              </Link>
              <Link
                to="/partner"
                onClick={() => setShowDevPanel(false)}
                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-center"
              >
                🏢 Partner
              </Link>
              <Link
                to="/admin"
                onClick={() => setShowDevPanel(false)}
                className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-center"
              >
                🛠️ Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
