import { useParams } from "react-router";

import { Flex } from "@chakra-ui/react";

import {
  type MentorMenteeProject,
  MentorMenteeProjectListSection,
  MentorMenteeProjectsSummarySection,
} from "@/features";

const MENTOR_MENTEE_PROJECTS: MentorMenteeProject[] = [];

export default function MentorMenteeProjectsPage() {
  const { menteeId } = useParams<{ menteeId: string }>();
  const completedProjectCount = MENTOR_MENTEE_PROJECTS.filter((project) => {
    return project.status === "COMPLETED";
  }).length;

  return (
    <Flex align="center" bg="container.bg" direction="column" minH="100vh">
      <Flex
        direction="column"
        gap={{ base: 10, md: 12 }}
        maxW="1024px"
        px={{ base: 4, md: 6 }}
        py={{ base: 10, md: 16 }}
        w="full"
      >
        <MentorMenteeProjectsSummarySection
          completedProjectCount={completedProjectCount}
          menteeName={null}
          totalProjectCount={MENTOR_MENTEE_PROJECTS.length}
        />
        <MentorMenteeProjectListSection
          menteeId={menteeId ?? ""}
          projects={MENTOR_MENTEE_PROJECTS}
        />
      </Flex>
    </Flex>
  );
}
