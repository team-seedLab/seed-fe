import { Flex } from "@chakra-ui/react";

import { useUserInfoStore } from "@/entities";
import {
  type MentorDashboardMentee,
  MentorDashboardSummarySection,
  MentorMenteeListSection,
} from "@/features";

const MENTOR_DASHBOARD_MENTEES: MentorDashboardMentee[] = [];

export default function MentorDashboardPage() {
  const nickname = useUserInfoStore((state) => {
    return state.userInfo?.nickname ?? state.persistedProfile?.nickname;
  });

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
        <MentorDashboardSummarySection
          mentees={MENTOR_DASHBOARD_MENTEES}
          nickname={nickname}
        />
        <MentorMenteeListSection mentees={MENTOR_DASHBOARD_MENTEES} />
      </Flex>
    </Flex>
  );
}
