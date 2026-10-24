import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../stores/store";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    const fullPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(fullPath)}`}
        replace
        state={{ from: fullPath }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;