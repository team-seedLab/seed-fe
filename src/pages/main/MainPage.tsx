import { useState } from "react";
import { useNavigate } from "react-router";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { useAuth } from "@/entities";
import { AssignmentHelpSection, ExecutionOnlySection } from "@/features";
import { CheckIcon, CopyIcon, ROUTE_PATHS, Seo, SparklesIcon } from "@/shared";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleStartClick = () => {
    navigate(isAuthenticated ? ROUTE_PATHS.MYPAGE : ROUTE_PATHS.LOGIN);
  };

  return (
    <>
      <Seo />
      <Flex flexDir="column" align="center" bg="white">
        <Box
          as="section"
          display="flex"
          minH="calc(100dvh - {sizes.headerHeight})"
          w="full"
        >
          <Flex
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, lg: 12 }}
            justify={{ base: "center", lg: "space-between" }}
            maxW="1200px"
            mx="auto"
            px={{ base: 6, lg: 10 }}
            py={{ base: 16, md: 22, lg: 10 }}
            w="full"
          >
            <VStack
              align="flex-start"
              flex={{ base: "none", lg: 1 }}
              gap={{ base: 3, lg: 6 }}
              justify="center"
              minW={0}
            >
              <HStack
                bg={{ base: "none", lg: "container.bg.card" }}
                borderRadius="full"
                gap={2}
                px={{ base: 0, lg: 4 }}
                py={2}
              >
                <SparklesIcon boxSize={5} color="seed" />
                <Text
                  color="text"
                  fontSize={{ base: "md", lg: "lg" }}
                  fontWeight="medium"
                >
                  생산성 +50% 로켓 탑승하기
                </Text>
              </HStack>

              <Text
                as="h1"
                color="text"
                fontSize={{ base: "3xl", md: "5xl", lg: "7xl" }}
                fontWeight="bold"
                lineHeight="1.2"
                textAlign="left"
              >
                오래 걸리는 과제,
                <br />
                <Box
                  as="span"
                  color="seed"
                  fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
                >
                  3단계로 압축하세요.
                </Box>
              </Text>

              <Text
                color="text.secondary"
                fontSize={{ base: "md", lg: "lg" }}
                fontWeight="medium"
                textAlign="left"
              >
                PDF 업로드 한 번으로
                <Box as="br" display={{ base: "block", lg: "none" }} />
                <Box as="span" display={{ base: "none", lg: "inline" }}>
                  {" "}
                </Box>
                과제 로드맵부터 최적화 프롬프트까지.
              </Text>
            </VStack>

            <VStack
              align={{ base: "stretch", lg: "flex-start" }}
              gap={4}
              justify="center"
              maxW="486px"
              w="full"
            >
              <Button
                bg="button.bg"
                borderRadius={20}
                color="button.foreground"
                disabled={isLoading}
                fontSize="xl"
                fontWeight="bold"
                p={6}
                w="full"
                _active={{ bg: "seed.active" }}
                _disabled={{
                  cursor: "not-allowed",
                  opacity: 0.5,
                }}
                _hover={{ bg: "seed.hover" }}
                onClick={handleStartClick}
              >
                시작하기
              </Button>
            </VStack>
          </Flex>
        </Box>
        <AssignmentHelpSection
          onSolutionReadyChange={setIsSolutionSectionReady}
        />
        <ExecutionOnlySection isActivated={isSolutionSectionReady} />
        <Box bg="white" py={{ base: 20, md: 24, lg: 28 }} w="full">
          <VStack
            align="stretch"
            gap={{ base: 10, lg: 14 }}
            maxW="1200px"
            mx="auto"
            px={{ base: 4, lg: 10 }}
            w="full"
          >
            <VStack
              align="start"
              gap={5}
              maxW="780px"
              w="full"
              px={{ base: 4, xl: 0 }}
            >
              <Box
                as="h2"
                color="text"
                fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
                fontWeight="bold"
                lineHeight="1.4"
              >
                프롬프트 창 앞에서
                <Box as="br" display={{ base: "block", md: "none" }} />
                <Box
                  as="span"
                  color="seed"
                  fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
                >
                  {" "}
                  망설이지 마세요.
                </Box>
                <br />
                정답은 이미
                <Box as="br" display={{ base: "block", md: "none" }} />
                <Box
                  as="span"
                  color="seed"
                  fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
                >
                  {" "}
                  SEED{" "}
                </Box>
                에 있습니다.
              </Box>
              <Box
                as="p"
                color="text.secondary"
                fontSize={{ base: "md", lg: "xl" }}
                fontWeight="medium"
                lineHeight="1.4"
              >
                수만 개의 성공적인 프롬프트 데이터와
                <Box as="br" display={{ base: "block", md: "none" }} /> 당신의
                과제물의 분석을 통해
                <br />각 로드맵에 최적화된 프롬프트를 제공합니다.
              </Box>
            </VStack>

            <Flex
              align={{ base: "stretch", md: "center" }}
              justify="center"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 6, lg: 16 }}
              px={{ base: 0, lg: 6 }}
              py={{ base: 2, lg: 10 }}
              w="full"
            >
              <Box flex="1 1 0">
                <Box
                  bg="container.bg"
                  border="1px solid"
                  borderColor="button.border.secondary"
                  borderRadius="4xl"
                  boxShadow="0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
                  p={{ base: 4, lg: 8 }}
                  w="full"
                >
                  <VStack align="stretch" gap={6} w="full">
                    <Flex align="center" justify="space-between" w="full">
                      <HStack align="center" gap={3}>
                        <Flex
                          align="center"
                          bg="seed.subtle"
                          borderRadius="full"
                          boxSize={10}
                          justify="center"
                        >
                          <SparklesIcon color="seed" boxSize={4.5} />
                        </Flex>

                        <VStack align="start" gap={0} minW={0}>
                          <Text color="text" fontSize="sm" fontWeight="bold">
                            Step 3 최적화 프롬프트
                          </Text>
                          <Text
                            color="text.secondary"
                            fontSize="xs"
                            fontWeight="regular"
                          >
                            논문형
                          </Text>
                        </VStack>
                      </HStack>

                      <Button
                        bg="button.bg"
                        borderRadius="md"
                        color="button.foreground"
                        fontSize="xs"
                        fontWeight="bold"
                        h={8}
                        minW="auto"
                        px={3}
                        py={2}
                        type="button"
                      >
                        <HStack gap={1.5}>
                          <CopyIcon color="white" boxSize={4.5} />
                          <Text color="inherit" fontSize="xs" fontWeight="bold">
                            Copy
                          </Text>
                        </HStack>
                      </Button>
                    </Flex>

                    <Box
                      bg="container.bg"
                      border="1px solid"
                      borderColor="neutral.50"
                      borderRadius="xl"
                      px={{ base: 2, lg: 5 }}
                      py={4}
                    >
                      <Text
                        color="text"
                        fontFamily="'Courier New', monospace"
                        fontSize="sm"
                        gap={0}
                        lineHeight="22.75px"
                        w="full"
                      >
                        # Role: Academic Writer
                        <br />
                        # Task: Draft an assignment based on roadmap
                        <br />
                        <br />
                        [Context]
                        <br />
                        Based on the previously summarized materials
                        <br />
                        regarding 'Inflation Impact', please draft a<br />
                        comprehensive introduction. Include the
                        <br />
                        following key arguments: ...
                        <br />
                        <br />
                        [Constraints]
                        <br />
                        - Use formal academic tone.
                        <br />- Cite sources in APA format.
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </Box>
              <VStack
                align="start"
                gap={4}
                maxW={{ base: "full", xl: "480px" }}
                pt={{ base: 2, xl: 0 }}
                px={{ base: 8, xl: 0 }}
                w="auto"
              >
                <Text
                  color="text"
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  lineHeight="1.25"
                >
                  바로 복사해서
                  <br />
                  결과를 만들어보세요.
                </Text>

                <Text
                  color="text.secondary"
                  fontSize={{ base: "md", lg: "lg" }}
                  fontWeight="regular"
                  lineHeight="1.625"
                  maxW="420px"
                >
                  로드맵 각 단계에 꼭 맞는
                  <Box as="br" display={{ base: "block", lg: "none" }} />
                  최적의 프롬프트가 생성됩니다.
                  <br />
                  고민 없이 '복사' 버튼 하나면
                  <br />
                  전문적인 결과물로 이어질 수 있습니다.
                </Text>

                <VStack align="start" gap={4} pt={4}>
                  {[
                    "단계별 맞춤형 프롬프트 제공",
                    "원클릭 복사 및 재생성",
                    "검증된 학술적 구조 적용",
                  ].map((feature) => {
                    return (
                      <HStack align="center" gap={3} key={feature} w="full">
                        <Flex
                          align="center"
                          bg="seed.subtle"
                          borderRadius="full"
                          boxSize={6}
                          justify="center"
                        >
                          <CheckIcon color="seed" boxSize={2.5} />
                        </Flex>
                        <Text
                          color="text"
                          fontSize="md"
                          fontWeight="medium"
                          lineHeight="24px"
                        >
                          {feature}
                        </Text>
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            </Flex>
          </VStack>
        </Box>
        <Box
          alignItems="center"
          as="section"
          bg="white"
          display="flex"
          minH="100dvh"
          justifyContent="center"
          py={{ base: 16, md: 20, lg: 24 }}
          w="full"
        >
          <VStack align="center" gap={{ base: 3, lg: 5 }} px={4} w="full">
            <Text
              color="text"
              fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
              fontWeight="bold"
              lineHeight="1.4"
              textAlign="center"
            >
              이제 과제는{" "}
              <Box
                as="span"
                color="seed"
                fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
              >
                어떻게
              </Box>
              가 아니라
              <br />
              <Box
                as="span"
                color="seed"
                fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
              >
                무엇을{" "}
              </Box>
              할 지만 고민하세요.
            </Text>
            <Text
              color="text.secondary"
              fontSize={{ base: "md", lg: "xl" }}
              fontWeight="medium"
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
    </>
  );
}
