import { describe, expect, it } from "vitest";

import type { UserInfoResponse } from "../apis";
import { USER_ROLE } from "../constants";

import { useUserInfoStore } from "./user-info.store";

const USER_INFO: UserInfoResponse = {
  userId: "user-1",
  nickname: "테스트 사용자",
  profileUrl: "https://example.com/profile.png",
  role: USER_ROLE.MENTEE,
};

describe("useUserInfoStore", () => {
  it("setUserInfo 호출 시 userInfo 와 persistedProfile 에 role 을 저장한다", () => {
    useUserInfoStore.getState().setUserInfo(USER_INFO);

    const { userInfo, persistedProfile } = useUserInfoStore.getState();

    expect(userInfo).toEqual(USER_INFO);
    expect(persistedProfile).toEqual({
      nickname: USER_INFO.nickname,
      profileUrl: USER_INFO.profileUrl,
      role: USER_INFO.role,
    });
  });

  it("clearUserInfo 호출 시 userInfo 와 persistedProfile 을 초기화한다", () => {
    useUserInfoStore.getState().setUserInfo(USER_INFO);

    useUserInfoStore.getState().clearUserInfo();

    const { userInfo, persistedProfile } = useUserInfoStore.getState();

    expect(userInfo).toBeNull();
    expect(persistedProfile).toBeNull();
  });

  it.each([
    ["MENTOR", USER_ROLE.MENTOR],
    ["MENTEE", USER_ROLE.MENTEE],
  ])(
    "기존 역할값 %s를 현재 역할값으로 마이그레이션한다",
    async (role, expected) => {
      sessionStorage.setItem(
        "user-info-store",
        JSON.stringify({
          state: {
            persistedProfile: {
              nickname: "user",
              profileUrl: "",
              role,
            },
          },
          version: 0,
        }),
      );

      await useUserInfoStore.persist.rehydrate();

      expect(useUserInfoStore.getState().persistedProfile?.role).toBe(expected);
    },
  );

  it.each([undefined, "ROLE_ADMIN"])(
    "version 1 프로필의 역할값이 %s이면 프로필을 초기화한다",
    async (role) => {
      sessionStorage.setItem(
        "user-info-store",
        JSON.stringify({
          state: {
            persistedProfile: {
              nickname: "user",
              profileUrl: "",
              role,
            },
          },
          version: 1,
        }),
      );

      await useUserInfoStore.persist.rehydrate();

      expect(useUserInfoStore.getState().persistedProfile).toBeNull();
    },
  );

  it.each([USER_ROLE.MENTEE, USER_ROLE.MENTOR])(
    "version 1 프로필의 현재 역할값 %s를 보존한다",
    async (role) => {
      sessionStorage.setItem(
        "user-info-store",
        JSON.stringify({
          state: {
            persistedProfile: {
              nickname: "user",
              profileUrl: "",
              role,
            },
          },
          version: 1,
        }),
      );

      await useUserInfoStore.persist.rehydrate();

      expect(useUserInfoStore.getState().persistedProfile?.role).toBe(role);
    },
  );
});
