import { Box, Flex, VStack } from "@chakra-ui/react";

import {
  LoginButtonSection,
  LoginHelpSection,
  LoginTitleText,
} from "@/features";

export default function LoginPage() {
  return (
    <Box bg="neutral.0" w="full">
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="calc(100dvh - {sizes.headerHeight} - {sizes.footerHeight} - {sizes.pagePadding})"
        px={4}
      >
        <VStack
          w="full"
          maxW={{ base: "100%", md: "440px" }}
          p={{ base: 8, md: 12 }}
          bg="neutral.0"
          borderRadius={{ base: "2xl", md: "3xl" }}
          border="1px solid"
          borderColor="neutral.100"
          boxShadow="0px 10px 40px -10px rgba(0,0,0,0.05)"
          gap={0}
        >
          <LoginTitleText />
          <LoginButtonSection />
          <LoginHelpSection />
        </VStack>
      </Flex>
    </Box>
  );
}
