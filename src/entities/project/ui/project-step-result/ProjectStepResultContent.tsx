import ReactMarkdown, { type Components } from "react-markdown";

import { Box, Em, Link, Text } from "@chakra-ui/react";

const markdownComponents: Components = {
  a: ({ children, href }) => {
    const isExternalLink = href?.startsWith("http");

    return (
      <Link
        color="seed"
        href={href}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        target={isExternalLink ? "_blank" : undefined}
        textDecoration="underline"
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children }) => (
    <Box
      as="blockquote"
      borderColor="neutral.200"
      borderLeftWidth="4px"
      color="neutral.600"
      pl={4}
    >
      {children}
    </Box>
  ),
  code: ({ children }) => (
    <Box as="code" bg="neutral.100" borderRadius="sm" fontSize="sm" px={1}>
      {children}
    </Box>
  ),
  em: ({ children }) => <Em>{children}</Em>,
  h1: ({ children }) => (
    <Text as="h3" fontSize="xl" fontWeight="bold">
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text as="h4" fontSize="lg" fontWeight="bold">
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text as="h5" fontSize="md" fontWeight="bold">
      {children}
    </Text>
  ),
  li: ({ children }) => <Box as="li">{children}</Box>,
  ol: ({ children, start }) => (
    <Box asChild listStyleType="decimal" pl={5} spaceY={1}>
      <ol start={start}>{children}</ol>
    </Box>
  ),
  p: ({ children }) => <Text whiteSpace="pre-wrap">{children}</Text>,
  pre: ({ children }) => (
    <Box as="pre" bg="neutral.100" borderRadius="lg" overflowX="auto" p={3}>
      {children}
    </Box>
  ),
  strong: ({ children }) => (
    <Text as="strong" fontWeight="bold">
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
  emptyMessage: string;
};

export const ProjectStepResultContent = ({ content, emptyMessage }: Props) => {
  return (
    <Box
      bg="neutral.50"
      borderRadius="xl"
      color="neutral.900"
      fontSize={{ base: "xs", md: "sm" }}
      minH={60}
      overflowWrap="anywhere"
      p={{ base: 4, md: 6 }}
      spaceY={3}
      w="full"
    >
      {content.trim() ? (
        <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
      ) : (
        <Text color="neutral.400">{emptyMessage}</Text>
      )}
    </Box>
  );
};
