import { Box, Flex, VStack } from "@chakra-ui/react";

import {
  MentorLoginFormSection,
  MentorLoginTitleText,
  useMentorLoginForm,
} from "@/features";
import { MENTOR_LOGIN_PAGE_SEO, Seo } from "@/shared";

export default function MentorLoginPage() {
  const { fields, submit } = useMentorLoginForm();

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
            canSubmit={submit.canSubmit}
            email={fields.email}
            errorMessage={submit.errorMessage}
            isSubmitting={submit.isSubmitting}
            password={fields.password}
            onEmailChange={fields.setEmail}
            onPasswordChange={fields.setPassword}
            onSubmit={submit.submitMentorLogin}
          />
        </VStack>
      </Flex>
    </Box>
  );
}
