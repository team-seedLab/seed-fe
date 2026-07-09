import type { ProjectStatus } from "@/entities";

export type MenteeReviewStatus = "REVIEWED" | "REVIEW_REQUIRED";

export type MentorDashboardMentee = {
  menteeId: string;
  name: string;
  projectCount: number;
  latestSubmittedAt: string;
  reviewStatus: MenteeReviewStatus;
};

export type MentorMenteeProject = {
  projectId: string;
  title: string;
  status: ProjectStatus;
  startedAt: string;
  submittedAt: string;
  currentStep: number;
  totalSteps: number;
  completionRate: number;
};

export type MentorMenteeProjectGroup = {
  menteeId: string;
  menteeName: string;
  reviewStatus: MenteeReviewStatus;
  projects: MentorMenteeProject[];
};
