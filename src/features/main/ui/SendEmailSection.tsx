import { Button, Flex, Input, Text, VStack } from "@chakra-ui/react";

import { CheckIcon } from "@/shared";

import { useSendEmail } from "../hooks";

export const SendEmailSection = () => {
  const {
    email,
    setEmail,
    submitStatus,
    errorMessage,
    submitWaitlistEmail,
    submitOnEnter,
  } = useSendEmail();

  return (
    <VStack align="stretch" gap={6} justify="center" maxW="486px" w="full">
      {submitStatus === "success" ? (
        <VStack bg="seed.subtle" borderRadius="xl" gap={3} p={5}>
          <CheckIcon boxSize={5} color="seed" />
          <Text color="seed" fontWeight="semibold">
            알림 신청이 완료되었습니다!
          </Text>
        </VStack>
      ) : (
        <>
          <VStack align="start" gap={{ base: 2, lg: 3 }}>
            <Text
              color="text"
              fontSize={{ base: "lg", lg: "xl" }}
              fontWeight="bold"
            >
              이메일
            </Text>
            <Input
              aria-label="이메일 입력"
              bg="container.bg.card"
              border="none"
              borderRadius="sm"
              boxShadow="none"
              h={12}
              placeholder="이메일 주소를 입력하세요"
              px={4}
              type="email"
              value={email}
              inputMode="email"
              _focusVisible={{
                borderColor: "transparent",
                outline: "2px solid",
                outlineColor: "seed",
              }}
              _hover={{ borderColor: "transparent" }}
              _placeholder={{ color: "text.placeholder" }}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={submitOnEnter}
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
              fontSize="xl"
              fontWeight="bold"
              loading={submitStatus === "loading"}
              loadingText="알림 받아보기"
              p={6}
              w={{ base: "full", lg: "auto" }}
              _active={{ bg: "seed.active" }}
              _hover={{ bg: "seed.hover" }}
              onClick={submitWaitlistEmail}
            >
              알림 받아보기
            </Button>
          </Flex>
        </>
      )}
    </VStack>
  );
};
