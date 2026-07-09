import { Box, Flex, Grid, Skeleton, Text, VStack } from "@chakra-ui/react";

type Props = {
  menteeName?: string | null;
  totalProjectCount: number;
  completedProjectCount: number;
};

export const MentorMenteeProjectsSummarySection = ({
  menteeName,
  totalProjectCount,
  completedProjectCount,
}: Props) => {
  const summaryItems = [
    {
      label: "전체",
      value: totalProjectCount,
    },
    {
      label: "완료",
      value: completedProjectCount,
    },
  ];

  return (
    <Flex
      align={{ base: "flex-start", lg: "center" }}
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 6, lg: 8 }}
      justify="space-between"
      w="full"
    >
      <Flex align="center" gap={{ base: 4, md: 8 }} minW={0}>
        <Flex
          align="center"
          bg="seed"
          borderRadius="full"
          boxSize={{ base: 16, md: 20 }}
          flexShrink={0}
          justify="center"
        />
        {menteeName ? (
          <Text
            color="text"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            lineHeight="1.4"
            wordBreak="keep-all"
          >
            {menteeName}
          </Text>
        ) : (
          <Skeleton
            h={{ base: 9, md: 11 }}
            maxW="240px"
            w={{ base: "140px", md: "180px" }}
          />
        )}
      </Flex>

      <Grid
        display={{ base: "grid", lg: "none" }}
        gap={3}
        templateColumns="repeat(2, minmax(0, 1fr))"
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
              <VStack align="flex-start" gap={0.5} minW="92px" px={6} py={3}>
                <Text color="text.secondary" fontSize="xs" fontWeight="regular">
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
