import type { MentorDashboardMentee, MentorMenteeProject } from "../types";

export const SAMPLE_MENTEE_ID = "mentee-1";

export const SAMPLE_MENTOR_DASHBOARD_MENTEES: MentorDashboardMentee[] = [
  {
    menteeId: SAMPLE_MENTEE_ID,
    name: "김서연",
    projectCount: 2,
    latestSubmittedAt: "2026-07-08T14:20:00",
    reviewStatus: "REVIEW_REQUIRED",
  },
  {
    menteeId: "mentee-2",
    name: "최연주",
    projectCount: 1,
    latestSubmittedAt: "2026-07-06T09:00:00",
    reviewStatus: "REVIEWED",
  },
];

export const SAMPLE_MENTOR_MENTEE_PROJECTS: MentorMenteeProject[] = [
  {
    projectId: "mentor-project-1",
    title: "심리학 개론 과제",
    status: "IN_PROGRESS",
    startedAt: "2026-07-01T09:00:00",
    submittedAt: "2026-07-08T14:20:00",
    currentStep: 2,
    totalSteps: 4,
    completionRate: 50,
  },
  {
    projectId: "mentor-project-2",
    title: "브랜드 리서치 보고서",
    status: "COMPLETED",
    startedAt: "2026-06-27T09:30:00",
    submittedAt: "2026-07-06T17:10:00",
    currentStep: 4,
    totalSteps: 4,
    completionRate: 100,
  },
];
