import { Link } from "react-router";

import { HStack, Text } from "@chakra-ui/react";

export const LoginHelpSection = () => {
  return (
    <HStack gap={1} fontSize={{ base: "xs", md: "sm" }}>
      <Text color="neutral.600">도움이 필요하신가요?</Text>
      <Link to="#">
        <Text
          color="neutral.800"
          textDecoration="underline"
          textDecorationColor="neutral.800"
          _hover={{ color: "neutral.900" }}
        >
          문의하기
        </Text>
      </Link>
    </HStack>
  );
};
