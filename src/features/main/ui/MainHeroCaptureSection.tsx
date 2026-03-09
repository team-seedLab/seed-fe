import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { SparklesIcon } from "@/shared";

export const MainHeroCaptureSection = () => {
  return (
    <Box
      as="section"
      display="flex"
      minH={{ base: "auto", lg: "calc(100dvh - {sizes.headerHeight})" }}
      w="full"
    >
      <Flex
        align={{ base: "stretch", lg: "center" }}
        direction={{ base: "column", lg: "row" }}
        gap={{ base: 14, lg: 12 }}
        justify="space-between"
        maxW="1200px"
        mx="auto"
        py={{ base: 16, md: 22, lg: 10 }}
        w="full"
      >
        <VStack align="flex-start" flex={1} gap={6} justify="center" minW={0}>
          <HStack
            bg="container.bg.card"
            borderRadius="full"
            gap={2}
            px={4}
            py={2}
          >
            <SparklesIcon boxSize={5} color="seed" />
            <Text
              color="text.secondary"
              fontSize="lg"
              fontWeight="medium"
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              생산성 +50% 로켓 탑승하기
            </Text>
          </HStack>

          <Text
            color="text"
            fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
            fontWeight={"bold"}
            letterSpacing={"-0.02em"}
            lineHeight={"1.2"}
            textAlign="left"
          >
            오래 걸리는 과제,
            <br />
            <Box as="span" color="seed">
              3단계로 압축하세요.
            </Box>
          </Text>

          <Text
            color="text.secondary"
            fontSize="xl"
            fontWeight="medium"
            letterSpacing="-0.02em"
            lineHeight="1.4"
            textAlign="left"
          >
            PDF 업로드 한 번으로 과제 로드맵부터 최적화 프롬프트까지.
          </Text>
        </VStack>

        <VStack
          align="stretch"
          flexShrink={0}
          gap={6}
          justify="center"
          maxW="486px"
          w="full"
        >
          <VStack align="stretch" gap={3}>
            <Text
              color="text"
              fontSize="xl"
              fontWeight={"bold"}
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              이메일 / 전화번호
            </Text>
            <Input
              aria-label="이메일 또는 전화번호"
              bg="container.bg.card"
              border="none"
              borderRadius="0"
              boxShadow="none"
              h={12}
              px={4}
              _focusVisible={{
                borderColor: "transparent",
                outline: "2px solid #98C95C",
                outlineOffset: "2px",
              }}
              _hover={{ borderColor: "transparent" }}
              _placeholder={{ color: "transparent" }}
            />
          </VStack>

          <Flex justify={{ base: "stretch", lg: "flex-end" }}>
            <Button
              bg="button.bg"
              borderRadius={20}
              color="button.foreground"
              fontSize="xl"
              fontWeight={700}
              letterSpacing="-0.02em"
              lineHeight="1.4"
              p={6}
              type="button"
              w={{ base: "full", lg: "auto" }}
              _active={{ bg: "seed.active" }}
              _hover={{ bg: "seed.hover" }}
            >
              알림 받아보기
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};
