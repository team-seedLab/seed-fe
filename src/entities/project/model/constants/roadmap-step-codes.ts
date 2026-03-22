import type { RoadmapType } from "../types";

export const ROADMAP_STEP_CODES: Record<RoadmapType, string[]> = {
  REPORT: [
    "constraint_analysis",
    "argument_structuring",
    "draft_generation",
    "report_revision",
  ],
  PAPER: ["planning", "drafting", "paper_revision", "submission"],
  PRESENTATION: [
    "message_extraction",
    "storyline",
    "slide_design",
    "script_generation",
  ],
  EXPERIMENT: [
    "requirement_definition",
    "design_method",
    "implementation",
    "evaluation",
  ],
  STUDY_SUMMARY: [
    "material_analysis",
    "knowledge_structuring",
    "summary_generation",
  ],
  STUDY_LEARNING: [
    "concept_definition",
    "knowledge_connection",
    "quiz_generation",
  ],
};

export const ROADMAP_STEP_NAMES: Record<string, string> = {
  constraint_analysis: "제약사항 분석 및 주제 구체화",
  argument_structuring: "핵심 논거 검색 및 구조화",
  draft_generation: "목차별 단락 초안 분할 생성",
  report_revision: "전체 맥락 교정",
  planning: "기획·근거 정렬",
  drafting: "초고 작성",
  paper_revision: "내용·구조 개정",
  submission: "편집·투고 준비",
  message_extraction: "발표 조건 분석 및 핵심 메시지 도출",
  storyline: "스토리라인",
  slide_design: "장표별 시각 자료 구성안 작성",
  script_generation: "시각 자료와 연동된 실전 대본 및 Q&A 작성",
  requirement_definition: "요구사항 정의",
  design_method: "설계 및 방법론 수립",
  implementation: "구현 및 실험 수행",
  evaluation: "검증, 분석 및 해석",
  material_analysis: "학습 자료 분석",
  knowledge_structuring: "지식 구조화",
  summary_generation: "학습 정리 자료 생성",
  concept_definition: "개념 정의",
  knowledge_connection: "연관 지식 연결",
  quiz_generation: "퀴즈/인출",
};
