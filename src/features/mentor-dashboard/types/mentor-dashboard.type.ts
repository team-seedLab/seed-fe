export type MenteeReviewStatus = "REVIEWED" | "REVIEW_REQUIRED";

export type MentorDashboardMentee = {
  menteeId: string;
  name: string;
  projectCount: number;
  latestSubmittedAt: string;
  reviewStatus: MenteeReviewStatus;
};
