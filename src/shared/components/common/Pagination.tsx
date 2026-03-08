import { Flex, HStack, IconButton, Text } from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/_assets/icons";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const WINDOW_SIZE = 5;

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  if (totalPages <= 0) return null;

  const half = Math.floor(WINDOW_SIZE / 2);
  const start = Math.max(
    1,
    Math.min(currentPage - half, totalPages - WINDOW_SIZE + 1),
  );
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i,
  );

  return (
    <HStack gap={2} justify="center" w="full" pt={4}>
      <IconButton
        aria-label="이전 페이지"
        variant="ghost"
        disabled={currentPage === 1}
        borderRadius="lg"
        boxSize={8}
        minW={8}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon boxSize={2.5} color="neutral.900" />
      </IconButton>

      {visiblePages.map((page) => (
        <Flex
          key={page}
          align="center"
          justify="center"
          boxSize={8}
          borderRadius="lg"
          aria-label={`Page ${page}`}
          bg={currentPage === page ? "seed" : "transparent"}
          boxShadow={
            currentPage === page
              ? "0px 1px 2px 0px rgba(0,0,0,0.05)"
              : undefined
          }
          cursor="pointer"
          _hover={currentPage !== page ? { bg: "neutral.100" } : undefined}
          transition="background 0.15s"
          onClick={() => onPageChange(page)}
        >
          <Text
            color={currentPage === page ? "white" : "neutral.600"}
            fontSize="sm"
            fontWeight={currentPage === page ? "semibold" : "medium"}
          >
            {page}
          </Text>
        </Flex>
      ))}

      <IconButton
        aria-label="다음 페이지"
        variant="ghost"
        disabled={currentPage === totalPages}
        borderRadius="lg"
        boxSize={8}
        minW={8}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRightIcon boxSize={2.5} color="neutral.900" />
      </IconButton>
    </HStack>
  );
};
