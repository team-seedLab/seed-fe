import { useParams } from "react-router";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import { useGetMentorStudentProjectList } from "@/entities";
import {
  MentorMenteeProjectListSection,
  MentorMenteeProjectsSummarySection,
} from "@/features";

export default function MentorMenteeProjectsPage() {
  const { menteeId } = useParams<{ menteeId: string }>();
  const normalizedMenteeId = menteeId ?? "";
  const { data, isError, isLoading } =
    useGetMentorStudentProjectList(normalizedMenteeId);
  const projects = data?.projects ?? [];
  const completedProjectCount = projects.filter((project) => {
    return project.status === "COMPLETED";
  }).length;
  const hasValidMenteeId = Boolean(normalizedMenteeId);

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
        {isLoading ? (
          <Flex align="center" justify="center" minH="360px">
            <Spinner
              aria-label="멘티 프로젝트 목록 불러오는 중"
              color="seed"
              size="lg"
            />
          </Flex>
        ) : isError || !hasValidMenteeId || !data ? (
          <Flex align="center" justify="center" minH="360px">
            <Text color="text.secondary">
              멘티 프로젝트 목록을 불러오지 못했습니다.
            </Text>
          </Flex>
        ) : (
          <>
            <MentorMenteeProjectsSummarySection
              completedProjectCount={completedProjectCount}
              menteeName={data.menteeName}
              totalProjectCount={projects.length}
            />
            <MentorMenteeProjectListSection
              menteeId={normalizedMenteeId}
              projects={projects}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
}
