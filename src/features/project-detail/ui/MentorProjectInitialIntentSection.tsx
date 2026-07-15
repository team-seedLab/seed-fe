import { Grid, Text, VStack } from "@chakra-ui/react";

type Props = {
  desiredOutcome: string | null;
  keyFocus: string | null;
  requiredElements: string | null;
};

export const MentorProjectInitialIntentSection = ({
  desiredOutcome,
  keyFocus,
  requiredElements,
}: Props) => {
  const intentItems = [
    { label: "원하는 결과물", value: desiredOutcome },
    { label: "핵심 관점", value: keyFocus },
    { label: "가장 중요한 요소", value: requiredElements },
  ];

  return (
    <VStack align="stretch" gap={{ base: 4, md: 6 }} w="full">
      <Text
        as="h2"
        color="neutral.900"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
      >
        초기 의도
      </Text>

      <Grid
        gap={{ base: 3, md: 4 }}
        templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}
      >
        {intentItems.map((item) => {
          const value = item.value?.trim();

          return (
            <VStack
              align="flex-start"
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.100"
              borderRadius="xl"
              gap={2}
              key={item.label}
              minH={{ base: 28, md: 32 }}
              p={{ base: 4, md: 5 }}
            >
              <Text color="neutral.600" fontSize="xs" fontWeight="bold">
                {item.label}
              </Text>
              <Text
                color={value ? "neutral.900" : "neutral.600"}
                fontSize={{ base: "sm", md: "md" }}
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                {value || "입력된 내용이 없습니다."}
              </Text>
            </VStack>
          );
        })}
      </Grid>
    </VStack>
  );
};
