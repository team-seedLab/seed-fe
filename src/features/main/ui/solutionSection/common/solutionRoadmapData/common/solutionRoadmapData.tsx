import type { SolutionAssignmentCard } from "../../types/common/types";

// Static roadmap definitions for each assignment type shown in the solution section.
// solution 섹션에서 보여주는 과제 유형별 로드맵 정적 데이터
const ICON_WRITING = {
  paths: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M9 15l2 2 4-4",
  ],
};

const ICON_PAPER = {
  paths: ["M3 10l9-5 9 5-9 5-9-5z", "M7 12v4a5 5 0 0 0 10 0v-4", "M21 10v5"],
};

const ICON_PRESENTATION = {
  paths: ["M3 4h18v12H3z", "M12 16v4", "M8 20h8", "M8 8h8", "M8 11h5"],
};

const ICON_LAB = {
  paths: ["M10 2v5l-5 8a4 4 0 0 0 3.4 6h7.2A4 4 0 0 0 19 15l-5-8V2", "M8 7h8"],
};

const ICON_SUMMARY = {
  paths: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M8 13h8",
    "M8 17h8",
  ],
};

const ICON_STUDY = {
  paths: [
    "M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z",
    "M20 4h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7z",
  ],
};

const ROADMAP_ICON_ANALYZE = {
  paths: ["M11 18a7 7 0 1 1 4.95-2.05L21 21"],
};

const ROADMAP_ICON_STRUCTURE = {
  paths: [
    "M4 5h6v4H4z",
    "M14 5h6v4h-6z",
    "M9 17h6v4H9z",
    "M7 9v3",
    "M17 9v3",
    "M12 12v5",
  ],
};

const ROADMAP_ICON_PROMPT = {
  paths: [
    "M6 3v12",
    "M6 9h10",
    "M16 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    "M6 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  ],
};

const ROADMAP_ICON_FINISH = {
  paths: ["M20 6L9 17l-5-5"],
};

export const SOLUTION_ASSIGNMENT_CARDS: SolutionAssignmentCard[] = [
  {
    id: "writing",
    title: "글쓰기형",
    description: "리포트, 논평",
    icon: ICON_WRITING,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "제약사항 분석 및 주제 구체화",
        description:
          "과제 PDF에서 추출한 내용과 사용자의 의도를 변수에 저장해 맥락을 형성합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "핵심 논거 검색 및 구조화",
        description:
          "구조화 능력 부재로 인한 시간 낭비를 줄이기 위해 뼈대를 먼저 확정합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "목차별 단락 초안 분할 생성",
        description: "2단계 결과를 바탕으로 섹션별 초안을 분할 생성합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
      {
        stepNumber: 4,
        title: "전체 맥락 교정",
        description:
          "상위 10% 수준 결과물을 위해 전체 흐름을 최종 포맷팅합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_FINISH,
      },
    ],
  },
  {
    id: "paper",
    title: "논문형",
    description: "논문 작성",
    icon: ICON_PAPER,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "기획•근거 정렬",
        description: "글쓰기 사전 기획으로 주제, 질문, 목차를 먼저 고정합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "초고 작성",
        description: "검토 가능한 서론부터 결론까지의 전체 초안을 완성합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "내용•구조 개정",
        description: "논리와 근거를 재정렬하여 설득력 있는 구조로 보정합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
      {
        stepNumber: 4,
        title: "편집•투고 준비",
        description: "문장, 형식, 참고문헌을 정리해 제출 패키지를 완성합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_FINISH,
      },
    ],
  },
  {
    id: "presentation",
    title: "발표형",
    description: "PPT 제작, 대본",
    icon: ICON_PRESENTATION,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "발표 조건 분석 및 핵심 메시지 도출",
        description:
          "발표 시간과 타겟 등 제약조건을 초기 고정값으로 명확화합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "스토리라인",
        description:
          "전달 흐름이 자연스럽도록 발표의 핵심 스토리라인을 수립합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "장표별 시각 자료 구성안 작성",
        description: "장표별 텍스트와 시각 자료의 배치를 먼저 기획합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
      {
        stepNumber: 4,
        title: "시각 자료와 연동된 실전 대본 및 Q&A 작성",
        description:
          "슬라이드와 동기화된 실전 대본과 예상 질문 답변을 구성합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_FINISH,
      },
    ],
  },
  {
    id: "lab",
    title: "실습형",
    description: "실험 보고서",
    icon: ICON_LAB,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "요구사항 정의",
        description: "제약조건, 성능 지표, 기본 변수를 명확히 정의합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "설계 및 방법론 수립",
        description:
          "실험 또는 알고리즘 설계와 변수, 절차를 구체적으로 결정합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "구현 및 실험 수행",
        description:
          "구현과 실험을 수행하며 발생하는 오류를 단계별로 해결합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
      {
        stepNumber: 4,
        title: "검증, 분석 및 해석",
        description:
          "결과를 검증하고 가설을 해석해 재설계 또는 마무리를 결정합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_FINISH,
      },
    ],
  },
  {
    id: "summary",
    title: "요약형",
    description: "핵심 요약 정리",
    icon: ICON_SUMMARY,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "학습 자료 분석",
        description: "업로드 자료에서 핵심 의제와 키워드를 먼저 추출합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "지식 구조화",
        description: "파편화된 정보를 논리적 위계로 재배치해 구조화합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "학습 정리 자료 생성",
        description:
          "구조화 결과를 기반으로 다양한 형식의 최종 요약을 생성합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
    ],
  },
  {
    id: "study",
    title: "학습형",
    description: "퀴즈, 개념 학습",
    icon: ICON_STUDY,
    roadmapSteps: [
      {
        stepNumber: 1,
        title: "개념 정의",
        description:
          "사용자 제공 정보와 관련된 핵심 개념부터 명확히 정의합니다.",
        tagLabel: "이론 배경 분석",
        icon: ROADMAP_ICON_ANALYZE,
      },
      {
        stepNumber: 2,
        title: "연관 지식 연결",
        description: "연관 개념을 연결해 학습 맥락을 확장합니다.",
        tagLabel: "데이터 구조화",
        icon: ROADMAP_ICON_STRUCTURE,
      },
      {
        stepNumber: 3,
        title: "퀴즈/인출",
        description: "질문-답변형 퀴즈로 인출 학습 자료를 생성합니다.",
        tagLabel: "심화 분석 프롬프트",
        icon: ROADMAP_ICON_PROMPT,
      },
    ],
  },
];
