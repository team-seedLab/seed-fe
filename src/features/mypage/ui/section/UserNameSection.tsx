import { Text, VStack } from "@chakra-ui/react";

type Props = {
  name: string;
};

export const UserNameSection = ({ name }: Props) => {
  return (
    <VStack align="flex-start" gap={3} px={2} pb={12}>
      <Text color="neutral.900" fontSize="4xl" fontWeight="bold">
        반가워요, {name}님
      </Text>
      <Text color="neutral.600" fontSize="lg" fontWeight="medium">
        오늘도 새로운 아이디어를 실현해보세요.
      </Text>
    </VStack>
  );
};
