import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

const checkIconUrl =
  "https://www.figma.com/api/mcp/asset/d2b857e3-9b04-44c6-96cc-3305ab940f41";

// Benefit panel used only inside the prompt assembly section.
// prompt assembly 섹션 내부에서만 쓰는 결과 활용 설명 패널
export const ActionableOutputPanel = () => {
  return (
    <VStack
      align="start"
      flex="1 1 0"
      gap={4}
      maxW={{ base: "full", xl: "480px" }}
      minW={0}
      pt={{ base: 2, xl: 0 }}
      w="full"
    >
      <Box bg="#FAFAFA" borderRadius="8px" color="#98C95C" px={3} py={1}>
        <Text
          fontSize="14px"
          fontWeight={700}
          letterSpacing="-0.02em"
          lineHeight="20px"
        >
          Actionable Output
        </Text>
      </Box>

      <Text
        color="#191F28"
        fontSize={{ base: "30px", lg: "36px" }}
        fontWeight={700}
        letterSpacing="-0.02em"
        lineHeight="1.25"
      >
        바로 복사해서
        <br />
        결과를 만들어보세요.
      </Text>

      <Text
        color="#A1A1A1"
        fontSize={{ base: "16px", lg: "18px" }}
        fontWeight={400}
        letterSpacing="-0.02em"
        lineHeight="1.625"
        maxW="420px"
      >
        로드맵 각 단계에 꼭 맞는 최적의 프롬프트가 생성됩니다.
        <br />
        고민 없이 '복사' 버튼 하나면
        <br />
        전문적인 결과물로 이어질 수 있습니다.
      </Text>

      <VStack align="start" gap={4} pt={4} w="full">
        {[
          "단계별 맞춤형 프롬프트 제공",
          "원클릭 복사 및 재생성",
          "검증된 학술적 구조 적용",
        ].map((feature) => {
          return (
            <HStack align="center" gap={3} key={feature} w="full">
              <Flex
                align="center"
                bg="#E7F3D4"
                borderRadius="full"
                h="24px"
                justify="center"
                w="24px"
              >
                <Image alt="" h="7.96px" src={checkIconUrl} w="10.44px" />
              </Flex>
              <Text
                color="#191F28"
                fontSize="16px"
                fontWeight={500}
                letterSpacing="-0.02em"
                lineHeight="24px"
              >
                {feature}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
};
