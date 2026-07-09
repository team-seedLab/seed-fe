import { Grid, Text, VStack } from "@chakra-ui/react";

import { MentorMenteeListItem } from "../../components";
import type { MentorDashboardMentee } from "../../types";

type Props = {
  mentees: MentorDashboardMentee[];
};

const HEADER_GRID_TEMPLATE = "80px 112px 72px";

export const MentorMenteeListSection = ({ mentees }: Props) => {
  return (
    <VStack align="stretch" gap={{ base: 4, md: 7 }} w="full">
      <Grid
        alignItems="center"
        gap={6}
        gridTemplateColumns={{ base: "1fr", md: "1fr 344px" }}
        px={{ base: 1, md: 3 }}
      >
        <Text
          color="text"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
        >
          학생 목록
        </Text>

        <Grid
          alignItems="center"
          display={{ base: "none", md: "grid" }}
          gap={10}
          templateColumns={HEADER_GRID_TEMPLATE}
          textAlign="center"
        >
          <Text color="text" fontSize="sm" fontWeight="bold">
            프로젝트 수
          </Text>
          <Text color="text" fontSize="sm" fontWeight="bold">
            최근 제출
          </Text>
          <Text color="text" fontSize="sm" fontWeight="bold">
            검토 상태
          </Text>
        </Grid>
      </Grid>

      <VStack align="stretch" gap={3} w="full">
        {mentees.map((mentee) => {
          return <MentorMenteeListItem key={mentee.menteeId} mentee={mentee} />;
        })}
      </VStack>
    </VStack>
  );
};
