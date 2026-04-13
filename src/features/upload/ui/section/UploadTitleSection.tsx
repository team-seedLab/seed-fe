import { Box, Input } from "@chakra-ui/react";

type Props = {
  title: string;
  onChange: (value: string) => void;
};

export const UploadTitleSection = ({ title, onChange }: Props) => {
  return (
    <Box maxW={{ base: "full", md: "768px" }} w="full">
      <Input
        border="none"
        color={title ? "neutral.900" : "neutral.300"}
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        minH={{ base: "56px", md: "auto" }}
        placeholder="프로젝트 제목을 입력하세요"
        py={{ base: 2, md: 0 }}
        textAlign="center"
        value={title}
        _focusVisible={{ outline: "none", boxShadow: "none" }}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
};
