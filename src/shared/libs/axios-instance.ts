import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

export const initInstance = (config: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 2000,
    ...config,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...config.headers,
    },
  });

  return instance;
};

type RetryAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const REISSUE_ENDPOINT = "/api/auth/reissue";

const shouldReissueToken = (
  error: AxiosError,
  requestConfig?: RetryAxiosRequestConfig,
) => {
  if (!requestConfig) {
    return false;
  }

  if (error.response?.status !== 401) {
    return false;
  }

  if (requestConfig._retry) {
    return false;
  }

  return !requestConfig.url?.includes(REISSUE_ENDPOINT);
};

export const attachTokenReissueInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryAxiosRequestConfig
        | undefined;

      if (!shouldReissueToken(error, originalRequest)) {
        return Promise.reject(error);
      }

      if (!originalRequest) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await axios.post(REISSUE_ENDPOINT, undefined, {
          baseURL: instance.defaults.baseURL,
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        return instance(originalRequest);
      } catch (reissueError) {
        return Promise.reject(reissueError);
      }
    },
  );
};
