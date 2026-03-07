import { Box, Text, VStack } from "@chakra-ui/react";

export const WhatToDoSection = () => {
  return (
    <Box bg="white" py="44px" w="full">
      <VStack align="center" gap={{ base: 4, lg: "22px" }} px={4} w="full">
        <Text
          color="#0A0A0A"
          fontSize={{ base: "32px", lg: "48px" }}
          fontWeight={700}
          letterSpacing="-0.02em"
          lineHeight="1.4"
          textAlign="center"
        >
          이제 과제는{" "}
          <Box as="span" color="#98C95C">
            어떻게
          </Box>
          가 아니라
          <br />
          <Box as="span" color="#98C95C">
            무엇을
          </Box>
          할지 고민하세요
        </Text>
        <Text
          color="#525252"
          fontSize={{ base: "16px", lg: "20px" }}
          fontWeight={500}
          letterSpacing="-0.02em"
          lineHeight="1.4"
          textAlign="center"
        >
          막막하던 과제의 시작부터 방향과 마무리까지,
          <br />
          SEED가 단계별 로드맵과 프롬프트까지 함께합니다.
        </Text>
      </VStack>
    </Box>
  );
};
