import { create } from "zustand";
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { UserInfoResponse } from "../apis";
import { USER_ROLE } from "../constants";
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

const initialState: UserInfoState = {
  userInfo: null,
  persistedProfile: null,
};

const migrateUserRole = (role: unknown): UserRole | undefined => {
  if (role === "MENTOR" || role === USER_ROLE.MENTOR) {
    return USER_ROLE.MENTOR;
  }

  if (role === "MENTEE" || role === USER_ROLE.MENTEE) {
    return USER_ROLE.MENTEE;
  }

  return undefined;
};

const migratePersistedUserInfo = (persistedState: unknown) => {
  if (!persistedState || typeof persistedState !== "object") {
    return { persistedProfile: null } satisfies PersistedUserInfoState;
  }

  const state = persistedState as Partial<PersistedUserInfoState>;

  if (!state.persistedProfile) {
    return state;
  }

  return {
    ...state,
    persistedProfile: {
      ...state.persistedProfile,
      role: migrateUserRole(state.persistedProfile.role),
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
        version: 1,
        migrate: migratePersistedUserInfo,
      },
    ),
    {
      name: "user-info-store-devtools",
    },
  ),
);
