import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { useCompleteProject, useGetProjectDetail } from "@/entities";
import { ROUTE_PATHS, getApiErrorMessage, toaster } from "@/shared";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  CopyIcon,
} from "@/shared/_assets/icons";

type Asset = {
  id: number;
  title: string;
  subtitle: string;
  prompt: string;
  result: string;
};

function AssetItem({
  asset,
  defaultOpen,
}: {
  asset: Asset;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const copy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 2000);
    });
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="16px"
      overflow="hidden"
      w="full"
    >
      <Flex
        align="center"
        cursor="pointer"
        justify="space-between"
        onClick={() => setOpen((v) => !v)}
        p={5}
      >
        <HStack gap={5}>
          <Flex
            align="center"
            bg="neutral.50"
            borderRadius="12px"
            flexShrink={0}
            h="40px"
            justify="center"
            w="40px"
          >
            <Text color="neutral.600" fontSize="14px" fontWeight="bold">
              {asset.id}
            </Text>
          </Flex>
          <VStack align="flex-start" gap={0.5}>
            <Text
              color="neutral.900"
              fontSize="16px"
              fontWeight="bold"
              letterSpacing="-0.32px"
            >
              {asset.title}
            </Text>
            <Text color="neutral.600" fontSize="12px">
              {asset.subtitle}
            </Text>
          </VStack>
        </HStack>
        <Box
          style={{
            transform: open ? "rotate(270deg)" : "rotate(90deg)",
            transition: "transform 0.2s",
          }}
        >
          <ChevronRightIcon boxSize={4} color="neutral.600" />
        </Box>
      </Flex>

      {open && (
        <VStack align="flex-start" gap="10px" pb="17px" px={5}>
          <Box
            bg="neutral.50"
            border="1px solid"
            borderColor="neutral.50"
            borderRadius="12px"
            p="21px"
            w="full"
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text color="neutral.600" fontSize="12px" fontWeight="semibold">
                Generated Prompt
              </Text>
              <Button
                color={copiedPrompt ? "seed" : "neutral.600"}
                fontSize="12px"
                fontWeight="bold"
                gap={1.5}
                onClick={() => copy(asset.prompt, setCopiedPrompt)}
                px={2}
                py={1.5}
                size="xs"
                variant="ghost"
              >
                <CopyIcon boxSize={3} />
                {copiedPrompt ? "복사됨 ✓" : "복사하기"}
              </Button>
            </Flex>
            <Text
              as="pre"
              color="neutral.900"
              fontFamily="mono"
              fontSize="12px"
              lineHeight="1.4"
              whiteSpace="pre-wrap"
            >
              {asset.prompt}
            </Text>
          </Box>

          <Box
            bg="neutral.50"
            border="1px solid"
            borderColor="neutral.50"
            borderRadius="12px"
            p="21px"
            w="full"
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text color="neutral.600" fontSize="12px" fontWeight="semibold">
                Prompt Result
              </Text>
              {asset.result && (
                <Button
                  color="seed"
                  fontSize="12px"
                  fontWeight="bold"
                  gap={1.5}
                  onClick={() => copy(asset.result, setCopiedResult)}
                  px={2}
                  py={1.5}
                  size="xs"
                  variant="ghost"
                >
                  <CopyIcon boxSize={3} />
                  {copiedResult ? "복사됨 ✓" : "복사하기"}
                </Button>
              )}
            </Flex>
            {asset.result ? (
              <Text color="neutral.900" fontSize="14px" lineHeight="1.4">
                {asset.result}
              </Text>
            ) : (
              <Text color="neutral.600" fontSize="14px">
                결과가 입력되지 않았습니다.
              </Text>
            )}
          </Box>
        </VStack>
      )}
    </Box>
  );
}

