import { ROUTE_PATHS } from "@/shared";

import type { UserRole } from "../types";

const USER_ENTRY_ROUTE_PATHS: Partial<Record<UserRole, string>> = {
  MENTOR: ROUTE_PATHS.MENTOR_DASHBOARD,
  MENTEE: ROUTE_PATHS.MYPAGE,
};

export const getUserEntryRoutePath = (role?: UserRole | null) => {
  if (!role) {
    return ROUTE_PATHS.MYPAGE;
  }

  return USER_ENTRY_ROUTE_PATHS[role] ?? ROUTE_PATHS.MYPAGE;
};
