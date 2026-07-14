import ReactMarkdown, { type Components } from "react-markdown";

import { Box, Link, Text } from "@chakra-ui/react";

const markdownComponents: Components = {
  a: ({ children, href }) => (
    <Link color="seed" href={href} textDecoration="underline">
      {children}
    </Link>
  ),
  h1: ({ children }) => (
    <Text as="h3" fontSize="xl" fontWeight="semibold">
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text as="h3" fontSize="xl" fontWeight="semibold">
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text as="h3" fontSize="md" fontWeight="semibold">
      {children}
    </Text>
  ),
  li: ({ children }) => (
    <Box as="li" color="neutral.900" fontSize={{ base: "sm", md: "md" }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box as="ol" listStyleType="decimal" pl={5} spaceY={1}>
      {children}
    </Box>
  ),
  p: ({ children }) => (
    <Text
      color="neutral.900"
      fontSize={{ base: "sm", md: "md" }}
      whiteSpace="pre-wrap"
    >
      {children}
    </Text>
  ),
  strong: ({ children }) => (
    <Text as="strong" color="neutral.900" fontWeight="bold">
      {children}
    </Text>
  ),
  ul: ({ children }) => (
    <Box as="ul" listStyleType="disc" pl={5} spaceY={1}>
      {children}
    </Box>
  ),
};

type Props = {
  content: string;
};

export const UploadAiMentorMarkdown = ({ content }: Props) => {
  return (
    <Box spaceY={2} wordBreak="break-word">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </Box>
  );
};
