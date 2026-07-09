import { Flex, Text } from "@chakra-ui/react";

export default function MentorMenteeProjectsPage() {
  return (
    <Flex
      align="center"
      bg="container.bg"
      direction="column"
      justify="center"
      minH="100vh"
      px={4}
    >
      <Text color="text" fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
        멘티 프로젝트 목록
      </Text>
    </Flex>
  );
}
