import { waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import {
  createApiErrorResponse,
  createApiSuccessResponse,
} from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { renderHookWithProviders } from "@/test/test-utils";

import type { UserInfoResponse } from "../apis";
import { useUserInfoStore } from "../store";

import { useGetUserInfo } from "./useGetUserInfo";

const MENTEE_USER_INFO: UserInfoResponse = {
  userId: "user-1",
  nickname: "테스트 사용자",
  profileUrl: "",
  role: "MENTEE",
};

describe("useGetUserInfo", () => {
  it("성공 응답이면 role 을 포함한 사용자 정보를 store 에 저장한다", async () => {
    const mentorUserInfo: UserInfoResponse = {
      ...MENTEE_USER_INFO,
      role: "MENTOR",
    };

    server.use(
      http.get("*/api/user/me", () => {
        return HttpResponse.json(createApiSuccessResponse(mentorUserInfo));
      }),
    );

    const { result } = renderHookWithProviders(() => useGetUserInfo());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(useUserInfoStore.getState().userInfo).toEqual(mentorUserInfo);
    expect(useUserInfoStore.getState().persistedProfile).toEqual({
      nickname: mentorUserInfo.nickname,
      profileUrl: mentorUserInfo.profileUrl,
      role: mentorUserInfo.role,
    });
  });

  it("에러 응답이면 기존 store 값을 초기화한다", async () => {
    useUserInfoStore.getState().setUserInfo(MENTEE_USER_INFO);

    server.use(
      http.get("*/api/user/me", () => {
        return HttpResponse.json(createApiErrorResponse());
      }),
    );

    const { result } = renderHookWithProviders(() => useGetUserInfo());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(useUserInfoStore.getState().userInfo).toBeNull();
    expect(useUserInfoStore.getState().persistedProfile).toBeNull();
  });
});
