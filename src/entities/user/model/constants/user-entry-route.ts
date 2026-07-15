import { ROUTE_PATHS } from "@/shared";

import type { UserRole } from "../types";

import { USER_ROLE } from "./user-role";

const USER_ENTRY_ROUTE_PATHS: Record<UserRole, string> = {
  [USER_ROLE.MENTOR]: ROUTE_PATHS.MENTOR_DASHBOARD,
  [USER_ROLE.MENTEE]: ROUTE_PATHS.MYPAGE,
};

export const getUserEntryRoutePath = (role?: UserRole | null) => {
  if (!role) {
    return ROUTE_PATHS.MYPAGE;
  }

  return USER_ENTRY_ROUTE_PATHS[role] ?? ROUTE_PATHS.MYPAGE;
};
