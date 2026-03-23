import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, Text, Textarea, VStack } from "@chakra-ui/react";

import {
  type ProjectStepResponse,
  ROADMAP_STEP_CODES,
  ROADMAP_STEP_NAMES,
  completeProjectAPI,
  saveStepResultAPI,
  startStepAPI,
  useGetProjectDetail,
} from "@/entities";
import { ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DocumentTextIcon,
} from "@/shared/_assets/icons";

function PromptLine({ line }: { line: string }) {
  if (line.startsWith("# ") || line === "#") {
    return (
      <Text
        as="span"
        color="seed"
        display="block"
        fontSize="sm"
        lineHeight="1.4"
        fontFamily="mono"
      >
        {line}
      </Text>
    );
  }
  if (line.startsWith("//")) {
    return (
      <Text
        as="span"
        color="neutral.300"
        display="block"
        fontSize="sm"
        lineHeight="1.4"
        fontFamily="mono"
      >
        {line}
      </Text>
    );
  }
  return (
    <Text
      as="span"
      color="neutral.900"
      display="block"
      fontSize="sm"
      lineHeight="1.4"
      fontFamily="mono"
    >
      {line}
    </Text>
  );
}

function StepIndicator({
  current,
  stepCodes,
}: {
  current: number;
  stepCodes: string[];
}) {
  return (
    <Box position="relative" px="88px" w="full">
      <Flex
        align="center"
        justify="space-between"
        left="88px"
        maxW="672px"
        position="absolute"
        px={12}
        right="88px"
        top="22px"
      >
        {Array.from({ length: stepCodes.length - 1 }, (_, i) => (
          <Box key={i} bg="neutral.100" flex={1} h="2px" />
        ))}
      </Flex>

      <Flex align="flex-start" justify="space-between" maxW="672px" w="full">
        {stepCodes.map((code, i) => {
          const stepId = i + 1;
          const isActive = stepId === current;
          const isDone = stepId < current;

          return (
            <Flex align="center" direction="column" gap={3} key={code} w={24}>
              <Flex
                align="center"
                boxSize={12}
                justify="center"
                position="relative"
              >
                <Box
                  bg={isActive ? "seed" : "neutral.100"}
                  borderRadius="full"
                  bottom={0}
                  left={0}
                  opacity={isActive ? 0.3 : 0.6}
                  position="absolute"
                  right={0}
                  top={0}
                />
                <Flex
                  align="center"
                  bg={isActive || isDone ? "seed" : "neutral.300"}
                  borderRadius="full"
                  boxSize={7}
                  justify="center"
                  position="relative"
                  zIndex={1}
                >
                  <Text
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    lineHeight="16px"
                    textAlign="center"
                  >
                    {stepId}
                  </Text>
                </Flex>
              </Flex>

              <Text
                color={isActive ? "neutral.900" : "neutral.600"}
                fontSize="sm"
                fontWeight={isActive ? "bold" : "medium"}
                lineHeight="20px"
                textAlign="center"
                wordBreak="keep-all"
              >
                {ROADMAP_STEP_NAMES[code] ?? code}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

function UploadStepContent({
  projectId,
  stepNum,
}: {
  projectId: string;
  stepNum: number;
}) {
  const navigate = useNavigate();

  const [resultText, setResultText] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);

  const [stepData, setStepData] = useState<ProjectStepResponse | null>(null);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { data: project } = useGetProjectDetail(projectId);
  const roadmapType = project?.roadmapType;
  const steps = roadmapType ? ROADMAP_STEP_CODES[roadmapType] : [];
  const stepCode = steps[stepNum - 1];
  const isLastStep = stepNum >= steps.length;

  useEffect(() => {
    if (!projectId || !stepCode) return;

    const fetchStep = async () => {
      setIsStepLoading(true);
      try {
        const data = await startStepAPI({ projectId, stepCode });
        setStepData(data);
      } catch (error) {
        toaster.create({
          type: "error",
          description: getApiErrorMessage(error),
        });
      } finally {
        setIsStepLoading(false);
      }
    };

    fetchStep();
  }, [projectId, stepCode]);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    if (!navigator?.clipboard?.writeText) {
      toaster.create({
        type: "error",
        description:
          "클립보드 복사에 실패했습니다. 브라우저가 클립보드를 지원하지 않습니다.",
      });
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setter(true);
        setTimeout(() => setter(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard", error);
        toaster.create({
          type: "error",
          description:
            "클립보드 복사에 실패했습니다. 브라우저 권한 또는 HTTPS 환경을 확인해주세요.",
        });
      });
  };

  const goToPrevStep = () => {
    if (stepNum <= 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD);
    } else {
      navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum - 1}`);
    }
  };

  const goToNextStep = async () => {
    if (
      !projectId ||
      !stepCode ||
      !resultText.trim() ||
      isSaving ||
      isCompleting
    )
      return;

    setIsSaving(true);
    try {
      await saveStepResultAPI({ projectId, stepCode, resultText });

      if (isLastStep) {
        setIsCompleting(true);
        try {
          await completeProjectAPI(projectId);
          navigate(
            ROUTE_PATHS.UPLOAD_COMPLETE.replace(":projectId", projectId),
          );
        } catch (error) {
          toaster.create({
            type: "error",
            description: getApiErrorMessage(error),
          });
        } finally {
          setIsCompleting(false);
        }
      } else {
        navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum + 1}`);
      }
    } catch (error) {
      toaster.create({
        type: "error",
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Flex bg="white" direction="column" minH="100vh" pb="127px" pt="80px">
      <Flex direction="column" gap={10} mx="auto" px={6} w="full" maxW="896px">
        <VStack align="flex-start" gap={6}>
          <Button
            alignSelf="flex-start"
            color="neutral.600"
            fontSize="sm"
            fontWeight="medium"
            gap={1}
            onClick={goToPrevStep}
            px={0}
            variant="ghost"
            _hover={{ color: "neutral.900" }}
          >
            <ArrowLeftIcon boxSize={3} />
            이전 단계로
          </Button>

          <VStack align="flex-start" gap={2}>
            <Box
              bg="neutral.50"
              border="1px solid white"
              borderRadius="md"
              color="neutral.600"
              fontSize="2xs"
              fontWeight="regular"
              px="9px"
              py="5px"
            >
              {project?.roadmapType}
            </Box>
            <Text
              color="neutral.900"
              fontSize="3xl"
              fontWeight="bold"
              lineHeight="1.4"
            >
              {project?.title}
            </Text>
          </VStack>
        </VStack>

        {steps.length > 0 && (
          <StepIndicator current={stepNum} stepCodes={steps} />
        )}

        <Box
          bg="white"
          border="1px solid white"
          borderRadius="4xl"
          boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
          overflow="hidden"
          pb="1px"
        >
          <VStack align="flex-start" gap={8} p={12}>
            <VStack align="flex-start" gap="11px" w="full">
              <Text color="seed" fontSize="xs" fontWeight="bold">
                Step {stepNum}
              </Text>
              <Text color="neutral.900" fontSize="2xl" fontWeight="bold">
                {stepData?.stepName}
              </Text>
              <Text
                color="neutral.600"
                fontWeight="regular"
                lineHeight="1.4"
                pt="5px"
              >
                AI가 과제 주제를 분석하여 최적의 자료 조사를 위한 프롬프트를
                생성했습니다.
                <br />이 프롬프트를 사용하여 고품질의 레퍼런스를 확보하세요.
              </Text>
            </VStack>

            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.50"
              borderRadius="2xl"
              overflow="hidden"
              w="full"
            >
              <Flex
                align="center"
                borderBottom="1px solid"
                borderBottomColor="neutral.50"
                justify="space-between"
                py={4}
                px={6}
              >
                <Flex align="center" gap={2}>
                  <DocumentTextIcon boxSize={3} color="neutral.600" />
                  <Text color="neutral.600" fontSize="xs" fontWeight="medium">
                    생성된 프롬프트
                  </Text>
                </Flex>

                <Box
                  as="button"
                  bg="white"
                  border="1px solid"
                  borderColor="neutral.50"
                  borderRadius="lg"
                  boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
                  cursor="pointer"
                  onClick={() =>
                    stepData?.providedPromptSnapshot &&
                    copyToClipboard(
                      stepData.providedPromptSnapshot,
                      setCopiedPrompt,
                    )
                  }
                  px="13px"
                  py="7px"
                  _hover={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)" }}
                >
                  <Flex align="center" gap="6px">
                    <CopyIcon
                      boxSize={3}
                      color={copiedPrompt ? "seed" : "neutral.900"}
                    />
                    <Text
                      color={copiedPrompt ? "seed" : "neutral.900"}
                      fontSize="xs"
                      fontWeight="semibold"
                      lineHeight="16px"
                    >
                      {copiedPrompt ? "복사됨 ✓" : "복사하기"}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Box bg="neutral.50" p="28px">
                {isStepLoading ? (
                  <Text
                    color="neutral.300"
                    fontFamily="mono"
                    fontSize="sm"
                    lineHeight="1.4"
                  >
                    프롬프트를 불러오는 중...
                  </Text>
                ) : (
                  stepData?.providedPromptSnapshot
                    ?.split("\n")
                    .map((line, i) => <PromptLine key={i} line={line} />)
                )}
              </Box>
            </Box>

            {stepData?.formatPrompt && (
              <VStack align="flex-start" gap={6} w="full">
                <Text
                  color="neutral.900"
                  fontSize="2xl"
                  fontWeight="bold"
                  lineHeight="1.4"
                >
                  결과 추출
                </Text>
                <Text color="neutral.600" fontWeight="regular" lineHeight="1.4">
                  이 프롬프트를 사용하여 ai와 함께 작업한 결과를 추출해주세요.
                </Text>
                <Box
                  bg="neutral.50"
                  border="1px solid"
                  borderColor="neutral.50"
                  borderRadius="2xl"
                  overflow="hidden"
                  w="full"
                >
                  <Flex
                    align="center"
                    borderBottom="1px solid"
                    borderBottomColor="neutral.50"
                    justify="space-between"
                    py={4}
                    px={6}
                  >
                    <Flex align="center" gap={2}>
                      <DocumentTextIcon boxSize={3} color="neutral.600" />
                      <Text
                        color="neutral.600"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        작업 결과 추출 프롬프트
                      </Text>
                    </Flex>

                    <Box
                      as="button"
                      bg="white"
                      border="1px solid"
                      borderColor="neutral.50"
                      borderRadius="lg"
                      boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
                      cursor="pointer"
                      onClick={() =>
                        copyToClipboard(stepData.formatPrompt, setCopiedFormat)
                      }
                      px="13px"
                      py="7px"
                      _hover={{
                        boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)",
                      }}
                    >
                      <Flex align="center" gap="6px">
                        <CopyIcon
                          boxSize={3}
                          color={copiedFormat ? "seed" : "neutral.900"}
                        />
                        <Text
                          color={copiedFormat ? "seed" : "neutral.900"}
                          fontSize="xs"
                          fontWeight="semibold"
                          lineHeight="16px"
                        >
                          {copiedFormat ? "복사됨 ✓" : "복사하기"}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>

                  <Box bg="neutral.50" p="28px">
                    {stepData.formatPrompt.split("\n").map((line, i) => (
                      <PromptLine key={i} line={line} />
                    ))}
                  </Box>
                </Box>
              </VStack>
            )}

            <VStack align="flex-start" gap={6} pt="71px" w="full">
              <Text
                color="neutral.900"
                fontSize="2xl"
                fontWeight="bold"
                lineHeight="1.4"
              >
                작업 결과 입력
              </Text>

              <Box position="relative" w="full">
                <Textarea
                  _focusVisible={{
                    outline: "none",
                    boxShadow: "none",
                  }}
                  _placeholder={{ color: "neutral.300" }}
                  bg="neutral.50"
                  border="none"
                  borderRadius="xl"
                  color="neutral.900"
                  fontSize="sm"
                  fontWeight="medium"
                  minH={60}
                  onChange={(e) => setResultText(e.target.value)}
                  p={6}
                  placeholder="이전 단계 프롬프트로 얻은 AI의 답변을 여기에 붙여넣어 주세요. 정보를 입력하면 다음 단계 로드맵이 더욱 정교해집니다."
                  resize="vertical"
                  value={resultText}
                />
                <Box
                  backdropFilter="blur(2px)"
                  bg="rgba(255,255,255,0.6)"
                  borderRadius="4px"
                  bottom="20px"
                  position="absolute"
                  px={2}
                  py={1}
                  right="20px"
                >
                  <Text color="neutral.600" fontSize="xs" fontWeight="medium">
                    Ctrl + V
                  </Text>
                </Box>
              </Box>
            </VStack>

            <Flex justify="flex-end" pt={8} w="full">
              <Button
                bg="seed"
                borderRadius="xl"
                color="white"
                disabled={!resultText.trim() || isSaving}
                fontWeight="bold"
                gap={1}
                onClick={goToNextStep}
                opacity={resultText.trim() && !isSaving ? 1 : 0.5}
                px={10}
                py={4}
                _hover={{
                  opacity: resultText.trim() && !isSaving ? 0.85 : 0.5,
                }}
              >
                {isLastStep ? "로드맵 완성" : "다음 단계로 진행"}
                <ArrowRightIcon boxSize={3} />
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}

export default function UploadStepPage() {
  const navigate = useNavigate();
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = parseInt(step ?? "1", 10);

  useEffect(() => {
    if (!projectId || isNaN(stepNum) || stepNum < 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD, { replace: true });
    }
  }, [projectId, stepNum, navigate]);

  if (!projectId || isNaN(stepNum) || stepNum < 1) {
    return null;
  }

  return (
    <UploadStepContent
      key={`${projectId}-${stepNum}`}
      projectId={projectId}
      stepNum={stepNum}
    />
  );
}
