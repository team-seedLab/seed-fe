import React from "react";

import { Icon, type IconProps } from "@chakra-ui/react";

export type { IconProps };

type SvgComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export const createIcon = (
  SvgComponent: SvgComponent,
  displayName?: string,
) => {
  const IconComponent = ({ color = "currentColor", ...props }: IconProps) => (
    <Icon as={SvgComponent as React.ElementType} color={color} {...props} />
  );

  IconComponent.displayName =
    displayName ?? SvgComponent.displayName ?? SvgComponent.name;

  return IconComponent;
};
