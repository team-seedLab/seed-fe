import { VStack } from "@chakra-ui/react";

import { LoginButton } from "../../components";

export const LoginButtonSection = () => {
  return (
    <VStack gap={3} w="full" mb={8}>
      <LoginButton provider="kakao" />
      <LoginButton provider="google" />
    </VStack>
  );
};
