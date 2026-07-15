import { Flex, Spinner, Text } from "@chakra-ui/react";

import { useGetMentorStudentList, useUserInfoStore } from "@/entities";
import {
  MentorDashboardSummarySection,
  MentorMenteeListSection,
} from "@/features";

export default function MentorDashboardPage() {
  const nickname = useUserInfoStore((state) => {
    return state.userInfo?.nickname ?? state.persistedProfile?.nickname;
  });
  const { data, isError, isLoading } = useGetMentorStudentList();

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
              aria-label="멘티 목록 불러오는 중"
              color="seed"
              size="lg"
            />
          </Flex>
        ) : isError ? (
          <Flex align="center" justify="center" minH="360px">
            <Text color="text.secondary">멘티 목록을 불러오지 못했습니다.</Text>
          </Flex>
        ) : data ? (
          <>
            <MentorDashboardSummarySection
              nickname={nickname}
              summary={data.summary}
            />
            <MentorMenteeListSection mentees={data.mentees} />
          </>
        ) : null}
      </Flex>
    </Flex>
  );
}
