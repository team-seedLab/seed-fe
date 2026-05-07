import { Skeleton, Text, VStack } from "@chakra-ui/react";

import { useUserInfoStore } from "@/entities";

export const UserNameSection = () => {
  const nickname = useUserInfoStore((state) => {
    return state.userInfo?.nickname ?? state.persistedProfile?.nickname;
  });

  return (
    <VStack
      align="flex-start"
      gap={{ base: 2, md: 3 }}
      px={2}
      pb={{ base: 8, md: 10 }}
    >
      <Text
        color="text"
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
      >
        반가워요, {nickname ? `${nickname}님` : <Skeleton h={9} w="120px" />}
      </Text>
      <Text
        color="text.secondary"
        fontSize={{ base: "sm", md: "lg" }}
        fontWeight="medium"
      >
        오늘도 새로운 아이디어를 실현해보세요.
      </Text>
    </VStack>
  );
};
