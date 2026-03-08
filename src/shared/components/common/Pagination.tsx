import { Flex, HStack, Text } from "@chakra-ui/react";

import { ArrowLeftIcon, ArrowRightIcon } from "@/shared/_assets/icons";

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
      <Flex
        align="center"
        justify="center"
        boxSize={8}
        borderRadius="lg"
        opacity={currentPage === 1 ? 0.5 : 1}
        cursor={currentPage === 1 ? "default" : "pointer"}
        _hover={currentPage > 1 ? { opacity: 0.7 } : undefined}
        transition="opacity 0.15s"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon boxSize={2.5} color="neutral.900" />
      </Flex>

      {visiblePages.map((page) => (
        <Flex
          key={page}
          align="center"
          justify="center"
          boxSize={8}
          borderRadius="lg"
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

      <Flex
        align="center"
        justify="center"
        boxSize={8}
        borderRadius="lg"
        opacity={currentPage === totalPages ? 0.5 : 1}
        cursor={currentPage === totalPages ? "default" : "pointer"}
        _hover={currentPage < totalPages ? { opacity: 0.7 } : undefined}
        transition="opacity 0.15s"
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
      >
        <ArrowRightIcon boxSize={2.5} color="neutral.900" />
      </Flex>
    </HStack>
  );
};
