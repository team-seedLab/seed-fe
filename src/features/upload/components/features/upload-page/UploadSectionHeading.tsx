import type { ReactNode } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
};

export const UploadSectionHeading = ({ children }: Props) => {
  return (
    <Flex align="center" gap={2}>
      <Box bg="seed" borderRadius="full" h={5} w={1} />
      <Text as="h2" color="neutral.900" fontSize="md" fontWeight="bold">
        {children}
      </Text>
    </Flex>
  );
};
