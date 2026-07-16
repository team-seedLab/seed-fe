import { create } from "zustand";
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { UserInfoResponse } from "../apis";
import { USER_ROLE, isUserRole } from "../constants";
import type { UserRole } from "../types";

type PersistedUserProfile = Pick<
  UserInfoResponse,
  "nickname" | "profileUrl" | "role"
>;

type UserInfoState = {
  userInfo: UserInfoResponse | null;
  persistedProfile: PersistedUserProfile | null;
};

type UserInfoActions = {
  setUserInfo: (userInfo: UserInfoResponse) => void;
  clearUserInfo: () => void;
};

type PersistedUserInfoState = Pick<UserInfoState, "persistedProfile">;
type LegacyPersistedUserProfile = Omit<PersistedUserProfile, "role"> & {
  role?: unknown;
};
type LegacyPersistedUserInfoState = {
  persistedProfile?: LegacyPersistedUserProfile | null;
};

const initialState: UserInfoState = {
  userInfo: null,
  persistedProfile: null,
};

const migrateUserRole = (role: unknown): UserRole | undefined => {
  if (isUserRole(role)) {
    return role;
  }

  if (role === "MENTOR") {
    return USER_ROLE.MENTOR;
  }

  if (role === "MENTEE") {
    return USER_ROLE.MENTEE;
  }

  return undefined;
};

const migratePersistedUserInfo = (
  persistedState: unknown,
): PersistedUserInfoState => {
  if (!persistedState || typeof persistedState !== "object") {
    return { persistedProfile: null } satisfies PersistedUserInfoState;
  }

  const state = persistedState as LegacyPersistedUserInfoState;
  const persistedProfile = state.persistedProfile;

  if (!persistedProfile || typeof persistedProfile !== "object") {
    return { persistedProfile: null };
  }

  const role = migrateUserRole(persistedProfile.role);

  if (!role) {
    return { persistedProfile: null };
  }

  return {
    persistedProfile: {
      ...persistedProfile,
      role,
    },
  };
};

export const useUserInfoStore = create<UserInfoState & UserInfoActions>()(
  devtools(
    persist(
      immer(
        combine(initialState, (set) => ({
          setUserInfo: (userInfo: UserInfoResponse) =>
            set((state) => {
              state.userInfo = userInfo;
              state.persistedProfile = {
                nickname: userInfo.nickname,
                profileUrl: userInfo.profileUrl,
                role: userInfo.role,
              };
            }),
          clearUserInfo: () =>
            set((state) => {
              state.userInfo = null;
              state.persistedProfile = null;
            }),
        })),
      ),
      {
        name: "user-info-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ persistedProfile: state.persistedProfile }),
        version: 2,
        migrate: migratePersistedUserInfo,
      },
    ),
    {
      name: "user-info-store-devtools",
    },
  ),
);
