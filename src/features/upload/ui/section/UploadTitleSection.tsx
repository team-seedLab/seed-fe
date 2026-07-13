import { Box, Input, VStack } from "@chakra-ui/react";

import { UploadSectionHeading } from "../../components";

type Props = {
  title: string;
  onChange: (value: string) => void;
};

export const UploadTitleSection = ({ title, onChange }: Props) => {
  return (
    <VStack align="stretch" gap={4} w="full">
      <UploadSectionHeading>프로젝트 제목</UploadSectionHeading>
      <Box pl={3}>
        <Input
          aria-label="프로젝트 제목"
          border="none"
          borderBottom="1px solid"
          borderBottomColor="neutral.300"
          borderRadius={0}
          color="neutral.900"
          fontSize="md"
          h={11}
          name="title"
          px={0}
          placeholder="제목을 입력하세요"
          value={title}
          _focusVisible={{
            borderBottomColor: "seed",
            boxShadow: "none",
            outline: "none",
          }}
          _placeholder={{ color: "text.placeholder" }}
          onChange={(e) => onChange(e.target.value)}
        />
      </Box>
    </VStack>
  );
};
