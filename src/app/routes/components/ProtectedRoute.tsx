import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "@/entities";
import { ROUTE_PATHS } from "@/shared";

type Props = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
