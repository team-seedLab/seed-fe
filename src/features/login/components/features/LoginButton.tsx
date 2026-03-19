import { Button, Image } from "@chakra-ui/react";

import GoogleLogo from "../../_assets/google-symbol.webp";
import KakaoSymbol from "../../_assets/kakao-symbol.webp";
import { GOOGLE_LOGIN_URL, KAKAO_LOGIN_URL } from "../../constants";

type LoginProvider = "kakao" | "google";

type LoginButtonConfig = {
  label: string;
  iconSrc: string;
  iconAlt: string;
  bg: string;
  foreground: string;
  hoverBg: string;
  border?: string;
  borderColor?: string;
};

const LOGIN_BUTTON_CONFIG: Record<LoginProvider, LoginButtonConfig> = {
  kakao: {
    label: "카카오 로그인",
    iconSrc: KakaoSymbol,
    iconAlt: "Kakao Logo",
    bg: "login.kakao.bg",
    foreground: "login.kakao.foreground",
    hoverBg: "login.kakao.hover",
  },
  google: {
    label: "Google 로그인",
    iconSrc: GoogleLogo,
    iconAlt: "Google Logo",
    bg: "login.google.bg",
    foreground: "login.google.foreground",
    hoverBg: "login.google.hover",
    border: "1px solid",
    borderColor: "login.google.border",
  },
};

type Props = {
  provider: LoginProvider;
};

const redirectToKakaoLogin = () => {
  if (!KAKAO_LOGIN_URL) {
    throw new Error(
      "Kakao login URL is not configured. Set VITE_KAKAO_LOGIN_URL_LOCAL or VITE_KAKAO_LOGIN_URL_PROD.",
    );
  }

  window.location.assign(KAKAO_LOGIN_URL);
};

const redirectToGoogleLogin = () => {
  if (!GOOGLE_LOGIN_URL) {
    throw new Error(
      "Google login URL is not configured. Set VITE_GOOGLE_LOGIN_URL_LOCAL or VITE_GOOGLE_LOGIN_URL_PROD.",
    );
  }

  window.location.assign(GOOGLE_LOGIN_URL);
};

const LOGIN_HANDLER: Record<LoginProvider, () => void> = {
  kakao: redirectToKakaoLogin,
  google: redirectToGoogleLogin,
};

export const LoginButton = ({ provider }: Props) => {
  const config = LOGIN_BUTTON_CONFIG[provider];
  const onClick = LOGIN_HANDLER[provider];

  return (
    <Button
      w="full"
      h={12}
      bg={config.bg}
      color={config.foreground}
      border={config.border}
      borderColor={config.borderColor}
      fontSize={{ base: "sm", lg: "md" }}
      fontWeight="semibold"
      borderRadius="xl"
      _hover={{ bg: config.hoverBg }}
      position="relative"
      onClick={onClick}
    >
      <Image
        position="absolute"
        objectFit="contain"
        left={{ base: 4, sm: 5 }}
        boxSize={5}
        src={config.iconSrc}
        alt={config.iconAlt}
      />
      {config.label}
    </Button>
  );
};
