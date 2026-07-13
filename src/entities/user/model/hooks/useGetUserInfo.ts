import { useCallback, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { getUserInfoAPI } from "../apis";
import { useUserInfoStore } from "../store";

export const USER_INFO_QUERY_KEY = ["user-info", "user"] as const;

type UseGetUserInfoOptions = {
  enabled?: boolean;
  showErrorToast?: boolean;
};

export const useGetUserInfo = ({
  enabled = true,
  showErrorToast = false,
}: UseGetUserInfoOptions = {}) => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const clearUserInfo = useUserInfoStore((state) => state.clearUserInfo);

  const query = useQuery({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: () => getUserInfoAPI(),
    initialData: userInfo ?? undefined,
    enabled,
    retry: false,
    throwOnError: false,
    meta: {
      showErrorToast,
      errorMessage: "사용자 정보를 불러오지 못했습니다.",
    },
  });
  const { data, isError, refetch } = query;

  useEffect(() => {
    if (!data) {
      return;
    }

    setUserInfo(data);
  }, [data, setUserInfo]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    clearUserInfo();
  }, [isError, clearUserInfo]);

  const syncUserInfo = useCallback(async () => {
    try {
      const { data: refreshedUserInfo } = await refetch({
        throwOnError: true,
      });

      if (!refreshedUserInfo) {
        throw new Error("사용자 정보를 불러오지 못했습니다.");
      }

      setUserInfo(refreshedUserInfo);
    } catch (error) {
      clearUserInfo();
      throw error;
    }
  }, [clearUserInfo, refetch, setUserInfo]);

  return { ...query, syncUserInfo };
};
