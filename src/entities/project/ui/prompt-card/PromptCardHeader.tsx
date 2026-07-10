import { Box, Flex, Text } from "@chakra-ui/react";

import { CopyIcon, DocumentTextIcon } from "@/shared";

type Props = {
  addedCount?: number;
  copied: boolean;
  hasChanges?: boolean;
  isDiffVisible?: boolean;
  label: string;
  removedCount?: number;
  showComparisonControls: boolean;
  showReset: boolean;
  onCopy: () => void;
  onReset?: () => void;
  onToggleDiff?: () => void;
};

const HeaderButton = ({
  children,
  disabled = false,
  pressed,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  pressed?: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      as="button"
      aria-pressed={pressed}
      bg={pressed ? "white" : "transparent"}
      border={pressed ? "1px solid" : "none"}
      borderColor="neutral.50"
      borderRadius="lg"
      color={pressed ? "neutral.900" : "neutral.600"}
      cursor={disabled ? "not-allowed" : "pointer"}
      disabled={disabled}
      fontSize={{ base: "2xs", md: "xs" }}
      fontWeight="semibold"
      onClick={onClick}
      opacity={disabled ? 0.5 : 1}
      px={{ base: 2, md: 3 }}
      py={{ base: 1.5, md: 2 }}
      type="button"
      _hover={{ bg: disabled ? "transparent" : "white" }}
    >
      {children}
    </Box>
  );
};

export const PromptCardHeader = ({
  addedCount = 0,
  copied,
  hasChanges = false,
  isDiffVisible = false,
  label,
  removedCount = 0,
  showComparisonControls,
  showReset,
  onCopy,
  onReset,
  onToggleDiff,
}: Props) => {
  return (
    <Flex
      align={{ base: "flex-start", md: "center" }}
      borderBottom="1px solid"
      borderBottomColor="neutral.50"
      direction={{
        base: showComparisonControls ? "column" : "row",
        md: "row",
      }}
      gap={{ base: 3, md: 0 }}
      justify="space-between"
      pb={{ base: 3, md: "17px" }}
      pt={{ base: 3, md: "16px" }}
      px={{ base: 4, md: 6 }}
    >
      <Flex align="center" flexWrap="wrap" gap={2}>
        <DocumentTextIcon boxSize={3} color="neutral.600" />
        <Text
          color="neutral.600"
          fontSize={{ base: "2xs", md: "xs" }}
          fontWeight="medium"
        >
          {label}
        </Text>

        {showComparisonControls && (
          <>
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
          </>
        )}
      </Flex>

      <Flex
        align="center"
        alignSelf={{ base: "stretch", md: "auto" }}
        gap={{ base: 1, md: 1.5 }}
        justify={{ base: "flex-end", md: "initial" }}
      >
        {showComparisonControls && onToggleDiff && (
          <HeaderButton
            disabled={!hasChanges}
            pressed={isDiffVisible}
            onClick={onToggleDiff}
          >
            차이보기
          </HeaderButton>
        )}

        {showReset && onReset && (
          <HeaderButton onClick={onReset}>초기화</HeaderButton>
        )}

        <Box
          as="button"
          bg="white"
          border="1px solid"
          borderColor="neutral.50"
          borderRadius="lg"
          boxShadow="0px 1px 2px 0px rgba(0,0,0,0.05)"
          cursor="pointer"
          onClick={onCopy}
          px={{ base: 3, md: "13px" }}
          py={{ base: 1.5, md: "7px" }}
          type="button"
          _hover={{ boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.08)" }}
        >
          <Flex align="center" gap={{ base: 1.5, md: "6px" }}>
            <CopyIcon boxSize={3} color={copied ? "seed" : "neutral.900"} />
            <Text
              color={copied ? "seed" : "neutral.900"}
              fontSize={{ base: "2xs", md: "xs" }}
              fontWeight="semibold"
              lineHeight="1.4"
            >
              {copied ? "복사됨 ✓" : "복사하기"}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
