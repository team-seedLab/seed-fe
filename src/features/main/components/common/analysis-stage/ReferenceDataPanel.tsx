import { Box, Flex, Text, VStack } from "@chakra-ui/react";

export const ReferenceDataPanel = () => {
  return (
    <Box bg="white" p={{ base: 5, lg: 12 }} w={{ base: "full", xl: "520px" }}>
      <VStack align="stretch" gap={3}>
        <Text color="text" fontSize="20px" fontWeight="bold" lineHeight="1.4">
          과제 참고 자료
        </Text>
        <Box bg="seed.900" h="175px" w="full" />
        <Flex gap={3} w="full">
          <Box bg="seed.500" flex={1} h="362px" />
          <VStack align="stretch" flex={1} gap={3}>
            <Box bg="seed.600" h="175px" w="full" />
            <Box bg="seed.400" h="175px" w="full" />
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
};
