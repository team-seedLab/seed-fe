export type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
};

export const DEFAULT_SEO: SeoConfig = {
  title: "과제 고민 끝, 대학생 맞춤형 AI 프롬프트 가이드 - SEED",
  description:
    "수만 개의 성공적인 프롬프트 데이터로 당신의 과제에 딱 맞는 로드맵을 제시합니다. 원클릭 복사로 논문, 레포트 등 완벽한 결과물을 만들어보세요.",
  path: "/",
};

export const LOGIN_PAGE_SEO: SeoConfig = {
  title: "로그인 - SEED",
  description: "SEED에 로그인하세요.",
  noindex: true,
};
