import type { Project } from "../../model";

export const PROJECT_LIST_MOCK: Project[] = [
  {
    projectId: "project-001",
    title: "환경학 개론 과제",
    roadmapType: "REPORT",
    status: "IN_PROGRESS",
    createdAt: "10분 전 생성됨",
  },
  {
    projectId: "project-002",
    title: "UI 디자인 시스템 구축",
    roadmapType: "DESIGN",
    status: "IN_PROGRESS",
    createdAt: "3시간 전 생성됨",
  },
  {
    projectId: "project-003",
    title: "2024 마케팅 기획안",
    roadmapType: "PLAN",
    status: "COMPLETED",
    createdAt: "어제 생성됨",
  },
  {
    projectId: "project-004",
    title: "졸업 논문 초안",
    roadmapType: "THESIS",
    status: "DRAFT",
    createdAt: "2일 전 생성됨",
  },
  {
    projectId: "project-005",
    title: "스타트업 피칭 자료",
    roadmapType: "PRESENTATION",
    status: "IN_PROGRESS",
    createdAt: "3일 전 생성됨",
  },
  {
    projectId: "project-006",
    title: "알고리즘 스터디 정리",
    roadmapType: "STUDY",
    status: "COMPLETED",
    createdAt: "지난 주 생성됨",
  },
  {
    projectId: "project-007",
    title: "데이터베이스 설계 보고서",
    roadmapType: "REPORT",
    status: "REVIEW",
    createdAt: "지난 주 생성됨",
  },
  {
    projectId: "project-008",
    title: "인공지능 개론 기말 과제",
    roadmapType: "ASSIGNMENT",
    status: "IN_PROGRESS",
    createdAt: "2주 전 생성됨",
  },
];
