import { SERVER_PATH } from "../constants";

import { attachTokenReissueInterceptor, initInstance } from "./axios-instance";

export const fetchInstance = initInstance({
  baseURL: SERVER_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

attachTokenReissueInterceptor(fetchInstance);
