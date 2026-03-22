import type { ProjectDetailResponse } from "../../model";

export const PROJECT_DETAIL_MOCK: ProjectDetailResponse = {
  projectId: "c57b1b24-9d0b-4d26-b329-659830230ed2",
  title: "소프트웨어 공학 중간고사 요약",
  roadmapType: "STUDY_SUMMARY",
  status: "IN_PROGRESS",
  createdAt: "2026-03-21T18:31:46.21531",
  stepResponses: [
    {
      stepCode: "material_analysis",
      stepName: "자료 분석",
      providedPromptSnapshot:
        "[과목명] 창의융합종합설계 / [시험 출제 스타일] 창의융합종합설계 제안서의 핵심 내용을 분석하고, 특히 유저가 요구한 시스템의 4가지 테스트/검증 활동(입력 처리 검증, AI 모델 추론 검증, 외부 서비스 연동 테스트, 예외/루프 방지 테스트 등)을 도출하여 표 형태로 요약하는 데 집중함.\n# System Role\n다음 학습 자료를 분석해 주세요.\n[출력 형식]\n- 핵심 개념 및 키워드\n- 중요 정의\n- 시험 출제 예상 토픽\n// 교수님의 출제 스타일을 철저히 반영하여 한국어로 정리할 것",
      formatPrompt: "출력: 핵심 개념, 주요 정의, 예상 출제 주제.",
    },
    {
      stepCode: "knowledge_structuring",
      stepName: "지식 구조화",
      providedPromptSnapshot:
        "다음 정보를 구조화된 지식 형태로 정리해 주세요.\n# Task\n메인 개념과 하위 주제들을 트리 구조로 정리합니다.\n[출력 형식]\n- 메인 개념\n- 하위 주제들\n- 핵심 개념 간의 상호 관계\n// 트리 구조나 마인드맵 형태로 이해하기 쉽게 한국어로 구조화할 것",
      formatPrompt: "출력: 메인 개념, 하위 주제, 개념 간의 상관관계.",
    },
    {
      stepCode: "summary_generation",
      stepName: "요약본 생성",
      providedPromptSnapshot:
        "다음 문서를 조건에 맞춰 요약해 주세요.\n# Constraints\n요약 분량: 표를 포함하여 핵심 내용을 일목요연하게 정리한 A4 1장 내외\n[출력 형식]\n- 핵심 아이디어\n- 중요한 뒷받침 내용\n// 장황한 글이 아닌, 반드시 한눈에 들어오는 개조식(Bullet points) 한국어로 작성할 것",
      formatPrompt: "출력: 핵심 아이디어, 주요 뒷받침 근거.",
    },
  ],
};
