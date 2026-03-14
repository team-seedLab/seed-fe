const DEFAULT_SERVER_PATH_LOCAL = "http://localhost:8080";
const DEFAULT_SERVER_PATH_PROD = "https://api.seedlab.cloud";

export const SERVER_PATH_LOCAL =
  import.meta.env.VITE_SERVER_URL_LOCAL ?? DEFAULT_SERVER_PATH_LOCAL;

export const SERVER_PATH_PROD =
  import.meta.env.VITE_SERVER_URL_PROD ?? DEFAULT_SERVER_PATH_PROD;

export const SERVER_PATH = import.meta.env.DEV
  ? SERVER_PATH_LOCAL
  : SERVER_PATH_PROD;
