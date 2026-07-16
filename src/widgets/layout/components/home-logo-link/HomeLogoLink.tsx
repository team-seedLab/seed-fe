import { Link } from "react-router";

import Logo from "/logo.webp";
import { Image } from "@chakra-ui/react";

import { getUserEntryRoutePath, useAuth, useUserInfoStore } from "@/entities";
import { ROUTE_PATHS } from "@/shared";

type Props = {
  height: number;
};

export const HomeLogoLink = ({ height }: Props) => {
  const { isAuthenticated } = useAuth();
  const role = useUserInfoStore((state) => {
    return state.userInfo?.role ?? state.persistedProfile?.role;
  });
  const homePath = isAuthenticated
    ? getUserEntryRoutePath(role)
    : ROUTE_PATHS.ROOT;

  return (
    <Link to={homePath}>
      <Image src={Logo} alt="SEED" h={height} w="auto" objectFit="contain" />
    </Link>
  );
};
