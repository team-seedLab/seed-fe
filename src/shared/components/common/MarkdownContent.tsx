import ReactMarkdown, { type Components } from "react-markdown";

import { Box, Em, Link, Text } from "@chakra-ui/react";
import remarkGfm from "remark-gfm";

const remarkPlugins = [remarkGfm];

const getTableCellTextAlign = (align?: string) => {
  if (align === "center" || align === "right") {
    return align;
  }

  return "left";
};

const markdownComponents: Components = {
  a: ({ children, href }) => {
    const isExternalLink = /^(https?:)?\/\//i.test(href ?? "");

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
  del: ({ children }) => <Text as="del">{children}</Text>,
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
  h4: ({ children }) => (
    <Text as="h6" fontSize="sm" fontWeight="bold">
      {children}
    </Text>
  ),
  h5: ({ children }) => (
    <Text as="h6" fontSize="sm" fontWeight="bold">
      {children}
    </Text>
  ),
  h6: ({ children }) => (
    <Text as="h6" fontSize="sm" fontWeight="bold">
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
  table: ({ children }) => (
    <Box overflowX="auto" w="full">
      <Box as="table" borderCollapse="collapse" minW="max-content" w="full">
        {children}
      </Box>
    </Box>
  ),
  td: ({ align, children }) => (
    <Box
      as="td"
      borderColor="neutral.200"
      borderWidth="1px"
      p={3}
      textAlign={getTableCellTextAlign(align)}
      verticalAlign="top"
    >
      {children}
    </Box>
  ),
  th: ({ align, children }) => (
    <Box
      as="th"
      bg="neutral.100"
      borderColor="neutral.200"
      borderWidth="1px"
      fontWeight="bold"
      p={3}
      textAlign={getTableCellTextAlign(align)}
      verticalAlign="top"
    >
      {children}
    </Box>
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

export const MarkdownContent = ({ content }: Props) => {
  return (
    <Box
      color="neutral.900"
      fontSize={{ base: "sm", md: "md" }}
      overflowWrap="anywhere"
      spaceY={3}
      w="full"
    >
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={remarkPlugins}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};
