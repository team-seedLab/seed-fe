import { Flex, Grid, Text, VStack } from "@chakra-ui/react";

import { REVIEW_STATUS_LABEL } from "../constants";
import type { MentorDashboardMentee } from "../types";
import { formatSubmittedDate } from "../utils";

type Props = {
  mentee: MentorDashboardMentee;
  onClick: () => void;
};

const DESKTOP_VALUE_GRID_TEMPLATE = "80px 112px 72px";

export const MentorMenteeListItem = ({ mentee, onClick }: Props) => {
  return (
    <Flex
      as="button"
      align={{ base: "stretch", md: "center" }}
      bg="container.bg"
      border="1px solid"
      borderColor="container.border.card"
      borderRadius="2xl"
      boxShadow="0px 8px 30px 0px rgba(0,0,0,0.04)"
      cursor="pointer"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 6 }}
      justify="space-between"
      p={{ base: 5, md: "25px" }}
      textAlign="left"
      transition="background 0.15s"
      w="full"
      _hover={{ bg: "neutral.50" }}
      onClick={onClick}
    >
      <Flex align="center" gap={{ base: 4, md: 5 }} minW={0}>
        <Flex
          align="center"
          bg="seed"
          borderRadius="full"
          boxSize={{ base: 10, md: 12 }}
          flexShrink={0}
          justify="center"
        />
        <Text
          color="text"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          lineHeight="1.4"
          whiteSpace="nowrap"
        >
          {mentee.name}
        </Text>
      </Flex>

      <Grid
        alignItems="center"
        display={{ base: "none", md: "grid" }}
        gap={10}
        templateColumns={DESKTOP_VALUE_GRID_TEMPLATE}
        textAlign="center"
        w="344px"
      >
        <Text color="text" fontSize="sm" fontWeight="medium">
          {mentee.projectCount}
        </Text>
        <Text color="text" fontSize="sm" fontWeight="medium">
          {formatSubmittedDate(mentee.latestSubmittedAt)}
        </Text>
        <Text color="text" fontSize="sm" fontWeight="medium">
          {REVIEW_STATUS_LABEL[mentee.reviewStatus]}
        </Text>
      </Grid>

      <Grid
        display={{ base: "grid", md: "none" }}
        gap={3}
        templateColumns="repeat(3, minmax(0, 1fr))"
      >
        <VStack
          align="flex-start"
          bg="neutral.50"
          borderRadius="xl"
          gap={1}
          px={3}
          py={2.5}
        >
          <Text color="text.secondary" fontSize="2xs" fontWeight="medium">
            프로젝트 수
          </Text>
          <Text color="text" fontSize="sm" fontWeight="semibold">
            {mentee.projectCount}
          </Text>
        </VStack>

        <VStack
          align="flex-start"
          bg="neutral.50"
          borderRadius="xl"
          gap={1}
          px={3}
          py={2.5}
        >
          <Text color="text.secondary" fontSize="2xs" fontWeight="medium">
            최근 제출
          </Text>
          <Text color="text" fontSize="sm" fontWeight="semibold">
            {formatSubmittedDate(mentee.latestSubmittedAt)}
          </Text>
        </VStack>

        <VStack
          align="flex-start"
          bg="neutral.50"
          borderRadius="xl"
          gap={1}
          px={3}
          py={2.5}
        >
          <Text color="text.secondary" fontSize="2xs" fontWeight="medium">
            검토 상태
          </Text>
          <Text color="text" fontSize="sm" fontWeight="semibold">
            {REVIEW_STATUS_LABEL[mentee.reviewStatus]}
          </Text>
        </VStack>
      </Grid>
    </Flex>
  );
};
