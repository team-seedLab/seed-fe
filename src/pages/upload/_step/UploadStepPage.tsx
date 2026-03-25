import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

import {
  type ProjectStepResponse,
  PromptCard,
  ROADMAP_STEP_CODES,
  completeProjectAPI,
  saveStepResultAPI,
  startStepAPI,
  useGetProjectDetail,
} from "@/entities";
import { UploadStepIndicator, UploadStepResultInput } from "@/features";
import {
  ROUTE_PATHS,
  getApiErrorMessage,
  toaster,
  useClipboardCopy,
} from "@/shared";
import { ArrowLeftIcon, ArrowRightIcon } from "@/shared/_assets/icons";

function UploadStepContent({
  projectId,
  stepNum,
}: {
  projectId: string;
  stepNum: number;
}) {
  const navigate = useNavigate();

  const [resultText, setResultText] = useState("");
  const { copied: copiedPrompt, copy: copyPrompt } = useClipboardCopy();
  const { copied: copiedFormat, copy: copyFormat } = useClipboardCopy();

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
          <UploadStepIndicator current={stepNum} stepCodes={steps} />
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

            {isStepLoading ? (
              <Box
                bg="neutral.50"
                border="1px solid"
                borderColor="neutral.50"
                borderRadius="2xl"
                overflow="hidden"
                w="full"
              >
                <Box bg="neutral.50" p="28px">
                  <Text
                    color="neutral.300"
                    fontFamily="mono"
                    fontSize="sm"
                    lineHeight="1.4"
                  >
                    프롬프트를 불러오는 중...
                  </Text>
                </Box>
              </Box>
            ) : stepData?.providedPromptSnapshot ? (
              <PromptCard
                content={stepData.providedPromptSnapshot}
                copied={copiedPrompt}
                label="생성된 프롬프트"
                onCopy={() => {
                  void copyPrompt(stepData.providedPromptSnapshot);
                }}
              />
            ) : null}

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
                <PromptCard
                  content={stepData.formatPrompt}
                  copied={copiedFormat}
                  label="작업 결과 추출 프롬프트"
                  onCopy={() => {
                    void copyFormat(stepData.formatPrompt);
                  }}
                />
              </VStack>
            )}

            <UploadStepResultInput
              value={resultText}
              onChange={setResultText}
            />

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
