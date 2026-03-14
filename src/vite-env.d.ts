/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_LOGIN_URL?: string;
  readonly VITE_KAKAO_LOGIN_URL_LOCAL?: string;
  readonly VITE_KAKAO_LOGIN_URL_PROD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
