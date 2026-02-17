import { Link } from "react-router";

import Logo from "/logo.webp";
import { Box, Button, Flex, HStack, Image, Text } from "@chakra-ui/react";

import { ROUTE_PATHS } from "@/shared";

export const Header = () => {
  return (
    <Box as="header" h="60px">
      <Flex
        h="full"
        w="full"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="neutral.100"
        px={4}
        position="relative"
      >
        <Link to={ROUTE_PATHS.ROOT}>
          <HStack>
            <Box bg="neutral.900" p={2} rounded="xl">
              <Image
                src={Logo}
                alt="Seed Logo"
                boxSize={8}
                objectFit="contain"
              />
            </Box>
            <Text fontWeight="extrabold" fontSize="xl">
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
          <Text color="neutral.600">서비스 소개</Text>
          <Text color="neutral.600">이용 가이드</Text>
        </HStack>
        <HStack>
          <Button bg="seed" fontWeight="bold" rounded="xl">
            시작하기
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
