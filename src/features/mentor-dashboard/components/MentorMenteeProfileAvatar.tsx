import { Avatar } from "@chakra-ui/react";

import { PersonIcon } from "@/shared";

type ProfileAvatarSize = "list" | "summary";

type Props = {
  name: string;
  profileUrl: string | null;
  size: ProfileAvatarSize;
};

const PROFILE_AVATAR_SIZE = {
  list: {
    avatar: { base: 10, md: 12 },
    icon: { base: 4, md: 5 },
  },
  summary: {
    avatar: { base: 16, md: 20 },
    icon: { base: 6, md: 8 },
  },
} as const;

export const MentorMenteeProfileAvatar = ({
  name,
  profileUrl,
  size,
}: Props) => {
  const sizeStyle = PROFILE_AVATAR_SIZE[size];

  return (
    <Avatar.Root bg="seed" boxSize={sizeStyle.avatar} flexShrink={0}>
      <Avatar.Fallback
        aria-label={`${name} 기본 프로필`}
        bg="seed"
        color="white"
      >
        <PersonIcon boxSize={sizeStyle.icon} />
      </Avatar.Fallback>
      {profileUrl && (
        <Avatar.Image
          alt={`${name} 프로필`}
          objectFit="cover"
          src={profileUrl}
        />
      )}
    </Avatar.Root>
  );
};
