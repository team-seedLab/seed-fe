import type { MentorDashboardMentee } from "../types";

export const SAMPLE_MENTEE_ID = "mentee-1";

export const SAMPLE_MENTOR_DASHBOARD_MENTEES: MentorDashboardMentee[] = [
  {
    menteeId: SAMPLE_MENTEE_ID,
    name: "김서연",
    projectCount: 2,
    latestUpdatedAt: "2026-07-08T14:20:00",
    reviewStatus: "REVIEWING",
  },
  {
    menteeId: "mentee-2",
    name: "최연주",
    projectCount: 1,
    latestUpdatedAt: "2026-07-06T09:00:00",
    reviewStatus: "REVIEWED",
  },
];
