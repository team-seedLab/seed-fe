import type {
  MentorDashboardMentee as MentorDashboardMenteeModel,
  MentorDashboardSummary as MentorDashboardSummaryModel,
  MentorStudentProjectListProject,
  MentorStudentReviewStatus,
} from "@/entities";

export type MenteeReviewStatus = MentorStudentReviewStatus;
export type MentorDashboardMentee = MentorDashboardMenteeModel;
export type MentorDashboardSummary = MentorDashboardSummaryModel;

export type MentorMenteeProject = MentorStudentProjectListProject;

export type MentorMenteeProjectGroup = {
  menteeId: string;
  menteeName: string;
  reviewStatus: MenteeReviewStatus;
  projects: MentorMenteeProject[];
};
