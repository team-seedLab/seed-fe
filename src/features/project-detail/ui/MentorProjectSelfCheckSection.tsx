import { Flex, Text, VStack } from "@chakra-ui/react";

import type { MentorProjectStepDetail } from "@/entities";

type Props = {
  selfCheck: MentorProjectStepDetail["selfCheck"];
};

export const MentorProjectSelfCheckSection = ({ selfCheck }: Props) => {
  const checkItems = selfCheck?.checkItems ?? [];

  return (
    <VStack align="stretch" gap={{ base: 4, md: 6 }} w="full">
      <Text
        as="h2"
        color="neutral.900"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
        lineHeight="1.4"
      >
        이해 확인 및 검증
      </Text>

      {checkItems.length > 0 ? (
        <VStack align="stretch" as="dl" gap={3} m={0}>
          {checkItems.map(({ key, question, answer }) => {
            const normalizedAnswer = answer?.trim();

            return (
              <VStack
                align="stretch"
                as="div"
                bg="neutral.50"
                borderRadius="xl"
                gap={3}
                key={key}
                p={{ base: 4, md: 6 }}
              >
                <Text
                  as="dt"
                  color="neutral.900"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {question}
                </Text>
                <Text
                  as="dd"
                  color={normalizedAnswer ? "neutral.900" : "neutral.700"}
                  fontSize="sm"
                  m={0}
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {normalizedAnswer || "작성된 답변이 없습니다."}
                </Text>
              </VStack>
            );
          })}
        </VStack>
      ) : (
        <Flex
          align="center"
          bg="neutral.50"
          borderRadius="xl"
          color="neutral.700"
          minH={32}
          p={{ base: 4, md: 6 }}
        >
          제출된 Self-Check가 없습니다.
        </Flex>
      )}
    </VStack>
  );
};
