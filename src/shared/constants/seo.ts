export type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
};

export const DEFAULT_SEO: SeoConfig = {
  title: "과제 고민 끝, 대학생 맞춤형 AI 프로젝트 가이드 - SEED",
  description:
    "하룻밤 검색형 프로젝트 아이디어로 끝내지 않고 과제에 맞는 로드맵을 제시합니다. 한 번의 복사로 서론, 초안, 배경과 결과물까지 만들어보세요.",
  path: "/",
};

export const LOGIN_PAGE_SEO: SeoConfig = {
  title: "로그인 - SEED",
  description: "SEED에 로그인하세요.",
  noindex: true,
};

export const MENTOR_LOGIN_PAGE_SEO: SeoConfig = {
  title: "멘토 로그인 - SEED",
  description: "SEED mini PoC 멘토 로그인 페이지입니다.",
  noindex: true,
};
