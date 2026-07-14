import type {
  Project,
  ProjectStatus,
  ProjectStepResponse,
  ProjectStepStatus,
  ProjectStepSummary,
  RoadmapType,
} from "../types";

interface ProjectStepSummaryApiResponse {
  stepId: string;
  roadmapStep: string;
  stepOrder: number;
  status: ProjectStepStatus;
  completedAt: string | null;
}

export interface ProjectDetailApiResponse {
  projectId: string;
  title: string;
  roadmapType: RoadmapType;
  projectStatus: ProjectStatus;
  desiredOutcome: string | null;
  keyFocus: string | null;
  requiredElements: string | null;
  currentRoadmapStep: string | null;
  currentStepOrder: number | null;
  totalStepCount: number;
  completedStepCount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  steps: ProjectStepSummaryApiResponse[];
}

export interface ProjectDetailResponse extends Project {
  desiredOutcome: string | null;
  keyFocus: string | null;
  requiredElements: string | null;
  currentStepCode: string | null;
  currentStepOrder: number | null;
  totalStepCount: number;
  completedStepCount: number;
  progressPercent: number;
  updatedAt: string;
  completedAt: string | null;
  steps: ProjectStepSummary[];
  stepResponses?: ProjectStepResponse[];
}

const normalizeStepCode = (roadmapStep: string) => roadmapStep.toLowerCase();

export const mapProjectDetailResponse = (
  response: ProjectDetailApiResponse,
): ProjectDetailResponse => ({
  projectId: response.projectId,
  title: response.title,
  roadmapType: response.roadmapType,
  status: response.projectStatus,
  desiredOutcome: response.desiredOutcome,
  keyFocus: response.keyFocus,
  requiredElements: response.requiredElements,
  currentStepCode: response.currentRoadmapStep
    ? normalizeStepCode(response.currentRoadmapStep)
    : null,
  currentStepOrder: response.currentStepOrder,
  totalStepCount: response.totalStepCount,
  completedStepCount: response.completedStepCount,
  progressPercent: response.progressPercent,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
  completedAt: response.completedAt,
  steps: response.steps.map((step) => ({
    stepId: step.stepId,
    stepCode: normalizeStepCode(step.roadmapStep),
    stepOrder: step.stepOrder,
    status: step.status,
    completedAt: step.completedAt,
  })),
});
