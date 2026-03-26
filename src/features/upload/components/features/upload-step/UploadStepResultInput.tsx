import { Box, Text, Textarea, VStack } from "@chakra-ui/react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const UploadStepResultInput = ({ value, onChange }: Props) => {
  return (
    <VStack align="flex-start" gap={6} w="full">
      <Text
        color="neutral.900"
        fontSize="2xl"
        fontWeight="bold"
        lineHeight="1.4"
      >
        작업 결과 입력
      </Text>

      <Box position="relative" w="full">
        <Textarea
          _focusVisible={{
            outline: "none",
            boxShadow: "none",
          }}
          _placeholder={{ color: "neutral.300" }}
          bg="neutral.50"
          border="none"
          borderRadius="xl"
          color="neutral.900"
          fontSize="sm"
          fontWeight="medium"
          minH={60}
          onChange={(e) => onChange(e.target.value)}
          p={6}
          placeholder="이전 단계 프롬프트로 얻은 AI의 답변을 여기에 붙여넣어 주세요. 정보를 입력하면 다음 단계 로드맵이 더욱 정교해집니다."
          resize="vertical"
          value={value}
        />
        <Box
          backdropFilter="blur(2px)"
          bg="rgba(255,255,255,0.6)"
          borderRadius="4px"
          bottom="20px"
          position="absolute"
          px={2}
          py={1}
          right="20px"
        >
          <Text color="neutral.600" fontSize="xs" fontWeight="medium">
            Ctrl + V
          </Text>
        </Box>
      </Box>
    </VStack>
  );
};
