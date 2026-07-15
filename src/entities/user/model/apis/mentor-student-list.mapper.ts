export type MentorStudentReviewStatus =
  | "REVIEWING"
  | "REVIEWED"
  | "NOT_APPLICABLE";

type MentorStudentReviewStatusApiResponse = Exclude<
  MentorStudentReviewStatus,
  "NOT_APPLICABLE"
>;

export type MentorStudentListApiResponse = {
  summary: {
    totalStudentCount: number;
    reviewingCount: number;
    reviewedCount: number;
  };
  students: {
    studentId: string;
    nickname: string;
    email: string;
    profileUrl: string | null;
    totalProjectCount: number;
    inProgressProjectCount: number;
    completedProjectCount: number;
    reviewStatus: MentorStudentReviewStatusApiResponse | null;
    lastProjectUpdatedAt: string | null;
  }[];
};

export type MentorDashboardSummary = {
  studentCount: number;
  reviewingCount: number;
  reviewedCount: number;
};

export type MentorDashboardMentee = {
  menteeId: string;
  name: string;
  projectCount: number;
  latestUpdatedAt: string | null;
  reviewStatus: MentorStudentReviewStatus;
};

export type MentorStudentListResponse = {
  summary: MentorDashboardSummary;
  mentees: MentorDashboardMentee[];
};

export const mapMentorStudentListResponse = (
  response: MentorStudentListApiResponse,
): MentorStudentListResponse => ({
  summary: {
    studentCount: response.summary.totalStudentCount,
    reviewingCount: response.summary.reviewingCount,
    reviewedCount: response.summary.reviewedCount,
  },
  mentees: response.students.map((student) => ({
    menteeId: student.studentId,
    name: student.nickname,
    projectCount: student.totalProjectCount,
    latestUpdatedAt: student.lastProjectUpdatedAt,
    reviewStatus: student.reviewStatus ?? "NOT_APPLICABLE",
  })),
});
