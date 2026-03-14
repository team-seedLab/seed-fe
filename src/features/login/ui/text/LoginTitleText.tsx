import { Heading, Text, VStack } from "@chakra-ui/react";

export const LoginTitleText = () => {
  return (
    <VStack gap={3} mb={{ base: 8, md: 10 }} textAlign="center" w="full">
      <Heading
        as="h1"
        fontSize={{ base: "2xl", lg: "3xl" }}
        fontWeight={700}
        lineHeight="1.2"
        color="neutral.900"
        whiteSpace="pre-wrap"
      >
        SEED와 함께{"\n"}과제를 압축해 보세요
      </Heading>
      <Text
        fontSize={{ base: "sm", lg: "md" }}
        fontWeight={500}
        color="neutral.600"
        whiteSpace="pre-wrap"
      >
        소셜 계정으로 빠르게 서비스를 시작할 수 있습니다.
      </Text>
    </VStack>
  );
};
