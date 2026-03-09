import { Box, Text, VStack } from "@chakra-ui/react";

export const WhatToDoSection = () => {
  return (
    <Box
      alignItems="center"
      as="section"
      bg="white"
      display="flex"
      h="100vh"
      justifyContent="center"
      py={11}
      w="full"
    >
      <VStack align="center" gap={{ base: 4, lg: 5 }} px={4} w="full">
        <Text
          color="text"
          fontSize={{ base: "32px", lg: "48px" }}
          fontWeight="bold"
          letterSpacing="-0.02em"
          lineHeight="1.4"
          textAlign="center"
        >
          이제 과제는{" "}
          <Box as="span" color="seed">
            어떻게
          </Box>
          가 아니라
          <br />
          <Box as="span" color="seed">
            무엇을
          </Box>
          할지만 고민하세요.
        </Text>
        <Text
          color="text.secondary"
          fontSize={{ base: "lg", lg: "xl" }}
          fontWeight="medium"
          letterSpacing="-0.02em"
          lineHeight="1.4"
          textAlign="center"
        >
          막막하던 과제의 시작부터 배경과 마무리까지,
          <br />
          SEED가 설계한 로드맵과 프롬프트가 함께 합니다.
        </Text>
      </VStack>
    </Box>
  );
};
