import type {
  MentorProjectReviewStatus,
  Project,
  ProjectStatus,
  ProjectStepStatus,
  RoadmapType,
} from "../types";

type MentorProjectStepPromptApiResponse = {
  providedPromptSnapshot: string;
  editedPrompt: string | null;
  addedCount: number | null;
  removedCount: number | null;
  diffJson: Record<string, unknown> | null;
};

type MentorProjectStepResultApiResponse = {
  contentMarkdown: string | null;
};

export type MentorProjectStepSelfCheckItem = {
  key: string;
  question: string;
  answer: string | null;
};

export type MentorProjectStepSelfCheck = {
  checkItems: MentorProjectStepSelfCheckItem[];
  submittedAt: string | null;
};

type MentorProjectStepDetailApiResponse = {
  stepId: string;
  stepCode: string;
  stepName: string;
  stepOrder: number;
  status: ProjectStepStatus;
  completedAt: string | null;
  prompt: MentorProjectStepPromptApiResponse | null;
  result: MentorProjectStepResultApiResponse | null;
  selfCheck: MentorProjectStepSelfCheck | null;
};

export type MentorProjectDetailApiResponse = {
  projectId: string;
  studentId: string;
  studentNickname: string;
  title: string;
  roadmapType: RoadmapType;
  projectStatus: ProjectStatus;
  desiredOutcome: string | null;
  keyFocus: string | null;
  requiredElements: string | null;
  reviewStatus: MentorProjectReviewStatus;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  steps: MentorProjectStepDetailApiResponse[];
};

export type MentorProjectStepPrompt = {
  providedPromptSnapshot: string;
  editedPrompt: string | null;
  finalPrompt: string;
  addedCount: number;
  removedCount: number;
  diffJson: Record<string, unknown> | null;
};

export type MentorProjectStepResult = {
  contentMarkdown: string;
};

export type MentorProjectStepDetail = {
  stepId: string;
  stepCode: string;
  stepName: string;
  stepOrder: number;
  status: ProjectStepStatus;
  completedAt: string | null;
  prompt: MentorProjectStepPrompt | null;
  result: MentorProjectStepResult | null;
  selfCheck: MentorProjectStepSelfCheck | null;
};

export interface MentorProjectDetailResponse extends Project {
  studentId: string;
  studentNickname: string;
  desiredOutcome: string | null;
  keyFocus: string | null;
  requiredElements: string | null;
  reviewStatus: MentorProjectReviewStatus;
  reviewedAt: string | null;
  updatedAt: string;
  completedAt: string | null;
  steps: MentorProjectStepDetail[];
}

const normalizeStepCode = (stepCode: string) => stepCode.toLowerCase();

export const mapMentorProjectDetailResponse = (
  response: MentorProjectDetailApiResponse,
): MentorProjectDetailResponse => ({
  projectId: response.projectId,
  studentId: response.studentId,
  studentNickname: response.studentNickname,
  title: response.title,
  roadmapType: response.roadmapType,
  status: response.projectStatus,
  desiredOutcome: response.desiredOutcome,
  keyFocus: response.keyFocus,
  requiredElements: response.requiredElements,
  reviewStatus: response.reviewStatus,
  reviewedAt: response.reviewedAt,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
  completedAt: response.completedAt,
  steps: response.steps.map((step) => ({
    stepId: step.stepId,
    stepCode: normalizeStepCode(step.stepCode),
    stepName: step.stepName,
    stepOrder: step.stepOrder,
    status: step.status,
    completedAt: step.completedAt,
    prompt: step.prompt
      ? {
          ...step.prompt,
          finalPrompt:
            step.prompt.editedPrompt ?? step.prompt.providedPromptSnapshot,
          addedCount: step.prompt.addedCount ?? 0,
          removedCount: step.prompt.removedCount ?? 0,
        }
      : null,
    result: step.result
      ? {
          contentMarkdown: step.result.contentMarkdown ?? "",
        }
      : null,
    selfCheck: step.selfCheck,
  })),
});
