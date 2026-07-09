import { Heading, Text, VStack } from "@chakra-ui/react";

export const MentorLoginTitleText = () => {
  return (
    <VStack gap={2.5} textAlign="center" w="full">
      <Heading
        as="h1"
        color="neutral.900"
        fontSize={{ base: "2xl", lg: "3xl" }}
        fontWeight="bold"
      >
        반가워요, 멘토님
      </Heading>
      <Text
        color="neutral.600"
        fontSize={{ base: "sm", lg: "md" }}
        fontWeight="normal"
        whiteSpace={{ base: "normal", md: "nowrap" }}
        wordBreak="keep-all"
      >
        학습의 과정을 자산으로 만드는 여정을 시작하세요.
      </Text>
    </VStack>
  );
};
