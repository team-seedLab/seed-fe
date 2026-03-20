import type { RoadmapType } from "../types";

export type AssignmentType =
  | "리포트형"
  | "논문형"
  | "발표형"
  | "실험형"
  | "요약형"
  | "학습형";

export const ROADMAP_TYPE_MAP: Record<AssignmentType, RoadmapType> = {
  리포트형: "REPORT",
  논문형: "PAPER",
  발표형: "PRESENTATION",
  실험형: "EXPERIMENT",
  요약형: "STUDY_SUMMARY",
  학습형: "STUDY_LEARNING",
};
