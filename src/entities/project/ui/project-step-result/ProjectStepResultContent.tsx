import { Box, Text } from "@chakra-ui/react";

import { MarkdownContent } from "@/shared";

type Props = {
  content: string;
  emptyMessage: string;
};

export const ProjectStepResultContent = ({ content, emptyMessage }: Props) => {
  return (
    <Box
      bg="neutral.50"
      borderRadius="xl"
      minH={60}
      p={{ base: 4, md: 6 }}
      w="full"
    >
      {content.trim() ? (
        <MarkdownContent content={content} />
      ) : (
        <Text color="neutral.400">{emptyMessage}</Text>
      )}
    </Box>
  );
};
