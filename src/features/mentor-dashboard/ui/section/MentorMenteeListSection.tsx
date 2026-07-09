import { useNavigate } from "react-router";

import { Grid, Text, VStack } from "@chakra-ui/react";

import { DYNAMIC_ROUTE_PATHS } from "@/shared";

import { MentorMenteeListItem } from "../../components";
import {
  MENTOR_MENTEE_LIST_DESKTOP_INSET,
  MENTOR_MENTEE_LIST_DESKTOP_TEMPLATE,
  MENTOR_MENTEE_LIST_VALUE_GRID_TEMPLATE,
} from "../../constants";
import type { MentorDashboardMentee } from "../../types";

type Props = {
  mentees: MentorDashboardMentee[];
};

export const MentorMenteeListSection = ({ mentees }: Props) => {
  const navigate = useNavigate();

  return (
    <VStack align="stretch" gap={{ base: 4, md: 7 }} w="full">
      <Grid
        alignItems="center"
        columnGap={{ base: 0, md: 6 }}
        gridTemplateColumns={{
          base: "1fr",
          md: MENTOR_MENTEE_LIST_DESKTOP_TEMPLATE,
        }}
        px={{ base: 1, md: MENTOR_MENTEE_LIST_DESKTOP_INSET }}
        rowGap={3}
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
          templateColumns={MENTOR_MENTEE_LIST_VALUE_GRID_TEMPLATE}
          textAlign="center"
          w="full"
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
          return (
            <MentorMenteeListItem
              key={mentee.menteeId}
              mentee={mentee}
              onClick={() =>
                navigate(
                  DYNAMIC_ROUTE_PATHS.MENTOR_MENTEE_PROJECTS(mentee.menteeId),
                )
              }
            />
          );
        })}
      </VStack>
    </VStack>
  );
};
