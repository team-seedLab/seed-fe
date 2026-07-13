import { Text, Textarea, VStack } from "@chakra-ui/react";

type Props = {
  id: string;
  label: string;
  maxLength: number;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export const UploadIntentField = ({
  id,
  label,
  maxLength,
  placeholder,
  value,
  onChange,
}: Props) => {
  return (
    <VStack align="stretch" gap={2} w="full">
      <label htmlFor={id}>
        <Text as="span" color="neutral.900" fontSize="sm" fontWeight="semibold">
          {label}
        </Text>
      </label>
      <Textarea
        id={id}
        bg="neutral.50"
        border="none"
        borderRadius="xl"
        color="neutral.900"
        maxLength={maxLength}
        minH={{ base: 24, md: 28 }}
        name={id}
        p={4}
        placeholder={placeholder}
        resize="vertical"
        value={value}
        _focusVisible={{
          boxShadow: "0 0 0 1px var(--sd-colors-seed)",
          outline: "none",
        }}
        _placeholder={{ color: "text.placeholder" }}
        onChange={(e) => onChange(e.target.value)}
      />
      <Text color="neutral.600" fontSize="xs" textAlign="right">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()}자
      </Text>
    </VStack>
  );
};
