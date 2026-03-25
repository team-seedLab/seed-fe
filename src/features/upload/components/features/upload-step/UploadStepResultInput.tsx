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
        ?묒뾽 寃곌낵 ?낅젰
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
          placeholder="?댁쟾 ?④퀎 ?꾨＼?꾪듃濡??살? AI???듬????ш린??遺숈뿬?ｌ뼱 二쇱꽭?? ?뺣낫瑜??낅젰?섎㈃ ?ㅼ쓬 ?④퀎 濡쒕뱶留듭씠 ?붿슧 ?뺢탳?댁쭛?덈떎."
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
