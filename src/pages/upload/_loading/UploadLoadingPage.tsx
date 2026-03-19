import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";

import { SproutAnimation } from "@/features";
import { ROUTE_PATHS } from "@/shared";
import AbstractBackgroundCircle from "@/shared/_assets/images/abstract-background-circle.svg";

const LOADING_STEPS = [
  { threshold: 0, message: "파일 업로드 중..." },
  { threshold: 20, message: "PDF 텍스트 추출 중..." },
  { threshold: 50, message: "과제 내용 분석 중..." },
  { threshold: 75, message: "3단계 로드맵 생성 중..." },
  { threshold: 95, message: "마무리 중..." },
];

export default function UploadLoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev < 70 ? 1.2 : prev < 90 ? 0.6 : 0.3;
        return Math.min(prev + increment, 100);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        navigate(`${ROUTE_PATHS.UPLOAD_STEP_BASE}/1`);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  const currentStep =
    [...LOADING_STEPS].reverse().find((s) => progress >= s.threshold) ??
    LOADING_STEPS[0];

  return (
    <Flex
      align="center"
      bg="white"
      direction="column"
      h="100vh"
      justify="center"
      overflow="hidden"
      position="relative"
    >
      <Box
        bg="seed.subtle"
        borderRadius="full"
        filter="blur(32px)"
        boxSize="800px"
        left="50%"
        opacity={0.5}
        position="absolute"
        top="50%"
        transform="translate(-50%, -50%)"
        zIndex={0}
      />

      <VStack
        gap={6}
        left="50%"
        maxW="576px"
        position="absolute"
        px={6}
        textAlign="center"
        top="50%"
        transform="translate(-50%, -50%)"
        w="full"
        zIndex={1}
      >
        <Image
          alt="background circle"
          src={AbstractBackgroundCircle}
          boxSize={30}
          objectFit="contain"
        />

        <SproutAnimation progress={progress} />

        <VStack gap={4}>
          <Text
            color="neutral.900"
            fontSize="36px"
            fontWeight="bold"
            lineHeight="40px"
          >
            AI가 과제의 핵심을
            <br />
            분석하고 있어요
          </Text>
          <Text color="neutral.600" fontSize="lg" fontWeight="medium">
            분석이 완료되면 나만의 3단계 로드맵이 펼쳐집니다.
          </Text>
        </VStack>

        <VStack gap={3} maxW="320px" w="full">
          <Flex align="center" justify="space-between" w="full">
            <Text color="seed" fontSize="xs" fontWeight="medium">
              {currentStep.message}
            </Text>
            <Text color="seed" fontSize="xs" fontWeight="medium">
              {Math.round(progress)}%
            </Text>
          </Flex>

          <Box
            bg="neutral.300"
            borderRadius="full"
            h="6px"
            overflow="hidden"
            w="full"
          >
            <Box
              bg="seed"
              borderRadius="full"
              h="full"
              style={{ transition: "width 0.1s linear" }}
              w={`${progress}%`}
            />
          </Box>

          <Text color="neutral.600" fontSize="xs" pt={2}>
            잠시만 기다려주세요, 거의 다 되었습니다.
          </Text>
        </VStack>
      </VStack>
    </Flex>
  );
}
