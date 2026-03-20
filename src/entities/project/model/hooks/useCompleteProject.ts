import { useMutation } from "@tanstack/react-query";

import { completeProjectAPI } from "../apis";

export const useCompleteProject = () => {
  return useMutation({
    mutationFn: completeProjectAPI,
  });
};
