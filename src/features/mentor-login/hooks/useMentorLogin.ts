import { useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";

import { mentorLoginAPI, useAuth } from "@/entities";
import { ROUTE_PATHS } from "@/shared";

export const useMentorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: mentorLoginAPI,
    onSuccess: async () => {
      await login();
      navigate(ROUTE_PATHS.MENTOR_DASHBOARD, { replace: true });
    },
  });
};
