import { useMutation } from "@tanstack/react-query";

import { saveStepResultAPI } from "../apis";

export const useSaveStepResult = () => {
  return useMutation({
    mutationFn: saveStepResultAPI,
  });
};
