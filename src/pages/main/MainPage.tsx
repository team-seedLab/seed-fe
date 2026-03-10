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
import { CheckIcon, CopyIcon, SparklesIcon, supabase } from "@/shared";

export default function MainPage() {
  const [isSolutionSectionReady, setIsSolutionSectionReady] = useState(false);
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitWaitlistEmail = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase.functions.invoke("notify-waitlist", {
        body: { email: trimmedEmail },
      });

      if (error) {
        let message = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        try {
          const body = await (
            error as { context?: { json: () => Promise<{ error?: string }> } }
          ).context?.json();
          if (body?.error) message = body.error;
        } catch (e) {
          // 에러 메시지 파싱 실패 시 기본 메시지 사용
          console.error("Error parsing error message:", e);
        }
        setErrorMessage(message);
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
    } catch {
      setErrorMessage("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setSubmitStatus("error");
    }
  };

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
              fontWeight="bold"
              letterSpacing="-0.02em"
              lineHeight="1.2"
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
            {submitStatus === "success" ? (
              <Flex
                align="center"
                bg="seed.subtle"
                borderRadius="xl"
                gap={3}
                justify="center"
                p={5}
              >
                <CheckIcon boxSize={5} color="seed" />
                <Text color="seed" fontWeight="semibold">
                  알림 신청이 완료되었습니다!
                </Text>
              </Flex>
            ) : (
              <>
                <VStack align="stretch" gap={3}>
                  <Text
                    color="text"
                    fontSize="xl"
                    fontWeight="bold"
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
                    placeholder="이메일 주소를 입력하세요"
                    px={4}
                    type="email"
                    value={email}
                    _focusVisible={{
                      borderColor: "transparent",
                      outline: "2px solid",
                      outlineColor: "seed",
                      outlineOffset: "2px",
                    }}
                    _hover={{ borderColor: "transparent" }}
                    _placeholder={{ color: "text.placeholder" }}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitWaitlistEmail();
                    }}
                  />
                  {submitStatus === "error" && (
                    <Text color="red.500" fontSize="sm">
                      {errorMessage}
                    </Text>
                  )}
                </VStack>

                <Flex justify={{ base: "stretch", lg: "flex-end" }}>
                  <Button
                    bg="button.bg"
                    borderRadius={20}
                    color="button.foreground"
                    disabled={submitStatus === "loading"}
                    fontSize="xl"
                    fontWeight={700}
                    letterSpacing="-0.02em"
                    lineHeight="1.4"
                    opacity={submitStatus === "loading" ? 0.7 : 1}
                    p={6}
                    type="button"
                    w={{ base: "full", lg: "auto" }}
                    _active={{ bg: "seed.active" }}
                    _hover={{ bg: "seed.hover" }}
                    onClick={submitWaitlistEmail}
                  >
                    {submitStatus === "loading"
                      ? "신청 중..."
                      : "알림 받아보기"}
                  </Button>
                </Flex>
              </>
            )}
          </VStack>
        </Flex>
      </Box>
      <AssignmentHelpSection
        onSolutionReadyChange={setIsSolutionSectionReady}
      />
      <ExecutionOnlySection isActivated={isSolutionSectionReady} />
      <Box bg="white" py={{ base: 16, md: 20, lg: 24 }} w="full">
        <VStack align="stretch" gap={12} maxW={300} mx="auto" px={10} w="full">
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
              <Box
                bg="container.bg"
                border="1px solid"
                borderColor="button.border.secondary"
                borderRadius="4xl"
                boxShadow="0px 20px 40px 0px rgba(0, 0, 0, 0.08)"
                px={{ base: 6, lg: 8 }}
                py={{ base: 6, lg: 8 }}
                w="full"
              >
                <VStack align="stretch" gap={6} w="full">
                  <Flex align="center" justify="space-between" w="full">
                    <HStack align="center" gap={3}>
                      <Flex
                        align="center"
                        bg="container.bg.card"
                        borderRadius="full"
                        boxSize={10}
                        justify="center"
                      >
                        <SparklesIcon color="seed" boxSize={4.5} />
                      </Flex>

                      <VStack align="start" gap={0} minW={0}>
                        <Text
                          color="text"
                          fontSize="sm"
                          fontWeight="bold"
                          letterSpacing="-0.02em"
                          lineHeight="20px"
                        >
                          Step 3 최적화 프롬프트
                        </Text>
                        <Text
                          color="text.secondary"
                          fontSize="xs"
                          fontWeight="regular"
                          letterSpacing="-0.02em"
                          lineHeight="16px"
                        >
                          Professional Mode
                        </Text>
                      </VStack>
                    </HStack>

                    <Button
                      bg="neutral.900"
                      borderRadius="md"
                      color="white"
                      fontSize="xs"
                      fontWeight="bold"
                      h={8}
                      minW="auto"
                      px={3}
                      py={2}
                      type="button"
                      _hover={{ bg: "#2A3038" }}
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
                    px={5}
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

                  <Box
                    borderTop="1px solid"
                    borderColor="neutral.50"
                    minH={4}
                    pt={5}
                    w="full"
                  />
                </VStack>
              </Box>
            </Box>
            <VStack
              align="start"
              flex="1 1 0"
              gap={4}
              maxW={{ base: "full", xl: 120 }}
              minW={0}
              pt={{ base: 2, xl: 0 }}
              w="full"
            >
              <Box
                bg="container.bg"
                borderRadius="lg"
                color="seed"
                px={3}
                py={1}
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  letterSpacing="-0.02em"
                  lineHeight="20px"
                >
                  Actionable Output
                </Text>
              </Box>

              <Text
                color="text"
                fontSize={{ base: "3xl", lg: "4xl" }}
                fontWeight="bold"
                letterSpacing="-0.02em"
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
                letterSpacing="-0.02em"
                lineHeight="1.625"
                maxW={105}
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
            fontSize={{ base: "3xl", lg: "5xl" }}
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