export default function UploadCompletePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project } = useGetProjectDetail(projectId ?? "");
  const { mutate: completeProject } = useCompleteProject();

  useEffect(() => {
    if (projectId) {
      completeProject(projectId, {
        onError: (error) => {
          toaster.create({
            type: "error",
            description: getApiErrorMessage(error),
          });
        },
      });
    }
  }, [projectId, completeProject]);

  const goToMyPage = () => navigate(ROUTE_PATHS.MYPAGE);

  const assets: Asset[] =
    project?.stepResponses.map((step, index) => ({
      id: index + 1,
      title: step.stepName,
      subtitle: step.stepCode,
      prompt: step.providedPromptSnapshot,
      result: "",
    })) ?? [];

  return (
    <Flex
      bg="white"
      direction="column"
      justify="center"
      minH="100vh"
      pb="160px"
      pt="128px"
    >
      <Flex direction="column" gap={8} mx="auto" px={6} w="full" maxW="896px">
        <Flex
          align="center"
          direction="column"
          gap="14px"
          pb={10}
          textAlign="center"
        >
          <Flex
            align="center"
            bg="rgba(152,201,92,0.1)"
            borderRadius="full"
            h="80px"
            justify="center"
            w="80px"
          >
            <CheckCircleIcon boxSize="33px" color="seed" />
          </Flex>

          <VStack gap={2}>
            <Text
              color="neutral.900"
              fontSize="30px"
              fontWeight="bold"
              letterSpacing="-0.6px"
              lineHeight="1.4"
            >
              과제 압축 완료!
              <br />
              고생하셨습니다.
            </Text>
            <Text color="neutral.600" fontSize="18px" fontWeight="medium">
              성공적으로 로드맵을 완주했어요.
            </Text>
          </VStack>
        </Flex>

        <Box
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius="32px"
          boxShadow="0px 10px 40px -10px rgba(0,0,0,0.05)"
          mb={4}
          p="33px"
        >
          <Flex align="center" justify="space-between">
            <VStack align="flex-start" gap={1}>
              <Box bg="neutral.50" borderRadius="full" px={3} py={1}>
                <Text
                  color="neutral.600"
                  fontSize="12px"
                  fontWeight="semibold"
                  letterSpacing="0.3px"
                  textTransform="uppercase"
                >
                  Assignment
                </Text>
              </Box>
              <Text
                color="neutral.900"
                fontSize="26px"
                fontWeight="bold"
                letterSpacing="-0.52px"
              >
                {project?.title}
              </Text>
              <Text
                color="neutral.600"
                fontSize="14px"
                fontWeight="medium"
                letterSpacing="-0.28px"
              >
                {project?.createdAt}
              </Text>
            </VStack>

            <VStack align="center" gap={1}>
              <Flex
                align="center"
                bg="rgba(152,201,92,0.1)"
                borderRadius="full"
                h="48px"
                justify="center"
                w="48px"
              >
                <CheckCircleIcon boxSize="22px" color="seed" />
              </Flex>
              <Text
                color="seed"
                fontSize="12px"
                fontWeight="bold"
                letterSpacing="-0.24px"
              >
                로드맵 완료
              </Text>
            </VStack>
          </Flex>
        </Box>

        <VStack align="flex-start" gap={4} w="full">
          <Text
            color="neutral.600"
            fontSize="14px"
            fontWeight="semibold"
            letterSpacing="-0.28px"
          >
            생성된 자산 (Generated Assets)
          </Text>

          <VStack gap={4} w="full">
            {assets.map((asset, i) => (
              <AssetItem key={asset.id} asset={asset} defaultOpen={i === 0} />
            ))}
          </VStack>
        </VStack>

        <Flex justify="center" mt={4}>
          <Button
            bg="seed"
            borderRadius="16px"
            color="white"
            fontSize="18px"
            fontWeight="bold"
            h="60px"
            maxW="624px"
            onClick={goToMyPage}
            w="full"
            _hover={{ opacity: 0.85 }}
          >
            마이페이지로 이동
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
