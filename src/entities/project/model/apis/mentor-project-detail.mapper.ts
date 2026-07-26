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

type MentorProjectDependencyAnalysisApiResponse = {
  dependencyAnalysisId: string;
  initiativeScore: number;
  userEditRatio: number;
  aiDependencyRatio: number;
  createdAt: string;
  updatedAt: string;
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
  dependencyAnalysis: MentorProjectDependencyAnalysisApiResponse | null;
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

export type MentorProjectDependencyAnalysis = {
  dependencyAnalysisId: string;
  initiativeScore: number;
  userEditRatio: number;
  aiDependencyRatio: number;
  createdAt: string;
  updatedAt: string;
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
  dependencyAnalysis: MentorProjectDependencyAnalysis | null;
}

const normalizeStepCode = (stepCode: string) => stepCode.toLowerCase();

const mapDependencyAnalysis = (
  analysis: MentorProjectDependencyAnalysisApiResponse | null,
): MentorProjectDependencyAnalysis | null => {
  if (!analysis) {
    return null;
  }

  return {
    dependencyAnalysisId: analysis.dependencyAnalysisId,
    initiativeScore: analysis.initiativeScore,
    userEditRatio: analysis.userEditRatio,
    aiDependencyRatio: analysis.aiDependencyRatio,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
  };
};

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
  dependencyAnalysis: mapDependencyAnalysis(response.dependencyAnalysis),
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
