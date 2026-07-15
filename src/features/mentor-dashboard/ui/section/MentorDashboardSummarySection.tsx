import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";

import type { MentorDashboardSummary } from "../../types";

type Props = {
  nickname?: string | null;
  summary: MentorDashboardSummary;
};

const createSummaryItems = (summary: MentorDashboardSummary) => {
  return [
    {
      label: "학생 수",
      value: summary.studentCount,
    },
    {
      label: "검토중",
      value: summary.reviewingCount,
    },
    {
      label: "검토 완료",
      value: summary.reviewedCount,
    },
  ];
};

export const MentorDashboardSummarySection = ({ nickname, summary }: Props) => {
  const summaryItems = createSummaryItems(summary);

  return (
    <Flex
      align={{ base: "flex-start", lg: "center" }}
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 6, lg: 8 }}
      justify="space-between"
      w="full"
    >
      <VStack align="flex-start" gap={{ base: 2, md: 3 }}>
        {nickname ? (
          <Text
            color="text"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            wordBreak="keep-all"
          >
            반가워요, {nickname}님
          </Text>
        ) : (
          <Skeleton
            h={{ base: 10, md: 12 }}
            w={{ base: "180px", md: "240px" }}
          />
        )}

        <Text
          color="text.secondary"
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="medium"
          wordBreak="keep-all"
        >
          편리하게 학생들을 관리하세요!
        </Text>
      </VStack>

      <Grid
        display={{ base: "grid", lg: "none" }}
        gap={3}
        templateColumns="repeat(3, minmax(0, 1fr))"
        w="full"
      >
        {summaryItems.map((item) => {
          return (
            <VStack align="flex-start" gap={1} key={item.label}>
              <Text color="text.secondary" fontSize="xs" fontWeight="medium">
                {item.label}
              </Text>
              <Text color="text" fontSize="2xl" fontWeight="semibold">
                {item.value}
              </Text>
            </VStack>
          );
        })}
      </Grid>

      <Flex align="stretch" display={{ base: "none", lg: "flex" }} gap={0}>
        {summaryItems.map((item, index) => {
          const isLast = index === summaryItems.length - 1;

          return (
            <Flex key={item.label}>
              <VStack align="flex-start" gap={0.5} minW="104px" px={6} py={3}>
                <Text color="text.secondary" fontSize="xs" fontWeight="medium">
                  {item.label}
                </Text>
                <Text color="text" fontSize="3xl" fontWeight="semibold">
                  {item.value}
                </Text>
              </VStack>
              {!isLast && (
                <Box
                  alignSelf="stretch"
                  bg="neutral.200"
                  flexShrink={0}
                  w="1px"
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
