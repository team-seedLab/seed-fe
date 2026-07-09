import type { FormEvent } from "react";

import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";

type Props = {
  email: string;
  password: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export const MentorLoginFormSection = ({
  email,
  password,
  isSubmitting = false,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) => {
  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <VStack align="stretch" gap={3} w="full">
        <Input
          autoComplete="email"
          bg="neutral.50"
          border="none"
          borderRadius="8px"
          color="#111827"
          h="44px"
          name="email"
          placeholder="이메일 주소"
          px={4}
          value={email}
          _focusVisible={{
            borderColor: "seed",
            boxShadow: "0 0 0 1px var(--sd-colors-seed)",
          }}
          _placeholder={{
            color: "#6B7280",
            fontSize: "sm",
            fontWeight: "medium",
            letterSpacing: "-0.02em",
          }}
          onChange={(e) => onEmailChange(e.target.value)}
        />

        <Input
          autoComplete="current-password"
          bg="neutral.50"
          border="none"
          borderRadius="8px"
          color="#111827"
          h="44px"
          name="password"
          placeholder="비밀번호"
          px={4}
          type="password"
          value={password}
          _focusVisible={{
            borderColor: "seed",
            boxShadow: "0 0 0 1px var(--sd-colors-seed)",
          }}
          _placeholder={{
            color: "#6B7280",
            fontSize: "sm",
            fontWeight: "medium",
            letterSpacing: "-0.02em",
          }}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        {errorMessage ? (
          <Text color="red.500" fontSize="sm" px={1}>
            {errorMessage}
          </Text>
        ) : null}

        <Button
          bg="seed"
          borderRadius="8px"
          boxShadow="0px 1px 1px 0px rgba(0,0,0,0.05)"
          color="white"
          fontSize="sm"
          fontWeight="semibold"
          h="46px"
          loading={isSubmitting}
          mt={5}
          type="submit"
          w="full"
          _hover={{ bg: "seed.hover" }}
          _active={{ bg: "seed.active" }}
        >
          로그인
        </Button>
      </VStack>
    </Box>
  );
};
