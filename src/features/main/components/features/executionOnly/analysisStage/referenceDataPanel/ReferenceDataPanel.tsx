import { Box, Flex, Text, VStack } from "@chakra-ui/react";

export const ReferenceDataPanel = () => {
  return (
    <Box bg="white" p={{ base: 5, lg: 12 }} w={{ base: "full", xl: "520px" }}>
      <VStack align="stretch" gap={3}>
        <Text color="#191F28" fontSize="20px" fontWeight={700} lineHeight="1.4">
          과제 참고 자료
        </Text>
        <Box bg="#2F3B24" h="175px" w="full" />
        <Flex gap={3} w="full">
          <Box bg="#98C95C" flex={1} h="362px" />
          <VStack align="stretch" flex={1} gap={3}>
            <Box bg="#598828" h="175px" w="full" />
            <Box bg="#B0D97D" h="175px" w="full" />
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
};
