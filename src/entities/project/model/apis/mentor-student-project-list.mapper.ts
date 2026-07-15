import type {
  MentorProjectReviewStatus,
  ProjectStatus,
  RoadmapType,
} from "../types";

type MentorStudentProjectApiResponse = {
  projectId: string;
  title: string;
  roadmapType: RoadmapType;
  projectStatus: ProjectStatus;
  currentRoadmapStep: string | null;
  currentStepOrder: number | null;
  totalStepCount: number;
  completedStepCount: number;
  progressPercent: number;
  reviewStatus: MentorProjectReviewStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type MentorStudentProjectListApiResponse = {
  studentId: string;
  nickname: string;
  email: string;
  profileUrl: string | null;
  projects: MentorStudentProjectApiResponse[];
};

export type MentorStudentProjectListProject = {
  projectId: string;
  title: string;
  status: ProjectStatus;
  currentStepOrder: number | null;
  totalStepCount: number;
  progressPercent: number;
  updatedAt: string;
};

export type MentorStudentProjectListResponse = {
  menteeId: string;
  menteeName: string;
  projects: MentorStudentProjectListProject[];
};

export const mapMentorStudentProjectListResponse = (
  response: MentorStudentProjectListApiResponse,
): MentorStudentProjectListResponse => ({
  menteeId: response.studentId,
  menteeName: response.nickname,
  projects: response.projects.map((project) => ({
    projectId: project.projectId,
    title: project.title,
    status: project.projectStatus,
    currentStepOrder: project.currentStepOrder,
    totalStepCount: project.totalStepCount,
    progressPercent: project.progressPercent,
    updatedAt: project.updatedAt,
  })),
});
