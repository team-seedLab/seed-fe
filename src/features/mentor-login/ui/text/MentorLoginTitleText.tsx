import { Heading, Text, VStack } from "@chakra-ui/react";

export const MentorLoginTitleText = () => {
  return (
    <VStack gap={2.5} textAlign="center" w="full">
      <Heading
        as="h1"
        color="neutral.900"
        fontSize={{ base: "3xl", md: "30px" }}
        fontWeight="bold"
        letterSpacing="-0.02em"
        lineHeight="1.4"
      >
        반가워요, 멘토님
      </Heading>
      <Text
        color="#43493A"
        fontSize="md"
        fontWeight="regular"
        letterSpacing="-0.02em"
        lineHeight="1.4"
      >
        학습의 과정을 자산으로 만드는 여정을 시작하세요.
      </Text>
    </VStack>
  );
};
