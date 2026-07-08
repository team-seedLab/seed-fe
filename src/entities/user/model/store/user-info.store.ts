import { create } from "zustand";
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { UserInfoResponse } from "../apis";

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

const initialState: UserInfoState = {
  userInfo: null,
  persistedProfile: null,
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
      },
    ),
    {
      name: "user-info-store-devtools",
    },
  ),
);
