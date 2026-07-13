import { Button, Text, VStack } from "@chakra-ui/react";

type Props = {
  canSubmit: boolean;
  isPending: boolean;
};

export const UploadSubmitSection = ({ canSubmit, isPending }: Props) => {
  return (
    <VStack gap={4} w="full">
      <Button
        aria-label="로드맵 생성하기"
        bg="seed"
        borderRadius="lg"
        color="white"
        disabled={!canSubmit || isPending}
        fontSize="sm"
        fontWeight="bold"
        h={12}
        loading={isPending}
        maxW={52}
        px={6}
        type="submit"
        w="full"
        _disabled={{ bg: "seed", cursor: "not-allowed", opacity: 0.5 }}
        _hover={{ bg: "seed.hover" }}
        _active={{ bg: "seed.active" }}
      >
        로드맵 생성하기 →
      </Button>
      <Text color="neutral.600" fontSize="xs" textAlign="center">
        작성하신 내용은 로드맵 생성 및 추천에만 사용됩니다.
      </Text>
    </VStack>
  );
};
