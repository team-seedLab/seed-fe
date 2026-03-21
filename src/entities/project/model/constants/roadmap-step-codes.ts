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
    "concept_definition",
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
  constraint_analysis: "제약사항 분석",
  argument_structuring: "논거 구조화",
  draft_generation: "초안 생성",
  report_revision: "교정 및 검토",
  planning: "연구 계획",
  drafting: "초고 작성",
  paper_revision: "교정 및 검토",
  submission: "투고 준비",
  message_extraction: "메세지 추출",
  storyline: "스토리라인 작성",
  slide_design: "슬라이드 디자인",
  script_generation: "스크립트 생성",
  concept_definition: "개념 정의",
  design_method: "실험 설계",
  implementation: "실험 진행",
  evaluation: "결과 평가",
  material_analysis: "자료 분석",
  knowledge_structuring: "지식 구조화",
  summary_generation: "요약본 생성",
  knowledge_connection: "지식 연결",
  quiz_generation: "퀴즈 생성",
};
