import { useState } from "react";

import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { AssignmentHelpSection, ExecutionOnlySection } from "@/features";
import {
  ActionableOutputPanel,
  PromptPreviewCard,
} from "@/features/main/components";
import { SparklesIcon } from "@/shared";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);

  return (
    <Flex flexDir="column" align="center" bg="white">
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

          {/* 이메일/전화번호 입력은 추가적인 로직이 필요하므로 추후 컴포넌트화 필요 */}
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
      <AssignmentHelpSection
        onSolutionReadyChange={setIsSolutionSectionReady}
      />
      <ExecutionOnlySection isActivated={isSolutionSectionReady} />
      <Box bg="white" py={{ base: 16, md: 20, lg: 24 }} w="full">
        <VStack
          align="stretch"
          gap={12}
          maxW="1200px"
          mx="auto"
          px={10}
          w="full"
        >
          <VStack align="start" gap={3} maxW="780px" w="full">
            <Box
              as="h2"
              color="text"
              fontSize={{ base: "4xl", lg: "5xl" }}
              fontWeight="bold"
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              프롬프트 창 앞에서 망설이지 마세요.
              <br />
              정답은 이미 SEED에 있습니다.
            </Box>
            <Box
              as="p"
              color="text.secondary"
              fontSize={{ base: "md", lg: "xl" }}
              fontWeight="medium"
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              수만 개의 성공적인 프롬프트 데이터와 당신의 과제물의 분석을 통해
              <br />각 로드맵에 최적화된 프롬프트를 제공합니다.
            </Box>
          </VStack>

          <Flex
            align={{ base: "stretch", xl: "center" }}
            direction={{ base: "column", xl: "row" }}
            gap={{ base: 10, xl: 16 }}
            px={{ base: 0, lg: 6 }}
            py={{ base: 0, lg: 6 }}
            w="full"
          >
            <Box flex="1 1 0" minW={0}>
              <PromptPreviewCard />
            </Box>
            <ActionableOutputPanel />
          </Flex>
        </VStack>
      </Box>
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
    </Flex>
  );
}
