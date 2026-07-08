import { describe, expect, it } from "vitest";

import type { UserInfoResponse } from "../apis";

import { useUserInfoStore } from "./user-info.store";

const USER_INFO: UserInfoResponse = {
  userId: "user-1",
  nickname: "테스트 사용자",
  profileUrl: "https://example.com/profile.png",
  role: "MENTEE",
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
});
