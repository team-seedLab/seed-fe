import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toaster } from "@/shared";

import { deleteProjectAPI } from "../apis";
import { projectKeys } from "../constants";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toaster.create({
        type: "success",
        description: "프로젝트가 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    },
  });
};
