import { Box } from "@chakra-ui/react";

type Props = {
  isActive: boolean;
};

export const ProjectStepIndicatorConnector = ({ isActive }: Props) => (
  <Box
    aria-hidden="true"
    bg={isActive ? "seed" : "neutral.100"}
    data-part="connector"
    data-state={isActive ? "active" : "inactive"}
    h="2px"
    left="50%"
    pointerEvents="none"
    position="absolute"
    top={{ base: "19px", md: "23px" }}
    w="100%"
  />
);
