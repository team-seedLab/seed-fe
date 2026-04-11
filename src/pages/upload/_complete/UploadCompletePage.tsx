import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import {
  PromptCard,
  ROADMAP_TYPE_LABEL,
  useGetProjectDetail,
} from "@/entities";
import { ROUTE_PATHS, toaster } from "@/shared";
import { CheckCircleIcon, ChevronRightIcon } from "@/shared/_assets/icons";

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
        p={{ base: 4, md: 5 }}
      >
        <HStack gap={{ base: 3, md: 5 }}>
          <Flex
            align="center"
            bg="neutral.50"
            borderRadius="12px"
            boxSize={{ base: 8, md: 10 }}
            flexShrink={0}
            justify="center"
          >
            <Text
              color="neutral.600"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="bold"
            >
              {asset.id}
            </Text>
          </Flex>

          <VStack align="flex-start" gap={0.5}>
            <Text
              color="neutral.900"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              lineHeight="1.4"
              wordBreak="keep-all"
            >
              {asset.title}
            </Text>
            <Text color="neutral.600" fontSize={{ base: "2xs", md: "xs" }}>
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
          <ChevronRightIcon boxSize={{ base: 3, md: 4 }} color="neutral.600" />
        </Box>
      </Flex>

      {open && (
        <VStack
          align="flex-start"
          gap={{ base: 3, md: "10px" }}
          pb={{ base: 4, md: "17px" }}
          px={{ base: 4, md: 5 }}
          w="full"
        >
          <PromptCard
            content={asset.prompt}
            copied={copiedPrompt}
            label="생성된 프롬프트"
            onCopy={() => copy(asset.prompt, setCopiedPrompt)}
          />

          {asset.result && (
            <PromptCard
              content={asset.result}
              copied={copiedResult}
              label="작업 결과"
              onCopy={() => copy(asset.result, setCopiedResult)}
            />
          )}
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
      result: step.userSubmittedResult ?? "",
    })) ?? [];

  return (
    <Flex
      bg="white"
      direction="column"
      justify="center"
      minH="100vh"
      pb={{ base: "96px", md: "160px" }}
      pt={{ base: "72px", md: "128px" }}
    >
      <Flex
        direction="column"
        gap={{ base: 6, md: 8 }}
        maxW="896px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        w="full"
      >
        <Flex
          align="center"
          direction="column"
          gap={{ base: 3, md: "14px" }}
          pb={{ base: 8, md: 10 }}
          textAlign="center"
        >
          <Flex
            align="center"
            bg="rgba(152,201,92,0.1)"
            borderRadius="full"
            boxSize={{ base: 16, md: 20 }}
            justify="center"
          >
            <CheckCircleIcon boxSize={{ base: 6, md: 8 }} color="seed" />
          </Flex>

          <VStack gap={{ base: 1.5, md: 2 }}>
            <Text
              color="neutral.900"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              lineHeight="1.4"
            >
              과제 수행 완료!
              <br />
              고생하셨습니다
            </Text>
            <Text
              color="neutral.600"
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="medium"
            >
              성공적으로 로드맵을 완성했어요.
            </Text>
          </VStack>
        </Flex>

        <Box
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius={{ base: "3xl", md: "4xl" }}
          boxShadow="0px 10px 40px -10px rgba(0,0,0,0.05)"
          mb={{ base: 2, md: 4 }}
          p={{ base: 5, md: 8 }}
        >
          <Flex
            align={{ base: "flex-start", md: "center" }}
            direction="row"
            gap={{ base: 4, md: 0 }}
            justify="space-between"
          >
            <VStack align="flex-start" gap={1}>
              <Box bg="neutral.50" borderRadius="full" px={3} py={1}>
                <Text color="neutral.600" fontSize="xs" fontWeight="semibold">
                  {project
                    ? (ROADMAP_TYPE_LABEL[project.roadmapType] ??
                      project.roadmapType)
                    : ""}
                </Text>
              </Box>
              <Text
                color="neutral.900"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                lineHeight="1.4"
              >
                {project?.title}
              </Text>
              <Text
                color="neutral.600"
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="medium"
              >
                {project?.createdAt}
              </Text>
            </VStack>

            <VStack align={{ base: "flex-start", md: "center" }} gap={1}>
              <Flex
                align="center"
                bg="rgba(152,201,92,0.1)"
                borderRadius="full"
                boxSize={{ base: 10, md: 12 }}
                justify="center"
              >
                <CheckCircleIcon
                  boxSize={{ base: 5, md: "22px" }}
                  color="seed"
                />
              </Flex>
              <Text
                color="seed"
                fontSize={{ base: "2xs", md: "xs" }}
                fontWeight="bold"
              >
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

        <Flex justify="center" mt={{ base: 2, md: 4 }}>
          <Button
            bg="seed"
            borderRadius="2xl"
            color="white"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            h={{ base: 12, md: 16 }}
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
