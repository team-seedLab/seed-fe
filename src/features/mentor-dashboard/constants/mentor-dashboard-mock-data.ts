import type { MentorDashboardMentee } from "../types";

export const MENTOR_DASHBOARD_MENTEES: MentorDashboardMentee[] = [
  {
    menteeId: "mentee-1",
    name: "김서연",
    projectCount: 5,
    latestSubmittedAt: "2026-07-08",
    reviewStatus: "REVIEW_REQUIRED",
  },
  {
    menteeId: "mentee-2",
    name: "최연준",
    projectCount: 3,
    latestSubmittedAt: "2026-07-07",
    reviewStatus: "REVIEWED",
  },
  {
    menteeId: "mentee-3",
    name: "박민지",
    projectCount: 4,
    latestSubmittedAt: "2026-07-05",
    reviewStatus: "REVIEW_REQUIRED",
  },
  {
    menteeId: "mentee-4",
    name: "이도현",
    projectCount: 2,
    latestSubmittedAt: "2026-07-02",
    reviewStatus: "REVIEWED",
  },
];
