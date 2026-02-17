import { Link } from "react-router";

import Logo from "/logo.webp";
import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";

import { ROUTE_PATHS } from "@/shared";

export const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" w="100vw">
      <Box maxW={{ base: "100vw", lg: "1280px" }} mx="auto" h="120px">
        <Flex
          h="full"
          w="full"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          position="relative"
        >
          <Link to={ROUTE_PATHS.ROOT}>
            <HStack>
              <Box bg="neutral.900" p={2} rounded="lg">
                <Image
                  src={Logo}
                  alt="Seed Logo"
                  boxSize={4}
                  objectFit="contain"
                />
              </Box>
              <Text fontWeight="extrabold" fontSize="lg">
                SEED
              </Text>
            </HStack>
          </Link>
          <HStack
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
