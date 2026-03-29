import { Flex, Text } from "@chakra-ui/react";

type Props = {
  canSubmit: boolean;
  isPending: boolean;
  stepCount: number;
  onSubmit: () => void;
};

export const UploadSubmitSection = ({
  canSubmit,
  isPending,
  stepCount,
  onSubmit,
}: Props) => {
  const isDisabled = !canSubmit || isPending;

  return (
    <Flex align="center" direction="column" gap={6}>
      <Flex
        align="center"
        bg="seed"
        borderRadius="2xl"
        boxShadow="0px 8px 20px 0px rgba(152,201,92,0.25)"
        cursor={isDisabled ? "not-allowed" : "pointer"}
        gap={2}
        h={14}
        justify="center"
        maxW={96}
        opacity={isDisabled ? 0.5 : 1}
        px={8}
        transition="opacity 0.15s"
        w="full"
        _hover={{ opacity: isDisabled ? 0.5 : 0.85 }}
        onClick={onSubmit}
      >
        <Text color="white" fontWeight="bold">
          {stepCount}단계 로드맵 생성하기 →
        </Text>
      </Flex>
      <Text color="neutral.600" fontSize="xs" textAlign="center">
        작성하신 내용은 로드맵 생성 및 추천에만 사용됩니다.
      </Text>
    </Flex>
  );
};
