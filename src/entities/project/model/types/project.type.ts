export interface Project {
  projectId: string;
  title: string;
  roadmapType: RoadmapType;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectListProject extends Project {
  currentStepOrder: number | null;
  totalStepCount: number;
  completedStepCount: number;
  progressPercent: number;
  updatedAt: string;
  completedAt: string | null;
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

export type ProjectStepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface ProjectStepSummary {
  stepId: string;
  stepCode: string;
  stepOrder: number;
  status: ProjectStepStatus;
  completedAt: string | null;
}

export interface ProjectStepPrompt {
  stepId: string;
  stepCode: string;
  stepName: string;
  providedPromptSnapshot: string;
  editedPrompt: string | null;
  finalPrompt: string;
  addedCount: number;
  removedCount: number;
  diffJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStepResult {
  stepId: string;
  stepCode: string;
  stepName: string;
  contentMarkdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStepSelfCheckItem {
  key: string;
  question: string;
  answer: string | null;
}

export interface ProjectStepSelfCheck {
  selfCheckId: string | null;
  stepId: string;
  stepCode: string;
  stepName: string;
  checkItems: ProjectStepSelfCheckItem[];
  submittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type ProjectStepAiMessageSender = "USER" | "ASSISTANT";

export type ProjectStepAiMessageType = "CHAT" | "REASK_WITH_EDITED_PROMPT";

export interface ProjectStepAiMessage {
  aiMessageId: string;
  turnId: string;
  sender: ProjectStepAiMessageSender;
  messageType: ProjectStepAiMessageType;
  content: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  createdAt: string;
}

export interface ProjectStepResponse {
  stepCode: string;
  stepName: string;
  providedPromptSnapshot: string;
  userEditedPrompt?: string | null;
  userSubmittedResult: string | null;
  createdAt?: string;
  updatedAt?: string;
}
