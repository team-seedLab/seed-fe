import { Flex } from "@chakra-ui/react";

import { ProjectListSection, UserNameSection } from "@/features";

export default function MyPage() {
  return (
    <Flex align="center" bg="container.bg" direction="column" minH="100vh">
      <Flex
        direction="column"
        maxW="1024px"
        px={{ base: 4, md: 6 }}
        py={{ base: 10, md: 16 }}
        w="full"
      >
        <UserNameSection />
        <ProjectListSection />
      </Flex>
    </Flex>
  );
}
