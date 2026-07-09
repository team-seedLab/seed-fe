import { Box, Flex } from "@chakra-ui/react";

import { MENTOR_LOGIN_PAGE_SEO, Seo } from "@/shared";

export default function MentorLoginPage() {
  return (
    <Box bg="neutral.0" w="full">
      <Seo config={MENTOR_LOGIN_PAGE_SEO} />
      <Flex
        align="center"
        justify="center"
        minH="calc(100dvh - {sizes.headerHeight} - {sizes.footerHeight} - {sizes.pagePadding})"
        px={4}
      >
        <Box maxW="440px" w="full" />
      </Flex>
    </Box>
  );
}
