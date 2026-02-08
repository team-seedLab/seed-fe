import { Outlet } from "react-router";

import { Box, Flex } from "@chakra-ui/react";

import { Header } from "../components";

export const RootLayout = () => {
  return (
    <Flex
      direction="column"
      maxW={{ base: "100vw", lg: "900px" }}
      maxH={{ base: "100dvh", md: "750px" }}
      w="100vw"
      h="100dvh"
      mx="auto"
    >
      <Header />
      <Box w="full" as="main" flex={1}>
        <Outlet />
      </Box>
    </Flex>
  );
};
