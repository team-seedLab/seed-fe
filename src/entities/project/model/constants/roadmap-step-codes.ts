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
