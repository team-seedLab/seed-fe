import { Outlet } from "react-router";

import { Box, Flex } from "@chakra-ui/react";

import { Footer, Header } from "../components";

export const RootLayout = () => {
  return (
    <Flex direction="column" minH="100dvh">
      <Flex
        direction="column"
        maxW={{ base: "100vw", lg: "1280px" }}
        w="100vw"
        mx="auto"
        flex={1}
      >
        <Header />
        <Box
          as="main"
          flex={1}
          w="full"
          mx="auto"
          p="pagePadding"
          overflowY="auto"
        >
          <Outlet />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
};
