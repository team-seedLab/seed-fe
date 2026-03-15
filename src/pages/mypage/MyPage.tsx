import { Flex } from "@chakra-ui/react";

import { ProjectListSection, UserNameSection } from "@/features";

export default function MyPage() {
  return (
    <Flex align="center" bg="container.bg" direction="column" minH="100vh">
      <Flex direction="column" maxW="1024px" w="full" py={16} px={6}>
        <UserNameSection />
        <ProjectListSection />
      </Flex>
    </Flex>
  );
}
