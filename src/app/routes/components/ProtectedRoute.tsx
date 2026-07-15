import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import {
  type UserRole,
  getUserEntryRoutePath,
  isUserRole,
  useAuth,
  useUserInfoStore,
} from "@/entities";
import { ROUTE_PATHS } from "@/shared";

type Props = {
  allowedRoles?: readonly UserRole[];
  children: ReactNode;
};

export const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, isLoading } = useAuth();
  const role = useUserInfoStore((state) => {
    return state.userInfo?.role ?? state.persistedProfile?.role;
  });
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />
    );
  }

  if (allowedRoles) {
    if (!isUserRole(role)) {
      return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
    }

    if (!allowedRoles.includes(role)) {
      return <Navigate to={getUserEntryRoutePath(role)} replace />;
    }
  }

  return <>{children}</>;
};
