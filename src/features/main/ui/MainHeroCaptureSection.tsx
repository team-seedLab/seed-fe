import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const badgeIcon = "/rocket-badge-icon.svg";

export const MainHeroCaptureSection = () => {
  return (
    <Box
      as="section"
      display="flex"
      minH={{ base: "auto", lg: "calc(100dvh - 108px)" }}
      w="full"
    >
      <Flex
        align={{ base: "stretch", lg: "center" }}
        direction={{ base: "column", lg: "row" }}
        gap={{ base: "56px", lg: "48px" }}
        justify="space-between"
        maxW="1200px"
        mx="auto"
        py={{ base: "72px", md: "88px", lg: "40px" }}
        w="full"
      >
        <VStack
          align="flex-start"
          flex={1}
          gap="24px"
          justify="center"
          minW={0}
        >
          <HStack
            bg="#F2F4F6"
            borderRadius="9999px"
            gap="8px"
            px="16px"
            py="8px"
          >
            <Image alt="" aria-hidden="true" boxSize="18px" src={badgeIcon} />
            <Text
              color="#4E5968"
              fontSize="20px"
              fontWeight={500}
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              생산성 +50% 로켓 탑승하기
            </Text>
          </HStack>

          <Text
            color="#191F28"
            fontSize={{ base: "40px", md: "56px", lg: "64px" }}
            fontWeight={700}
            letterSpacing={{ base: "-0.04em", lg: "-0.025em" }}
            lineHeight={{ base: "1.15", lg: "73.6px" }}
            textAlign="left"
          >
            오래 걸리는 과제,
            <br />
            <Box as="span" color="seed">
              3단계로 압축하세요.
            </Box>
          </Text>

          <Text
            color="neutral.600"
            fontSize={{ base: "18px", lg: "20px" }}
            fontWeight={500}
            letterSpacing="-0.02em"
            lineHeight="1.4"
            maxW="474px"
            textAlign="left"
          >
            PDF 업로드 한 번으로 과제 로드맵부터 최적화 프롬프트까지.
          </Text>
        </VStack>

        <VStack
          align="stretch"
          flexShrink={0}
          gap="24px"
          justify="center"
          maxW="486px"
          w="full"
        >
          <VStack align="stretch" gap="12px">
            <Text
              color="#000000"
              fontSize="20px"
              fontWeight={700}
              letterSpacing="-0.02em"
              lineHeight="1.4"
            >
              이메일 / 전화번호
            </Text>
            <Input
              aria-label="이메일 또는 전화번호"
              bg="#FAFAFA"
              border="none"
              borderRadius="0"
              boxShadow="none"
              h="48px"
              px="16px"
              _focusVisible={{
                borderColor: "transparent",
                outline: "2px solid #98C95C",
                outlineOffset: "2px",
              }}
              _hover={{ borderColor: "transparent" }}
              _placeholder={{ color: "transparent" }}
            />
          </VStack>

          <Flex justify={{ base: "stretch", lg: "flex-end" }}>
            <Button
              bg="seed"
              borderRadius="20px"
              color="white"
              fontSize="20px"
              fontWeight={700}
              h="52px"
              letterSpacing="-0.02em"
              lineHeight="1.4"
              px="24px"
              type="button"
              w={{ base: "full", lg: "179px" }}
              _active={{ bg: "seed.active" }}
              _hover={{ bg: "seed.hover" }}
            >
              알림 받아보기
            </Button>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};
