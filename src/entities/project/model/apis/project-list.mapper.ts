import type { ProjectListProject, ProjectStatus, RoadmapType } from "../types";

export interface ProjectListItemApiResponse {
  projectId: string;
  title: string;
  roadmapType: RoadmapType;
  projectStatus: ProjectStatus;
  currentRoadmapStep: string | null;
  currentStepOrder: number | null;
  totalStepCount: number;
  completedStepCount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface ProjectListApiResponse {
  content: ProjectListItemApiResponse[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ProjectListResponse extends Omit<
  ProjectListApiResponse,
  "content"
> {
  content: ProjectListProject[];
}

export const mapProjectListResponse = (
  response: ProjectListApiResponse,
): ProjectListResponse => ({
  ...response,
  content: response.content.map((project) => ({
    projectId: project.projectId,
    title: project.title,
    roadmapType: project.roadmapType,
    status: project.projectStatus,
    currentStepOrder: project.currentStepOrder,
    totalStepCount: project.totalStepCount,
    completedStepCount: project.completedStepCount,
    progressPercent: project.progressPercent,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    completedAt: project.completedAt,
  })),
});
