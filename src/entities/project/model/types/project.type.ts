export interface Project {
  projectId: string;
  title: string;
  roadmapType: RoadmapType;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectInitialContext {
  topic: string;
  concept: string;
  difficulty: string;
  target_level: string;
}

export type RoadmapType =
  | "REPORT"
  | "PAPER"
  | "PRESENTATION"
  | "EXPERIMENT"
  | "STUDY_SUMMARY"
  | "STUDY_LEARNING";

export type ProjectStatus = "IN_PROGRESS" | "COMPLETED";

export interface ProjectStepResponse {
  stepCode: string;
  stepName: string;
  providedPromptSnapshot: string;
  formatPrompt: string;
}
