import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, Text, Textarea, VStack } from "@chakra-ui/react";

import {
  ROADMAP_STEP_CODES,
  type RoadmapType,
  useGetProjectDetail,
  useSaveStepResult,
  useStartStep,
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
        fontFamily="mono"
        fontSize="sm"
        lineHeight="1.4"
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
        fontFamily="mono"
        fontSize="sm"
        lineHeight="1.4"
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
      fontFamily="mono"
      fontSize="sm"
      lineHeight="1.4"
    >
      {line}
    </Text>
  );
}

function StepIndicator({
  current,
  stepCount,
}: {
  current: number;
  stepCount: number;
}) {
  return (
    <Box position="relative" px="88px" w="full">
      <Flex
        align="center"
        justify="space-between"
        left="88px"
        maxW="672px"
        position="absolute"
        px="48px"
        right="88px"
        top="22px"
      >
        {Array.from({ length: stepCount - 1 }, (_, i) => (
          <Box key={i} bg="neutral.100" flex={1} h="2px" />
        ))}
      </Flex>

      <Flex align="flex-start" justify="space-between" maxW="672px" w="full">
        {Array.from({ length: stepCount }, (_, i) => {
          const stepId = i + 1;
          const isActive = stepId === current;
          const isDone = stepId < current;

          return (
            <Flex
              align="center"
              direction="column"
              gap={3}
              key={stepId}
              w="96px"
            >
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
                    fontSize="12px"
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
              >
                Step {stepId}
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
  const [copied, setCopied] = useState(false);

  const { data: project } = useGetProjectDetail(projectId);
  const roadmapType = project?.roadmapType as RoadmapType | undefined;
  const steps = roadmapType ? ROADMAP_STEP_CODES[roadmapType] : [];
  const stepCode = steps[stepNum - 1];
  const isLastStep = stepNum >= steps.length;

  const {
    mutate: startStep,
    data: stepData,
    isPending: isStepLoading,
  } = useStartStep();
  const { mutate: saveResult, isPending: isSaving } = useSaveStepResult();

  useEffect(() => {
    if (projectId && stepCode) {
      startStep(
        { projectId, stepCode },
        {
          onError: (error) => {
            toaster.create({
              type: "error",
              description: getApiErrorMessage(error),
            });
          },
        },
      );
    }
  }, [projectId, stepCode, startStep]);

  const copyPrompt = () => {
    if (!stepData?.providedPromptSnapshot) return;
    navigator.clipboard.writeText(stepData.providedPromptSnapshot).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const goToPrevStep = () => {
    if (stepNum <= 1) {
      navigate(ROUTE_PATHS.FILE_UPLOAD);
    } else {
      navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum - 1}`);
    }
  };

  const goToNextStep = () => {
    if (!projectId || !stepCode || !resultText.trim() || isSaving) return;

    saveResult(
      { projectId, stepCode, resultText },
      {
        onSuccess: () => {
          if (isLastStep) {
            navigate(`/upload/complete/${projectId}`);
          } else {
            navigate(
              `${ROUTE_PATHS.UPLOAD_STEP_BASE}/${projectId}/${stepNum + 1}`,
            );
          }
        },
        onError: (error) => {
          toaster.create({
            type: "error",
            description: getApiErrorMessage(error),
          });
        },
      },
    );
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
              borderRadius="6px"
              color="neutral.600"
              fontSize="10px"
              fontWeight="regular"
              px="9px"
              py="5px"
            >
              {project?.roadmapType}
            </Box>
            <Text
              color="neutral.900"
              fontSize="30px"
              fontWeight="bold"
              lineHeight="1.4"
            >
              {project?.title}
            </Text>
          </VStack>
        </VStack>

        {steps.length > 0 && (
          <StepIndicator current={stepNum} stepCount={steps.length} />
        )}

        <Box
          bg="white"
          border="1px solid white"
          borderRadius="32px"
          boxShadow="0px 20px 60px -10px rgba(0,0,0,0.08)"
          overflow="hidden"
          pb="1px"
        >
          <VStack align="flex-start" gap={8} p={12}>
            <VStack align="flex-start" gap="11px" w="full">
              <Text
                color="seed"
                fontSize="12px"
                fontWeight="bold"
                letterSpacing="-0.24px"
              >
                Step {stepNum}
              </Text>
              <Text
                color="neutral.900"
                fontSize="26px"
                fontWeight="bold"
                letterSpacing="-0.52px"
                lineHeight="1.4"
              >
                {stepData?.stepName}
              </Text>
              <Text
                color="neutral.600"
                fontWeight="regular"
                lineHeight="1.4"
                pt="5px"
              >
                AI가 생성한 프롬프트를 복사하여 사용하세요.
              </Text>
            </VStack>

            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.50"
              borderRadius="16px"
              overflow="hidden"
              w="full"
            >
              <Flex
                align="center"
                borderBottom="1px solid"
                borderBottomColor="neutral.50"
                justify="space-between"
                pb="17px"
                pt="16px"
                px={6}
              >
                <Flex align="center" gap={2}>
                  <DocumentTextIcon boxSize={3} color="neutral.600" />
                  <Text
                    color="neutral.600"
                    fontSize="12px"
                    fontWeight="medium"
                    letterSpacing="-0.24px"
                  >
                    Generated Prompt
                  </Text>
                </Flex>

                <Box
                  as="button"
                  bg="white"
                  border="1px solid"
                  borderColor="neutral.50"
                  borderRadius="8px"
                  boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
                  cursor="pointer"
                  onClick={copyPrompt}
                  px="13px"
                  py="7px"
                  _hover={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)" }}
                >
                  <Flex align="center" gap="6px">
                    <CopyIcon
                      boxSize={3}
                      color={copied ? "seed" : "neutral.900"}
                    />
                    <Text
                      color={copied ? "seed" : "neutral.900"}
                      fontSize="12px"
                      fontWeight="semibold"
                      lineHeight="16px"
                    >
                      {copied ? "복사됨 ✓" : "복사하기"}
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

            <VStack align="flex-start" gap={6} pt="71px" w="full">
              <Text
                color="neutral.900"
                fontSize="26px"
                fontWeight="bold"
                letterSpacing="-0.52px"
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
                  borderRadius="12px"
                  color="neutral.900"
                  fontSize="sm"
                  fontWeight="medium"
                  letterSpacing="-0.28px"
                  minH="240px"
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
                  <Text
                    color="neutral.600"
                    fontSize="12px"
                    fontWeight="medium"
                    letterSpacing="-0.24px"
                  >
                    Ctrl + V to paste
                  </Text>
                </Box>
              </Box>
            </VStack>

            <Flex justify="flex-end" pt={8} w="full">
              <Button
                bg="seed"
                borderRadius="12px"
                color="white"
                cursor={
                  resultText.trim() && !isSaving ? "pointer" : "not-allowed"
                }
                fontSize="16px"
                fontWeight="bold"
                gap={1}
                letterSpacing="-0.32px"
                onClick={goToNextStep}
                opacity={resultText.trim() && !isSaving ? 1 : 0.5}
                px={10}
                py={4}
                _hover={{
                  opacity: resultText.trim() && !isSaving ? 0.85 : 0.5,
                }}
              >
                {isLastStep ? "로드맵 완성" : "다음 단계로 진행"}
                <ArrowRightIcon boxSize="13px" />
              </Button>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}

export default function UploadStepPage() {
  const { projectId, step } = useParams<{
    projectId: string;
    step: string;
  }>();
  const stepNum = parseInt(step ?? "1", 10);

  return (
    <UploadStepContent
      key={`${projectId}-${stepNum}`}
      projectId={projectId ?? ""}
      stepNum={stepNum}
    />
  );
}
