import { useNavigate, useParams } from "react-router";

import { Button, Flex, Text, VStack } from "@chakra-ui/react";

import {
  MentorMenteeProjectListSection,
  MentorMenteeProjectsSummarySection,
  getMentorMenteeProjectGroup,
} from "@/features";
import { ROUTE_PATHS } from "@/shared";

export default function MentorMenteeProjectsPage() {
  const navigate = useNavigate();
  const { menteeId } = useParams<{ menteeId: string }>();
  const menteeProjectGroup = getMentorMenteeProjectGroup(menteeId ?? "");

  if (!menteeProjectGroup) {
    return (
      <Flex
        align="center"
        bg="container.bg"
        direction="column"
        justify="center"
        minH="100vh"
        px={4}
      >
        <VStack gap={4}>
          <Text
            color="text"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
          >
            멘티 정보를 찾을 수 없습니다.
          </Text>
          <Button onClick={() => navigate(ROUTE_PATHS.MENTOR_DASHBOARD)}>
            대시보드로 이동
          </Button>
        </VStack>
      </Flex>
    );
  }

  const completedProjectCount = menteeProjectGroup.projects.filter(
    (project) => {
      return project.status === "COMPLETED";
    },
  ).length;

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
          menteeName={menteeProjectGroup.menteeName}
          totalProjectCount={menteeProjectGroup.projects.length}
        />
        <MentorMenteeProjectListSection
          menteeId={menteeProjectGroup.menteeId}
          projects={menteeProjectGroup.projects}
        />
      </Flex>
    </Flex>
  );
}
