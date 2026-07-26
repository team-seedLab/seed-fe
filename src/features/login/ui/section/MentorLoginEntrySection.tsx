import { Link } from "react-router";

import { Text } from "@chakra-ui/react";

import { ROUTE_PATHS } from "@/shared";

export const MentorLoginEntrySection = () => {
  return (
    <Link to={ROUTE_PATHS.MENTOR_LOGIN}>
      <Text
        color="neutral.700"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        textAlign="center"
        textDecoration="underline"
        textUnderlineOffset="3px"
        _hover={{ color: "neutral.900" }}
      >
        멘토로 로그인하기
      </Text>
    </Link>
  );
};
