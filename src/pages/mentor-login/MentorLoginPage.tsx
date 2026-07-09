import { useState } from "react";

import { Box, Flex, VStack } from "@chakra-ui/react";

import { MentorLoginFormSection, MentorLoginTitleText } from "@/features";
import { MENTOR_LOGIN_PAGE_SEO, Seo } from "@/shared";

export default function MentorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box bg="neutral.0" w="full">
      <Seo config={MENTOR_LOGIN_PAGE_SEO} />
      <Flex
        align="center"
        justify="center"
        minH="calc(100dvh - {sizes.headerHeight} - {sizes.footerHeight} - {sizes.pagePadding})"
        px={4}
      >
        <VStack
          align="stretch"
          gap={12}
          maxW="440px"
          px={{ base: 6, md: 16 }}
          py={{ base: 8, md: 9 }}
          w="full"
        >
          <MentorLoginTitleText />
          <MentorLoginFormSection
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={() => undefined}
          />
        </VStack>
      </Flex>
    </Box>
  );
}
