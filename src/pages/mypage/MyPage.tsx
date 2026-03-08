import { Flex } from "@chakra-ui/react";

import { ProjectListSection, UserNameSection } from "@/features";

export default function MyPage() {
  const userName = "양준식";
  return (
    <Flex align="center" bg="white" direction="column" minH="100vh">
      <Flex direction="column" maxW="1024px" w="full" py={16} px={6}>
        <UserNameSection name={userName} />
        <ProjectListSection />
      </Flex>
    </Flex>
  );
}
