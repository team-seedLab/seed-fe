import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { useGetProjectDetail } from "@/entities";
import { ROUTE_PATHS, toaster } from "@/shared";
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

  const copy = (text: string, setter: (v: boolean) => void) => {
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

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="neutral.50"
      borderRadius="2xl"
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
            boxSize={10}
            justify="center"
          >
            <Text color="neutral.600" fontSize="sm" fontWeight="bold">
              {asset.id}
            </Text>
          </Flex>
          <VStack align="flex-start" gap={0.5}>
            <Text color="neutral.900" fontWeight="bold">
              {asset.title}
            </Text>
            <Text color="neutral.600" fontSize="xs">
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
            borderRadius="xl"
            p={5}
            w="full"
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text color="neutral.600" fontSize="xs" fontWeight="semibold">
                생성된 프롬프트
              </Text>
              <Button
                color={copiedPrompt ? "seed" : "neutral.600"}
                fontSize="xs"
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
              fontSize="xs"
              lineHeight="1.4"
              whiteSpace="pre-wrap"
            >
              {asset.prompt}
            </Text>
          </Box>

          {/* <Box
            bg="neutral.50"
            border="1px solid"
            borderColor="neutral.50"
            borderRadius="xl"
            p={5}
            w="full"
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Text color="neutral.600" fontSize="xs" fontWeight="semibold">
                Prompt Result
              </Text>
              {asset.result && (
                <Button
                  color="seed"
                  fontSize="xs"
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
              <Text color="neutral.900" fontSize="sm" lineHeight="1.4">
                {asset.result}
              </Text>
            ) : (
              <Text color="neutral.600" fontSize="sm">
                결과가 입력되지 않았습니다.
              </Text>
            )}
          </Box> */}
        </VStack>
      )}
    </Box>
  );
}

export default function UploadCompletePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data: project } = useGetProjectDetail(projectId ?? "");

  useEffect(() => {
    if (!projectId) {
      navigate(ROUTE_PATHS.MYPAGE);
    }
  }, [projectId, navigate]);

  if (!projectId) {
    return null;
  }

  const goToMyPage = () => navigate(ROUTE_PATHS.MYPAGE);

  const assets: Asset[] =
    project?.stepResponses?.map((step, index) => ({
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
            boxSize={20}
            justify="center"
          >
            <CheckCircleIcon boxSize={8} color="seed" />
          </Flex>

          <VStack gap={2}>
            <Text
              color="neutral.900"
              fontSize="3xl"
              fontWeight="bold"
              lineHeight="1.4"
            >
              과제 압축 완료!
              <br />
              고생하셨습니다.
            </Text>
            <Text color="neutral.600" fontSize="lg" fontWeight="medium">
              성공적으로 로드맵을 완주했어요.
            </Text>
          </VStack>
        </Flex>

        <Box
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius="4xl"
          boxShadow="0px 10px 40px -10px rgba(0,0,0,0.05)"
          mb={4}
          p="33px"
        >
          <Flex align="center" justify="space-between">
            <VStack align="flex-start" gap={1}>
              <Box bg="neutral.50" borderRadius="full" px={3} py={1}>
                <Text
                  color="neutral.600"
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                >
                  Assignment
                </Text>
              </Box>
              <Text color="neutral.900" fontSize="2xl" fontWeight="bold">
                {project?.title}
              </Text>
              <Text color="neutral.600" fontSize="sm" fontWeight="medium">
                {project?.createdAt}
              </Text>
            </VStack>

            <VStack align="center" gap={1}>
              <Flex
                align="center"
                bg="rgba(152,201,92,0.1)"
                borderRadius="full"
                boxSize={12}
                justify="center"
              >
                <CheckCircleIcon boxSize="22px" color="seed" />
              </Flex>
              <Text color="seed" fontSize="xs" fontWeight="bold">
                로드맵 완료
              </Text>
            </VStack>
          </Flex>
        </Box>

        <VStack align="flex-start" gap={4} w="full">
          <Text color="neutral.600" fontSize="sm" fontWeight="semibold">
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
            borderRadius="2xl"
            color="white"
            fontSize="lg"
            fontWeight="bold"
            h={16}
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
