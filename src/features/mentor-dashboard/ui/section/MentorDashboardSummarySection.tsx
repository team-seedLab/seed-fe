import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";

import type { MentorDashboardMentee } from "../../types";

type Props = {
  mentees: MentorDashboardMentee[];
  nickname?: string | null;
};

const createSummaryItems = (mentees: MentorDashboardMentee[]) => {
  const reviewRequiredCount = mentees.filter((mentee) => {
    return mentee.reviewStatus === "REVIEW_REQUIRED";
  }).length;

  return [
    {
      label: "학생 수",
      value: mentees.length,
    },
    {
      label: "검토중",
      value: reviewRequiredCount,
    },
    {
      label: "검토 완료",
      value: mentees.length - reviewRequiredCount,
    },
  ];
};

export const MentorDashboardSummarySection = ({ mentees, nickname }: Props) => {
  const summaryItems = createSummaryItems(mentees);

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
            lineHeight="1.4"
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
          lineHeight="1.4"
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
            <VStack
              align="flex-start"
              bg="container.bg"
              border="1px solid"
              borderColor="container.border.card"
              borderRadius="2xl"
              gap={1}
              key={item.label}
              px={4}
              py={3.5}
            >
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
                <Text
                  color="text.secondary"
                  fontSize="xs"
                  fontWeight="medium"
                  lineHeight="1.4"
                >
                  {item.label}
                </Text>
                <Text
                  color="text"
                  fontSize="3xl"
                  fontWeight="semibold"
                  lineHeight="1.4"
                >
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
