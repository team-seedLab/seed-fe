import { Box, Text } from "@chakra-ui/react";

type Props = {
  content: string;
};

export const UploadAiMentorUserMessage = ({ content }: Props) => {
  return (
    <Box
      alignSelf="flex-end"
      bg="neutral.50"
      borderRadius="xl"
      maxW={{ base: "85%", md: "440px" }}
      px={4}
      py={3}
    >
      <Text
        color="neutral.900"
        fontSize="sm"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        {content}
      </Text>
    </Box>
  );
};
