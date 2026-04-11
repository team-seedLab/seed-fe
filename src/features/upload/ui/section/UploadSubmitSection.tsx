import { Button, Flex, Text } from "@chakra-ui/react";

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
    <Flex align="center" direction="column" gap={{ base: 4, md: 6 }} w="full">
      <Button
        bg="seed"
        borderRadius="2xl"
        boxShadow="0px 8px 20px 0px rgba(152,201,92,0.25)"
        color="white"
        disabled={isDisabled}
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="bold"
        h={{ base: 12, md: 14 }}
        maxW={{ base: "full", md: "384px" }}
        px={{ base: 6, md: 8 }}
        transition="opacity 0.15s, background-color 0.15s"
        w="full"
        whiteSpace="normal"
        _disabled={{ bg: "seed", cursor: "not-allowed", opacity: 0.5 }}
        _hover={{ bg: "seed.hover" }}
        onClick={onSubmit}
      >
        <Text
          color="white"
          fontWeight="bold"
          lineHeight="1.3"
          textAlign="center"
        >
          {stepCount}단계 로드맵 생성하기 →
        </Text>
      </Button>
      <Text color="neutral.600" fontSize="xs" textAlign="center">
        작성하신 내용은 로드맵 생성 및 추천에만 사용됩니다.
      </Text>
    </Flex>
  );
};
