import { useMutation } from "@tanstack/react-query";

import { createProjectAPI } from "../apis";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: createProjectAPI,
  });
};
