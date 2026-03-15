import { QueryCache, QueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toaster } from "../utils";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.showErrorToast !== true) {
        return;
      }

      const message =
        typeof query.meta?.errorMessage === "string"
          ? query.meta.errorMessage
          : getApiErrorMessage(error);

      toaster.create({
        type: "error",
        description: message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 3,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
  },
});
