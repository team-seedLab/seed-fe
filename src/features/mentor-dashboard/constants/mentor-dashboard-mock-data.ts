import type {
  MentorDashboardMentee,
  MentorMenteeProject,
  MentorMenteeProjectGroup,
} from "../types";

const getLatestSubmittedAt = (projects: MentorMenteeProject[]) => {
  return projects.reduce((latest, project) => {
    return latest > project.submittedAt ? latest : project.submittedAt;
  }, projects[0]?.submittedAt ?? "");
};

export const MENTOR_MENTEE_PROJECT_GROUPS: MentorMenteeProjectGroup[] = [
  {
    menteeId: "mentee-1",
    menteeName: "김서연",
    reviewStatus: "REVIEW_REQUIRED",
    projects: [
      {
        projectId: "mentor-project-1",
        title: "환경학 개론 과제",
        status: "IN_PROGRESS",
        startedAt: "2026-07-01T09:00:00",
        submittedAt: "2026-07-08T14:20:00",
        currentStep: 2,
        totalSteps: 4,
        completionRate: 50,
      },
      {
        projectId: "mentor-project-2",
        title: "UI 디자인 시스템 구축",
        status: "IN_PROGRESS",
        startedAt: "2026-06-30T10:00:00",
        submittedAt: "2026-07-08T11:00:00",
        currentStep: 2,
        totalSteps: 4,
        completionRate: 50,
      },
      {
        projectId: "mentor-project-3",
        title: "2024 마케팅 기획안",
        status: "COMPLETED",
        startedAt: "2026-06-28T13:00:00",
        submittedAt: "2026-07-07T18:30:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-4",
        title: "브랜드 리서치 리포트",
        status: "COMPLETED",
        startedAt: "2026-06-27T09:30:00",
        submittedAt: "2026-07-06T17:10:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-5",
        title: "서비스 기획 초안 작성",
        status: "IN_PROGRESS",
        startedAt: "2026-06-26T08:00:00",
        submittedAt: "2026-07-05T15:40:00",
        currentStep: 3,
        totalSteps: 4,
        completionRate: 75,
      },
    ],
  },
  {
    menteeId: "mentee-2",
    menteeName: "최연준",
    reviewStatus: "REVIEWED",
    projects: [
      {
        projectId: "mentor-project-6",
        title: "심리학 개론 보고서",
        status: "COMPLETED",
        startedAt: "2026-06-25T10:00:00",
        submittedAt: "2026-07-07T10:00:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-7",
        title: "AI 활용 사례 조사",
        status: "COMPLETED",
        startedAt: "2026-06-24T10:00:00",
        submittedAt: "2026-07-06T16:00:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-8",
        title: "디자인 씽킹 워크시트",
        status: "IN_PROGRESS",
        startedAt: "2026-06-23T10:00:00",
        submittedAt: "2026-07-05T09:30:00",
        currentStep: 1,
        totalSteps: 4,
        completionRate: 25,
      },
    ],
  },
  {
    menteeId: "mentee-3",
    menteeName: "박민지",
    reviewStatus: "REVIEW_REQUIRED",
    projects: [
      {
        projectId: "mentor-project-9",
        title: "데이터 분석 발표 자료",
        status: "IN_PROGRESS",
        startedAt: "2026-06-22T09:00:00",
        submittedAt: "2026-07-05T13:20:00",
        currentStep: 2,
        totalSteps: 4,
        completionRate: 50,
      },
      {
        projectId: "mentor-project-10",
        title: "교육학 세미나 정리",
        status: "COMPLETED",
        startedAt: "2026-06-21T09:00:00",
        submittedAt: "2026-07-04T18:00:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-11",
        title: "소비자 행동 분석",
        status: "IN_PROGRESS",
        startedAt: "2026-06-20T09:00:00",
        submittedAt: "2026-07-03T20:15:00",
        currentStep: 3,
        totalSteps: 4,
        completionRate: 75,
      },
      {
        projectId: "mentor-project-12",
        title: "인터뷰 질문지 설계",
        status: "COMPLETED",
        startedAt: "2026-06-19T09:00:00",
        submittedAt: "2026-07-02T11:10:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
    ],
  },
  {
    menteeId: "mentee-4",
    menteeName: "이도윤",
    reviewStatus: "REVIEWED",
    projects: [
      {
        projectId: "mentor-project-13",
        title: "브랜드 메시지 전략",
        status: "COMPLETED",
        startedAt: "2026-06-18T09:00:00",
        submittedAt: "2026-07-02T15:00:00",
        currentStep: 4,
        totalSteps: 4,
        completionRate: 100,
      },
      {
        projectId: "mentor-project-14",
        title: "사용자 인터뷰 분석",
        status: "IN_PROGRESS",
        startedAt: "2026-06-17T09:00:00",
        submittedAt: "2026-07-01T12:30:00",
        currentStep: 2,
        totalSteps: 4,
        completionRate: 50,
      },
    ],
  },
];

export const MENTOR_DASHBOARD_MENTEES: MentorDashboardMentee[] =
  MENTOR_MENTEE_PROJECT_GROUPS.map((menteeGroup) => {
    return {
      menteeId: menteeGroup.menteeId,
      name: menteeGroup.menteeName,
      projectCount: menteeGroup.projects.length,
      latestSubmittedAt: getLatestSubmittedAt(menteeGroup.projects),
      reviewStatus: menteeGroup.reviewStatus,
    };
  });

export const getMentorMenteeProjectGroup = (menteeId: string) => {
  return MENTOR_MENTEE_PROJECT_GROUPS.find((menteeGroup) => {
    return menteeGroup.menteeId === menteeId;
  });
};
