import { Box, Input } from "@chakra-ui/react";

type Props = {
  title: string;
  onChange: (value: string) => void;
};

export const UploadTitleSection = ({ title, onChange }: Props) => {
  return (
    <Box maxW="768px" w="full">
      <Input
        border="none"
        color={title ? "neutral.900" : "neutral.300"}
        fontSize="4xl"
        fontWeight="bold"
        placeholder="프로젝트 제목을 입력하세요"
        textAlign="center"
        value={title}
        _focusVisible={{ outline: "none", boxShadow: "none" }}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
};
