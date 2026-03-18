import { Link, useNavigate } from "react-router";

import Logo from "/logo.webp";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";

import { useAuth, useUserInfoStore } from "@/entities";
import { DoorOutIcon, FolderIcon, PersonIcon, ROUTE_PATHS } from "@/shared";

export const Header = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTE_PATHS.ROOT);
  };

  return (
    <Box as="header" h="headerHeight">
      <Flex
        h="full"
        w="full"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="neutral.100"
        px={4}
        position="relative"
      >
        <Link to={ROUTE_PATHS.ROOT}>
          <Image
            src={Logo}
            alt="Seed Logo"
            h={8}
            w="auto"
            objectFit="contain"
          />
        </Link>
        {!isAuthenticated && (
          <HStack
            gap={10}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            display={{ base: "none", md: "flex" }}
          >
            <Text
              color="neutral.600"
              cursor="pointer"
              _hover={{ color: "seed" }}
            >
              서비스 소개
            </Text>
            <Text
              color="neutral.600"
              cursor="pointer"
              _hover={{ color: "seed" }}
            >
              이용 가이드
            </Text>
          </HStack>
        )}
        <HStack gap={4}>
          {!isAuthenticated ? (
            <Button
              bg="seed"
              color="white"
              fontWeight="bold"
              rounded="xl"
              onClick={() => navigate(ROUTE_PATHS.LOGIN)}
              _hover={{ bg: "seed.hover" }}
            >
              시작하기
            </Button>
          ) : (
            <Menu.Root positioning={{ placement: "bottom-end" }}>
              <Menu.Trigger asChild>
                <HStack cursor="pointer" gap={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="neutral.800">
                    {userInfo?.nickname}
                  </Text>
                  <Avatar.Root
                    size="sm"
                    bg="neutral.50"
                    border="1px solid"
                    borderColor="neutral.100"
                  >
                    <Avatar.Fallback bg="neutral.50" color="neutral.400">
                      <PersonIcon boxSize={4} />
                    </Avatar.Fallback>
                    <Avatar.Image src={userInfo?.profileUrl} />
                  </Avatar.Root>
                </HStack>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    bg="white"
                    border="1px solid"
                    borderColor="neutral.100"
                    boxShadow="0px 10px 40px -10px rgba(0,0,0,0.05)"
                    borderRadius="2xl"
                    p={1.5}
                    minW="160px"
                  >
                    <Menu.Item
                      value="my-projects"
                      onClick={() => navigate(ROUTE_PATHS.MYPAGE)}
                      _hover={{ bg: "neutral.50" }}
                      px={3}
                      py={2}
                      borderRadius="xl"
                      cursor="pointer"
                    >
                      <HStack gap={3} w="full">
                        <FolderIcon boxSize={4} color="neutral.500" />
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="neutral.700"
                        >
                          내 프로젝트
                        </Text>
                      </HStack>
                    </Menu.Item>
                    <Menu.Separator borderColor="neutral.50" mx={2} my={1} />
                    <Menu.Item
                      value="logout"
                      onClick={handleLogout}
                      _hover={{ bg: "red.50" }}
                      px={3}
                      py={2}
                      borderRadius="xl"
                      cursor="pointer"
                    >
                      <HStack gap={3} w="full">
                        <DoorOutIcon boxSize={4} color="red.500" />
                        <Text fontSize="sm" fontWeight="medium" color="red.500">
                          로그아웃
                        </Text>
                      </HStack>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
