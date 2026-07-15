import type {
  MentorDashboardMentee as MentorDashboardMenteeModel,
  MentorDashboardSummary as MentorDashboardSummaryModel,
  MentorStudentReviewStatus,
  ProjectStatus,
} from "@/entities";

export type MenteeReviewStatus = MentorStudentReviewStatus;
export type MentorDashboardMentee = MentorDashboardMenteeModel;
export type MentorDashboardSummary = MentorDashboardSummaryModel;

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
