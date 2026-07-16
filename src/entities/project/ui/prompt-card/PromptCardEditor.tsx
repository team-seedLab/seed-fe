import type { Ref } from "react";

import { Box, Textarea } from "@chakra-ui/react";

type Props = {
  content: string;
  editorRef?: Ref<HTMLTextAreaElement>;
  label: string;
  onContentChange: (content: string) => void;
};

export const PromptCardEditor = ({
  content,
  editorRef,
  label,
  onContentChange,
}: Props) => {
  return (
    <Box
      bg="neutral.50"
      display="flex"
      minH={{ base: 60, md: 80 }}
      p={{ base: 4, md: "28px" }}
    >
      <Textarea
        aria-label={label}
        autoresize
        bg="neutral.50"
        border="none"
        color="neutral.900"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="medium"
        flex={1}
        lineHeight="1.5"
        minH={0}
        onChange={(event) => onContentChange(event.target.value)}
        p={0}
        ref={editorRef}
        value={content}
        _focusVisible={{ boxShadow: "none", outline: "none" }}
      />
    </Box>
  );
};
