import { Box, Flex, HStack, Text } from "@chakra-ui/react";

import { HomeLogoLink } from "../home-logo-link";

export const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" w="100dvw">
      <Box maxW={{ base: "100vw", lg: "1280px" }} mx="auto" h="120px">
        <Flex
          h="full"
          w="full"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          position="relative"
        >
          <HomeLogoLink height={6} />
          <HStack
            display={{ base: "none", md: "flex" }}
            gap={10}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            <Text color="neutral.600" fontSize="sm">
              &copy; 2026 Seed Lab. All rights reserved.
            </Text>
          </HStack>
          <HStack gap={4} fontSize="sm">
            <Text color="neutral.600">이용 약관</Text>
            <Text color="neutral.600">개인정보처리방침</Text>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};
