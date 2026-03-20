import { useMutation } from "@tanstack/react-query";

import { startStepAPI } from "../apis";

export const useStartStep = () => {
  return useMutation({
    mutationFn: startStepAPI,
  });
};
