import { Box, Flex, Text } from "@chakra-ui/react";

import { ProjectContentCopyButton } from "../ProjectContentCopyButton";

import { PromptCardHeaderButton } from "./PromptCardHeaderButton";

type Props = {
  addedCount: number;
  copied: boolean;
  hasChanges: boolean;
  isDiffVisible: boolean;
  label: string;
  removedCount: number;
  showReset: boolean;
  onCopy: () => void;
  onReset?: () => void;
  onToggleDiff?: () => void;
};

export const PromptCardComparisonHeader = ({
  addedCount,
  copied,
  hasChanges,
  isDiffVisible,
  label,
  removedCount,
  showReset,
  onCopy,
  onReset,
  onToggleDiff,
}: Props) => {
  return (
    <Box borderBottom="1px solid" borderBottomColor="neutral.50" p={1.5}>
      <Flex
        align={{ base: "stretch", md: "center" }}
        bg="neutral.100"
        border="1px solid"
        borderColor="neutral.50"
        borderRadius={{ base: "2xl", md: "full" }}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 1 }}
        justify="space-between"
        p={1}
      >
        <Flex
          align="center"
          alignSelf={{ base: "flex-start", md: "auto" }}
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius="full"
          flexWrap="wrap"
          gap={{ base: 2, md: 3 }}
          px={3}
          py={1.5}
        >
          <Text
            color="neutral.900"
            fontSize={{ base: "2xs", md: "xs" }}
            fontWeight="bold"
          >
            {label}
          </Text>

          <Box bg="seed.subtle" borderRadius="full" px={1.5} py={0.5}>
            <Text color="seed" fontSize="2xs" fontWeight="bold">
              추가 {addedCount}
            </Text>
          </Box>
          <Box bg="pdf.bg" borderRadius="full" px={1.5} py={0.5}>
            <Text color="pdf" fontSize="2xs" fontWeight="bold">
              삭제 {removedCount}
            </Text>
          </Box>
        </Flex>

        <Flex
          align="center"
          alignSelf={{ base: "stretch", md: "auto" }}
          flexWrap="wrap"
          gap={{ base: 1, md: 1.5 }}
          justify={{ base: "flex-end", md: "initial" }}
        >
          {onToggleDiff && (
            <PromptCardHeaderButton
              disabled={!hasChanges}
              pressed={isDiffVisible}
              onClick={onToggleDiff}
            >
              차이보기
            </PromptCardHeaderButton>
          )}

          {showReset && onReset && (
            <PromptCardHeaderButton disabled={!hasChanges} onClick={onReset}>
              초기화
            </PromptCardHeaderButton>
          )}

          <ProjectContentCopyButton copied={copied} onCopy={onCopy} rounded />
        </Flex>
      </Flex>
    </Box>
  );
};
