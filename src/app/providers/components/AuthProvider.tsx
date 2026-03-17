import { type ReactNode, useCallback, useEffect, useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import {
  AuthContext,
  USER_INFO_QUERY_KEY,
  logoutAPI,
  useGetUserInfo,
  useUserInfoStore,
} from "@/entities";
import { getApiErrorMessage, queryClient, toaster } from "@/shared";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const persistedProfile = useUserInfoStore((state) => state.persistedProfile);
  const clearUserInfo = useUserInfoStore((state) => state.clearUserInfo);
  const { isFetching, isPending, refetch } = useGetUserInfo({
    showErrorToast: false,
  });

  const clearAuthSession = useCallback(() => {
    clearUserInfo();
    queryClient.removeQueries({ queryKey: USER_INFO_QUERY_KEY });
  }, [clearUserInfo]);

  const syncAuthState = useCallback(() => {
    void refetch();
  }, [refetch]);

  const { mutate: logoutMutate, isPending: isLogoutPending } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      clearAuthSession();
      toaster.create({
        type: "success",
        description: "로그아웃되었습니다.",
      });
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    },
  });

  useEffect(() => {
    window.addEventListener("focus", syncAuthState);
    return () => window.removeEventListener("focus", syncAuthState);
  }, [syncAuthState]);

  const checkAuth = syncAuthState;

  const login = syncAuthState;

  const logout = useCallback(() => {
    logoutMutate();
  }, [logoutMutate]);

  const isAuthenticated = Boolean(userInfo) || Boolean(persistedProfile);
  const isLoading =
    isPending || (isFetching && !isAuthenticated) || isLogoutPending;

  const authContextValue = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout, checkAuth }),
    [checkAuth, isAuthenticated, isLoading, login, logout],
  );

  return <AuthContext value={authContextValue}>{children}</AuthContext>;
};
