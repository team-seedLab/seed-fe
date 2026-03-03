import { useNavigate } from "react-router";

import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";

import { ROUTE_PATHS } from "@/shared";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Flex
      h="calc(100vh - {sizes.headerHeight} - {sizes.footerHeight} - {sizes.pagePadding})"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={0} w="full" align="center">
        <Box pb={8}>
          <Flex
            w={24}
            h={24}
            borderRadius="full"
            bg="neutral.50"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="4xl" fontWeight="bold" color="neutral.600">
              !
            </Text>
          </Flex>
        </Box>

        <VStack gap={3} w="full" align="center" mb={8}>
          <Text
            as="h1"
            fontSize="2xl"
            fontWeight="bold"
            color="neutral.900"
            textAlign="center"
          >
            예상치 못한 오류가 발생했습니다
          </Text>
          <Text
            fontSize="lg"
            fontWeight="medium"
            color="neutral.600"
            textAlign="center"
          >
            요청하신 작업을 처리하는 중에 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </Text>
        </VStack>

        <HStack gap={4} mt={3}>
          <Button
            h="58px"
            bg="seed"
            color="white"
            fontWeight="bold"
            fontSize="md"
            rounded="2xl"
            px={10}
            _hover={{ bg: "seed.hover" }}
            _active={{ bg: "seed.active" }}
            onClick={() => navigate(ROUTE_PATHS.ROOT)}
          >
            홈으로 돌아가기
          </Button>
          <Button
            h="58px"
            bg="white"
            border="1px solid"
            borderColor="neutral.50"
            color="neutral.900"
            fontSize="md"
            rounded="2xl"
            px={10}
            _hover={{ bg: "neutral.50" }}
            _active={{ bg: "neutral.100" }}
            onClick={() => navigate(-1)}
          >
            이전 페이지로
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
}
