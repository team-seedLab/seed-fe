import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";

import { SproutAnimation } from "@/features";
import AbstractBackgroundCircle from "@/shared/_assets/images/abstract-background-circle.svg";

type Props = {
  progress: number;
  currentStepMessage: string;
};

export const UploadLoadingSection = ({
  progress,
  currentStepMessage,
}: Props) => {
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
        boxSize="800px"
        filter="blur(32px)"
        left="50%"
        opacity={0.5}
        position="absolute"
        top="50%"
        transform="translate(-50%, -50%)"
        zIndex={0}
      />

      <VStack
        gap={{ base: 4, md: 6 }}
        left="50%"
        maxW="576px"
        position="absolute"
        px={{ base: 4, md: 6 }}
        textAlign="center"
        top="50%"
        transform="translate(-50%, -50%)"
        w="full"
        zIndex={1}
      >
        <Image
          alt="background circle"
          boxSize={30}
          objectFit="contain"
          src={AbstractBackgroundCircle}
        />

        <SproutAnimation progress={progress} />

        <VStack gap={{ base: 3, md: 4 }}>
          <Text
            color="neutral.900"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            lineHeight={{ base: "1.35", md: "40px" }}
          >
            AI가 과제의 핵심을
            <br />
            분석하고 있어요
          </Text>
          <Text
            color="neutral.600"
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight="medium"
          >
            분석이 완료되면 나만의 로드맵이 펼쳐집니다.
          </Text>
        </VStack>

        <VStack gap={{ base: 2, md: 3 }} maxW={80} w="full">
          <Flex align="center" justify="space-between" w="full">
            <Text
              color="seed"
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="medium"
            >
              {currentStepMessage}
            </Text>
            <Text
              color="seed"
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="medium"
            >
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

          <Text
            color="neutral.600"
            fontSize={{ base: "2xs", md: "xs" }}
            pt={{ base: 1, md: 2 }}
          >
            잠시만 기다려주세요, 거의 다 되었습니다.
          </Text>
        </VStack>
      </VStack>
    </Flex>
  );
};
